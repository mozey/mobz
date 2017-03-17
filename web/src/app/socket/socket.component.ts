// Example usage of websocket with location service

import {Component, OnInit} from '@angular/core';
import {WebsocketService} from "../websocket.service"
import {GeolocationService} from "../geolocation.service";

@Component({
    selector: 'app-socket',
    templateUrl: './socket.component.html',
    styleUrls: ['./socket.component.css']
})
export class SocketComponent implements OnInit {
    public websocket;
    public messages;

    constructor(private websocketService: WebsocketService,
                private geolocation: GeolocationService) {
        this.websocket = websocketService.connect(
            "ws://localhost:4100/location");
        this.messages = [];
        this.websocket.subscribe(response => {
            let location = JSON.parse(response["data"]);
            this.messages.push(JSON.stringify(location))
        });
    }

    ngOnInit() {
    }

    echo() {
        this.geolocation.getCurrentPosition().subscribe(position => {
            let coord = {
                "latitude": Number(position.coords.latitude),
                "longitude": Number(position.coords.longitude),
                "success": true
            };
            this.websocket.next(coord)
        });
    }
}
