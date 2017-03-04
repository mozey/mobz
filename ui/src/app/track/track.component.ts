import {Component, OnInit} from '@angular/core';
import {WebsocketService} from "../websocket.service"

@Component({
    selector: 'app-track',
    templateUrl: './track.component.html',
    styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {
    public websocket;
    public origin;
    public destination;

    constructor(private websocketService: WebsocketService) {
        // this.websocket = websocketService.connect("ws://localhost:4100/location");
        // this.websocket.subscribe(response => {
        //     let location = JSON.parse(response["data"]);
        //     console.info("response", JSON.stringify(location, null, 2));
        // });
        this.origin = { longitude: 18.368264, latitude: -34.020874 };  // its a example aleatory position
        this.destination = { longitude: 18.468704, latitude: -34.107487 };  // its a example aleatory position
    }

    ngOnInit() {
    }

    echo() {
        this.websocket.next("foo")
    }
}
