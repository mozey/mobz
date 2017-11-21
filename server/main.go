package main

import (
	"flag"
	"fmt"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
)

var config Config

var addr = flag.String(
	// Local connections only
	//"addr", "localhost:4100", "Default service address")
	// Listen on all interfaces
	"addr", "0.0.0.0:4100", "Default service address")

func home(w http.ResponseWriter, r *http.Request) {
	// TODO index.html should be compiled into the bin,
	// see https://github.com/jteeuwen/go-bindata
	index := "index.html"
	s, err := ioutil.ReadFile(index)
	homeTemplate := template.Must(template.New("").Parse(string(s)))
	if err != nil {
		panic(fmt.Sprintf("%s not found", index))
	}

	data := struct {
		WebSocketUrl string
	}{
		// http
		//"ws://" + r.Host + "/location",
		// https
		"wss://" + r.Host + "/location",
	}
	homeTemplate.Execute(w, data)
}

func main() {
	log.SetFlags(log.Lshortfile)

	config.Load("config.json")

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
