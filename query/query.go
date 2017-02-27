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

func main() {
	config.Load("./config.json")
	token := getToken()
	//b, _ := json.MarshalIndent(config, "", "    ")
	b, _ := json.MarshalIndent(token, "", "    ")
	fmt.Println(string(b))
}

