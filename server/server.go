package main

import (
	"../models"
	"flag"
	"fmt"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"sync"
)

// TODO Allow users to create links,
// anyone with a valid Mobz can join the mob

var addr = flag.String(
	//"addr", "localhost:4100", "Default service address")
	"addr", "0.0.0.0:4100", "Default service address")

var config = models.Config{}

// TODO Lookup start location using IP Address,
// default coords on index is for testing only,
// add a flag to toggle the behaviour
var coords = models.UserCoords{}
var coordIndex = 0

var coordMutex = &sync.Mutex{}

func getStartLocation() models.UserCoord {
	defer (func() {
		coordIndex++                                // Next coord
		coordIndex = coordIndex % len(coords.Start) // Wrap around
	})()
	coordMutex.Lock()
	coord := coords.Start[coordIndex]
	coordMutex.Unlock()
	return coord
}

func home(w http.ResponseWriter, r *http.Request) {
	// TODO index.html should be compiled into the bin,
	// see https://github.com/jteeuwen/go-bindata
	index := "index.html"
	s, err := ioutil.ReadFile(index)
	homeTemplate := template.Must(template.New("").Parse(string(s)))
	if err != nil {
		panic(fmt.Sprintf("%s not found", index))
	}

	location := getStartLocation()
	data := struct {
		WebSocketUrl string
		Mobz         string
		UserID       int64
		Latitude     float64
		Longitude    float64
	}{
		//"ws://" + r.Host + "/location",
		"wss://" + r.Host + "/location",
		location.Mobz,
		location.UserID,
		location.Latitude,
		location.Longitude,
	}
	homeTemplate.Execute(w, data)
}

func main() {
	log.SetFlags(log.Lshortfile)

	config.Load("config.json")
	coords.Load("coords.json")

	router := mux.NewRouter()

	router.HandleFunc("/", home)

	router.HandleFunc("/echo", home)

	hub := NewHub()
	go hub.Run()
	router.HandleFunc(
		"/location", func(w http.ResponseWriter, r *http.Request) {
			ServeWs(hub, w, r)
		})

	// TODO Compile static resources into the bin,
	// see https://github.com/elazarl/go-bindata-assetfs
	router.PathPrefix("/assets/").Handler(
		http.StripPrefix(
			"/assets/", http.FileServer(http.Dir("../web/src/assets"))))

	// Allow CORS
	// http://stackoverflow.com/a/40987420/639133
	originsOk := handlers.AllowedOrigins([]string{"*"})
	log.Print(fmt.Sprintf("Listening on %s", *addr))
	//log.Fatal(http.ListenAndServe(*addr, handlers.CORS(originsOk)(router)))

	log.Fatal(
		http.ListenAndServeTLS(
			*addr, "mobz.crt", "mobz.key",
			handlers.CORS(originsOk)(router)))
}
