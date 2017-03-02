package main

import (
	"flag"
	"html/template"
	"log"
	"net/http"
	"io/ioutil"
	"fmt"
)

var addr = flag.String("addr", "localhost:4100", "http service address")

func home(w http.ResponseWriter, r *http.Request) {
	// TODO index.html should be compiled into the bin,
	// see https://github.com/jteeuwen/go-bindata
	index := "index.html"
	s, err := ioutil.ReadFile(index)
	homeTemplate := template.Must(template.New("").Parse(string(s)))
	if err != nil {
		panic(fmt.Sprintf("%s not found", index))
	}
	homeTemplate.Execute(w, "ws://" + r.Host + "/location")
}

func main() {
	flag.Parse()
	log.SetFlags(0)
	//http.HandleFunc("/echo", echo)
	http.HandleFunc("/", home)

	hub := NewHub()
	go hub.Run()
	http.HandleFunc("/location", func(w http.ResponseWriter, r *http.Request) {
		ServeWs(hub, w, r)
	})

	// TODO Compile static resources into the bin,
	// see https://github.com/elazarl/go-bindata-assetfs
	fs := http.FileServer(http.Dir("./"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	log.Fatal(http.ListenAndServe(*addr, nil))
}
