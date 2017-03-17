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

var LinkID int64 = 123

// hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	clients map[int64]map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan []byte

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client

	// Coords of all clients connected to this hub
	coords map[int64]types.UserCoord
	mutex  *sync.Mutex
}

func NewHub() *Hub {
	return &Hub{
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[int64]map[*Client]bool),
		coords:     make(map[int64]types.UserCoord),
		mutex:      &sync.Mutex{},
	}
}

func (h *Hub) Run() {
	for {
		select {
		// TODO Limit number of clients allowed per links
		case client := <-h.register:
			if _, keyFound := h.clients[LinkID]; keyFound {
				h.clients[LinkID][client] = true
			} else {
				h.clients[LinkID] = map[*Client]bool{
					client: true,
				}
			}
		case client := <-h.unregister:
			if _, ok := h.clients[LinkID][client]; ok {
				delete(h.clients[LinkID], client)
				close(client.send)
			}

		case message := <-h.broadcast:
			m := types.UserCoord{}
			if err := json.Unmarshal([]byte(message), &m); err == nil {
				// Update coord map for this user
				h.mutex.Lock()
				h.coords[m.UserID] = m
				h.mutex.Unlock()
				s, err := json.Marshal(h.coords)
				if err != nil {
					log.Fatal(err)
				}

				// Broadcast coord map
				for client := range h.clients[LinkID] {
					select {
					case client.send <- []byte(s):
					default:
						close(client.send)
						delete(h.clients[LinkID], client)
					}
				}

			} else {
				// message is not valid json
				log.Print(err)
				log.Print(string(message))
			}
		}
	}
}
