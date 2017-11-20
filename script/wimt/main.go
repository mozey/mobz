package main

import (
	"../../models"
	"fmt"
	//"net/url"
	"net/http"
	//"encoding/json"
	"log"
	"encoding/json"
	"net/url"
	"bytes"
	"time"
	"io/ioutil"
)

var config = models.Config{}
var token = models.Token{}

func checkHttpResp(resp *http.Response, err error) {
	if err != nil {
		log.Fatal(err)
	}
	if resp.StatusCode < 200 || resp.StatusCode > 299 {
		log.Fatal(fmt.Sprintf("%v %v", resp.StatusCode, resp.Status))
	}
}

func validToken() bool {
	// Token not initialized?
	if token.AccessToken == "" {
		return false
	}

	// Token expired?
	diff := token.ExpiresAt.Sub(token.CreatedAt)
	if diff <= 0 {
		return false
	}

	// Token is valid
	return true
}

func setToken() {
	if validToken() {
		return
	}

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

	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}
    //bodyString := string(bodyBytes)
	//fmt.Println(bodyString)

	err = json.Unmarshal(bodyBytes, &token)
	if err != nil {
		log.Fatal(err)
	}

	// Set ExpiresAt so it can be checked to see if the token is still valid
	loc, _ := time.LoadLocation("UTC")
	token.CreatedAt = time.Now().In(loc)
	token.ExpiresAt = time.Now().In(loc).Add(
		time.Duration(token.ExpiresIn) * time.Second)

	//b, _ := json.MarshalIndent(token, "", "    ")
	//fmt.Println(string(b))
}

func getJourney() models.Journey {
	setToken()

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
	"time": "2017-06-21T10:55:25.575Z",
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

	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}
    bodyString := string(bodyBytes)
	fmt.Println(bodyString)

	var journey models.Journey
	err = json.Unmarshal(bodyBytes, &journey)
	if err != nil {
		log.Fatal(err)
	}

	return journey
}

func main() {
	log.SetFlags(log.Ldate | log.Ltime | log.LUTC | log.Lshortfile)

	config.Load("server/config.json")

	// Query journey endpoint
	//journey := getJourney()
	getJourney()

	//journey := Journey{}
	//journey.Load("ui/src/assets/journey2.json")

	//b, _ := json.MarshalIndent(config, "", "    ")
	//b, _ := json.MarshalIndent(journey, "", "    ")
	//fmt.Println(string(b))
}





