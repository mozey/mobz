// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"../types"
	"encoding/json"
	"log"
	"sync"
)

// hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan []byte

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client

	// Coords of all clients connected to this hub
	coords      map[int64]types.UserCoord
	coordsMutex *sync.Mutex
}

func NewHub() *Hub {
	return &Hub{
		broadcast:   make(chan []byte),
		register:    make(chan *Client),
		unregister:  make(chan *Client),
		clients:     make(map[*Client]bool),
		coords:      make(map[int64]types.UserCoord),
		coordsMutex: &sync.Mutex{},
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		case message := <-h.broadcast:
			m := types.UserCoord{}
			// Ignore message if not valid json
			if err := json.Unmarshal([]byte(message), &m); err == nil {
				// Update coord map for this user
				h.coords[m.UserID] = m
				s, err := json.Marshal(h.coords)
				if err != nil {
					log.Fatal(err)
				}
				// Broadcast coord map
				for client := range h.clients {
					select {
					//case client.send <- message:
					case client.send <- []byte(s):
					default:
						close(client.send)
						delete(h.clients, client)
					}
				}
			} else {
				log.Print(err)
				log.Print(string(message))
			}
		}
	}
}
