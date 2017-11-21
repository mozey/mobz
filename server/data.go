package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
)

type User struct {
	Tag      JsonString `json:"tag"`
	Username JsonString `json:"username"`
	Status   JsonString `json:"status"`
	Success  bool       `json:"success"`
	Meta     struct {
		Lat JsonString `json:"lat"`
		Lon JsonString `json:"lon"`
	} `json:"meta"`
}

type Data struct {
	Users       map[JsonString]User `json:"users"`
	Initialised bool
}

func (c *Data) Load(path string) {
	file, err := os.Open(path)
	if err == nil {
		decoder := json.NewDecoder(file)
		err = decoder.Decode(&c)
		if err != nil {
			log.Fatal(err)
		}
	} else {
		log.Fatal(fmt.Sprintf("File '%s' does not exist", path))
	}
}
