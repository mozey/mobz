package main

import (
	"fmt"
	"../models"
	//"net/url"
	"net/http"
	//"encoding/json"
	"log"
	"encoding/json"
	"net/url"
	"bytes"
)

var config = models.Config{}

func checkHttpResp(resp *http.Response, err error) {
	if err != nil {
		log.Fatal(err)
	}
	if resp.StatusCode < 200 || resp.StatusCode > 299 {
		log.Fatal(fmt.Sprintf("%v %v", resp.StatusCode, resp.Status))
	}
}

func getToken() models.Token {
	client := http.Client{}

	data := url.Values{}
	data.Set("client_id", config.Wimt.ClientID)
	data.Set("client_secret", config.Wimt.ClientSecret)
	data.Set("grant_type", "client_credentials")
	data.Set("scope", "transportapi:all")

	req, _ := http.NewRequest(
		"POST", config.Wimt.ConnectUrl, bytes.NewBufferString(data.Encode()))
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := client.Do(req)

	checkHttpResp(resp, err)
	defer resp.Body.Close()

	dec := json.NewDecoder(resp.Body)
	var token models.Token
	err = dec.Decode(&token)
	if err != nil {
		log.Fatal(err)
	}

	return token
}

func getJourney(token models.Token) models.Journey {
	client := http.Client{}

	body := `
{
	"geometry": {
		"type": "Multipoint",
		"coordinates": [
			[
				18.3799843,
				-33.9510746
			],
			[
				18.421789,
				-33.906111
			]
		]
	},
	"time": "2017-02-28T10:55:25.575Z",
	"timeType": "DepartAfter",
	"profile": "ClosestToTime",
	"maxItineraries":5
}
`

	req, _ := http.NewRequest(
		"POST",
		fmt.Sprintf("%v/journeys", config.Wimt.ApiUrl),
		bytes.NewBufferString(body))
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", token.AccessToken))
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)

	checkHttpResp(resp, err)
	defer resp.Body.Close()

	dec := json.NewDecoder(resp.Body)
	var journey models.Journey
	err = dec.Decode(&journey)
	if err != nil {
		log.Fatal(err)
	}

	return journey
}

func main() {
	config.Load("./config.json")
	//token := getToken()
	//journey := getJourney(token)

	journey := models.Journey{}
	journey.Load("ui/src/assets/journey2.json")

	//b, _ := json.MarshalIndent(config, "", "    ")
	b, _ := json.MarshalIndent(journey, "", "    ")
	fmt.Println(string(b))
}

