package main

import (
	"../types"
	"html/template"
	"log"
	"net/http"
	"io/ioutil"
	"fmt"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"sync"
	"os"
)

var config = types.Config{}
var coords = types.StubCoords{}
var coordIndex = 0;

var coordMutex = &sync.Mutex{}

func getStartLocation() types.StubCoord {
	defer (func() {
		coordIndex++ // Next coord
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
		Latitude     float64
		Longitude    float64
	}{
		"ws://" + r.Host + "/location",
		location.Latitude,
		location.Longitude,
	}
	homeTemplate.Execute(w, data)
	//homeTemplate.Execute(w, "wss://" + r.Host + "/location")
}

func main() {
	log.SetFlags(0)

	// Set default host and port if no env
	var host = os.Getenv("HOST")
	var port = os.Getenv("PORT")
	if host == "" {
		host = "localhost"
	}
	if port == "" {
		port = "3100"
	}
	addr := fmt.Sprintf("%s:%s", host, port)

	config.Load("config.json")
	coords.Load("coords.json")

	router := mux.NewRouter()

	router.HandleFunc("/", home)

	hub := NewHub()
	go hub.Run()
	router.HandleFunc("/location", func(w http.ResponseWriter, r *http.Request) {
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
	log.Fatal(http.ListenAndServe(addr, handlers.CORS(originsOk)(router)))

	//log.Fatal(
	//	http.ListenAndServeTLS(
	//		*addr, "server/server.crt", "server/server.key", nil))
}
