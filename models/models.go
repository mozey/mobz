package models

import (
	"os"
	"encoding/json"
	"fmt"
	"log"
)

type Config struct {
	Wimt struct {
			 ConnectUrl   string `json:"connectUrl"`
			 ApiUrl       string `json:"apiUrl"`
			 ClientID     string `json:"clientId"`
			 ClientSecret string `json:"clientSecret"`
		 } `json:"wimt"`
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
		log.Fatal(fmt.Sprintf("Config path '%s' does not exist", path))
	}
}

type WebSocketRequest struct {
	Route  string `json:"route"`
	Params []struct {
		Key   string `json:"key"`
		Value string `json:"value"`
	} `json:"params"`
}

type UserCoord struct {
	Mobz        string `json:"mobz"`
	UserID      int64 `json:"user_id"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	Description string `json:"description"`
	Success     bool `json:"success"`
}
type UserCoords struct {
	Start []UserCoord `json:"start"`
}

func (c *UserCoords) Load(path string) {
	file, err := os.Open(path)
	if err == nil {
		decoder := json.NewDecoder(file)
		err = decoder.Decode(&c)
		if err != nil {
			log.Fatal(err)
		}
	} else {
		log.Fatal(fmt.Sprintf("Coords stub '%s' does not exist", path))
	}
}

// LocationReq is the request to the location websocket
type LocationReq struct {
	Mobz        string `json:"mobz"`
	UserID      int64 `json:"user_id"`
}

// LocationResp is the response from the location websocket
type LocationResp struct {

}
