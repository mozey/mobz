// Inspired by
// https://github.com/gorilla/websocket/tree/master/examples/chat/hub.go

package main

import (
	"encoding/json"
	"log"
)

var data = Data{}

// hub maintains the set of active clients
// and broadcasts messages to the clients.
type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// Inbound message event from client,
	// update data and broadcast to clients
	broadcast chan *Client

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client
}

func NewHub() *Hub {
	return &Hub{
		broadcast:  make(chan *Client),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			// TODO Limit number of clients allowed per Tag?
			if len(h.clients) < config.MaxHubUsers {
				h.clients[client] = true
			} else {
				msg := "Too many connections"
				log.Println(msg)
				client.send <- []byte(msg)
			}

		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}

		case updateClient := <-h.broadcast:
			if !data.Initialised {
				data.Users = make(map[JsonString]User)
				for client := range h.clients {
					if len(client.User.Username) > 0 {
						data.Users[client.User.Username] = client.User
					}
				}
				data.Initialised = true
			}
			data.Users[updateClient.User.Username] = updateClient.User

			b, err := json.Marshal(data)
			if err != nil {
				log.Fatal(err)
			}

			for client := range h.clients {
				select {
				case client.send <- b:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
		}
	}
}
