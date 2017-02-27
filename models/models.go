package models

import (
	"time"
	"os"
	"encoding/json"
	"fmt"
	"log"
)

type Token struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   int `json:"expires_in"`
	TokenType   string `json:"token_type"`
}

type Journey struct {
	ID             string `json:"id"`
	Href           string `json:"href"`
	Geometry       struct {
					   Type        string `json:"type"`
					   Coordinates []struct {
						   Num0 float64 `json:"0"`
						   Num1 float64 `json:"1"`
					   } `json:"coordinates"`
				   } `json:"geometry"`
	Time           time.Time `json:"time"`
	TimeType       string `json:"timeType"`
	Profile        string `json:"profile"`
	FareProducts   []interface{} `json:"fareProducts"`
	MaxItineraries int `json:"maxItineraries"`
	Only           struct {
					   Agencies []interface{} `json:"agencies"`
					   Modes    []interface{} `json:"modes"`
				   } `json:"only"`
	Omit           struct {
					   Agencies []interface{} `json:"agencies"`
					   Modes    []interface{} `json:"modes"`
				   } `json:"omit"`
	Itineraries    []struct {
		ID            string `json:"id"`
		Href          string `json:"href"`
		DepartureTime time.Time `json:"departureTime"`
		ArrivalTime   time.Time `json:"arrivalTime"`
		Distance      struct {
						  Value int `json:"value"`
						  Unit  string `json:"unit"`
					  } `json:"distance"`
		Duration      int `json:"duration"`
		Legs          []struct {
			Href       string `json:"href"`
			Type       string `json:"type"`
			Behaviour  string `json:"behaviour"`
			Distance   struct {
						   Value int `json:"value"`
						   Unit  string `json:"unit"`
					   } `json:"distance"`
			Duration   int `json:"duration"`
			Waypoints  []struct {
				Location      struct {
								  Address  string `json:"address"`
								  Geometry struct {
											   Type        string `json:"type"`
											   Coordinates []float64 `json:"coordinates"`
										   } `json:"geometry"`
							  } `json:"location,omitempty"`
				ArrivalTime   time.Time `json:"arrivalTime"`
				DepartureTime time.Time `json:"departureTime"`
				Stop          struct {
								  ID       string `json:"id"`
								  Href     string `json:"href"`
								  Agency   struct {
											   ID      string `json:"id"`
											   Href    string `json:"href"`
											   Name    string `json:"name"`
											   Culture string `json:"culture"`
										   } `json:"agency"`
								  Name     string `json:"name"`
								  Geometry struct {
											   Type        string `json:"type"`
											   Coordinates []float64 `json:"coordinates"`
										   } `json:"geometry"`
								  Modes    []string `json:"modes"`
							  } `json:"stop,omitempty"`
			} `json:"waypoints"`
			Geometry   struct {
						   Type        string `json:"type"`
						   Coordinates []struct {
							   Num0 float64 `json:"0"`
							   Num1 float64 `json:"1"`
						   } `json:"coordinates"`
					   } `json:"geometry"`
			Directions []struct {
				Instruction string `json:"instruction"`
				Distance    struct {
								Value int `json:"value"`
								Unit  string `json:"unit"`
							} `json:"distance"`
			} `json:"directions,omitempty"`
			Fare       struct {
						   Description string `json:"description"`
						   FareProduct struct {
										   ID          string `json:"id"`
										   Href        string `json:"href"`
										   Agency      struct {
														   ID      string `json:"id"`
														   Href    string `json:"href"`
														   Name    string `json:"name"`
														   Culture string `json:"culture"`
													   } `json:"agency"`
										   Name        string `json:"name"`
										   IsDefault   bool `json:"isDefault"`
										   Description string `json:"description"`
									   } `json:"fareProduct"`
						   Cost        struct {
										   Amount       float64 `json:"amount"`
										   CurrencyCode string `json:"currencyCode"`
									   } `json:"cost"`
						   Messages    []interface{} `json:"messages"`
					   } `json:"fare,omitempty"`
			Line       struct {
						   ID         string `json:"id"`
						   Href       string `json:"href"`
						   Agency     struct {
										  ID      string `json:"id"`
										  Href    string `json:"href"`
										  Name    string `json:"name"`
										  Culture string `json:"culture"`
									  } `json:"agency"`
						   Name       string `json:"name"`
						   ShortName  string `json:"shortName"`
						   Mode       string `json:"mode"`
						   Colour     string `json:"colour"`
						   TextColour string `json:"textColour"`
					   } `json:"line,omitempty"`
			Vehicle    struct {
						   Designation string `json:"designation"`
					   } `json:"vehicle,omitempty"`
		} `json:"legs"`
	} `json:"itineraries"`
}

type Config struct {
	Wimt struct {
			 ConnectUrl   string `json:"connectUrl"`
			 ApiUrl       string `json:"apiUrl"`
			 ClientID     string `json:"clientId"`
			 ClientSecret string `json:"clientSecret"`
		 } `json:"wimt"`
}

func (c *Config) Load(configPath string) {
	// Override default config
	file, err := os.Open(configPath)
	if err == nil {
		decoder := json.NewDecoder(file)
		err = decoder.Decode(&c)
		if err != nil {
			log.Fatal(err)
		}
	} else {
		log.Fatal(fmt.Sprintf("Config path '%s' does not exist", configPath))
	}
}

