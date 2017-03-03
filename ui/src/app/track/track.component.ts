import {Component, OnInit} from '@angular/core';
import {WebsocketService} from "../websocket.service"

@Component({
    selector: 'app-track',
    templateUrl: './track.component.html',
    styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {
    public websocket;

    constructor(private websocketService: WebsocketService) {
        this.websocket = websocketService.connect("ws://localhost:4100/location");
        this.websocket.subscribe(response => {
            let location = JSON.parse(response["data"]);
            console.info("response", JSON.stringify(location, null, 2));
        });
    }

    ngOnInit() {
    }

    echo() {
        this.websocket.next("foo")
    }
}
