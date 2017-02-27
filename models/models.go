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

type Point struct {
	Lng float64 `json:"lng"`
	Lat float64 `json:"lat"`
}
type WimtPoint struct {
	Type        string `json:"type"`
	Coordinates []float64 `json:"coordinates"`
}
type WimtMultiPoint struct {
	Type        string `json:"type"`
	Coordinates [][]float64 `json:"coordinates"`
}
type Geometry struct {
	Type        string `json:"type"`
	Coordinates []Point `json:"coordinates"`
}

func (geometry *Geometry) UnmarshalJSON(bArr []byte) (err error) {
	point, multiPoint := WimtPoint{}, WimtMultiPoint{}
	// Point
	if err = json.Unmarshal(bArr, &point); err == nil {
		g := Geometry{}
		g.Type = point.Type
		g.Coordinates = []Point{{
			Lng: point.Coordinates[0],
			Lat: point.Coordinates[1],
		}}
		*geometry = g
		return
	}
	// LineString and MultiPoint
	if err = json.Unmarshal(bArr, &multiPoint); err == nil {
		g := Geometry{}
		g.Type = point.Type
		g.Coordinates = make([]Point, len(multiPoint.Coordinates))
		for i, coord := range multiPoint.Coordinates {
			g.Coordinates[i] = Point{
				Lng: coord[0],
				Lat: coord[1],
			}
		}
		*geometry = g
		return
	}
	return
}

type Journey struct {
	ID             string `json:"id"`
	Href           string `json:"href"`
	Geometry       Geometry `json:"geometry"`
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
								  Geometry Geometry `json:"geometry"`
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
								  Geometry Geometry `json:"geometry"`
								  Modes    []string `json:"modes"`
							  } `json:"stop,omitempty"`
			} `json:"waypoints"`
			Geometry   Geometry `json:"geometry"`
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

func (j *Journey) Load(journeyPath string) {
	// Override default config
	file, err := os.Open(journeyPath)
	if err == nil {
		decoder := json.NewDecoder(file)
		err = decoder.Decode(&j)
		if err != nil {
			log.Fatal(err)
		}
	} else {
		log.Fatal(fmt.Sprintf("Journey path '%s' does not exist", journeyPath))
	}
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

