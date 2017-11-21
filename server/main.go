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
	// Listen on all interfaces
	"addr", "0.0.0.0:4100", "Default service address")

var router *mux.Router
var hubs map[string]*Hub

func home(w http.ResponseWriter, r *http.Request) {
	// TODO Landing pages should be compiled into the bin,
	// see https://github.com/jteeuwen/go-bindata
	index := "index.html"
	s, err := ioutil.ReadFile(index)
	homeTemplate := template.Must(template.New("").Parse(string(s)))
	if err != nil {
		panic(fmt.Sprintf("%s not found", index))
	}

	data := struct {
		Host string
	}{
		r.Host,
	}
	homeTemplate.Execute(w, data)
}

func hub(w http.ResponseWriter, r *http.Request) {
	v := mux.Vars(r)
	tag := v["tag"]
	hub, found := hubs[tag]
	if !found {
		hub = NewHub()
		hubs[tag] = hub
		go hub.Run()
		router.HandleFunc(
			fmt.Sprintf("/update/%v", tag),
			func(w http.ResponseWriter, r *http.Request) {
				ServeWs(hub, w, r)
			})
	}
	w.Write([]byte(fmt.Sprintf("%v clients connected", len(hub.clients))))
}

func main() {
	log.SetFlags(log.Lshortfile)

	config.Load("config.json")

	router = mux.NewRouter()

	router.HandleFunc("/", home)

	router.HandleFunc("/hub/{tag}", hub)
	hubs = make(map[string]*Hub)

	// TODO Compile static resources into the bin,
	// see https://github.com/elazarl/go-bindata-assetfs
	router.PathPrefix("/assets/").Handler(
		http.StripPrefix(
			"/assets/", http.FileServer(http.Dir("../web/src/assets"))))

	// Allow CORS
	// http://stackoverflow.com/a/40987420/639133
	originsOk := handlers.AllowedOrigins([]string{"*"})
	log.Print(fmt.Sprintf("Listening on %s", *addr))
	log.Fatal(
		http.ListenAndServeTLS(
			*addr, "mobz.crt", "mobz.key",
			handlers.CORS(originsOk)(router)))
}
