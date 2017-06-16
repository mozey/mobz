package models

import (
	"testing"
	"fmt"
	"encoding/json"
	"os"
	"log"
	"io/ioutil"
)

func TestUnMarshallJourney(t *testing.T) {
	journeyPath := "./journey.json"

	// Decode original json to sort keys
	var j1 interface{}
	file, err := os.Open(journeyPath)
	if err == nil {
		decoder := json.NewDecoder(file)
		err = decoder.Decode(&j1)
		if err != nil {
			log.Fatal(err)
		}
	} else {
		log.Fatal(err)
	}
	b1, _ := json.MarshalIndent(j1, "", "    ")
	err = ioutil.WriteFile("./a.json", b1, 0644)
	if err != nil {
		log.Fatal(err)
	}

	// Custom decode json using Journey type
	var j2 Journey
	j2.Load("./journey.json")
	b2, _ := json.MarshalIndent(j2, "", "    ")
	err = ioutil.WriteFile("./b.json", b2, 0644)
	if err != nil {
		log.Fatal(err)
	}

	// Assert custom decode and encode/marshall is idempotent

}

