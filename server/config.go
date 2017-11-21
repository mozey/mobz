package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
)

type Config struct {
	ServerDir   string `json:"serverDir"`
	MaxHubUsers int    `json:"maxHubUsers"`
}

func (c *Config) Load(path string) {
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
