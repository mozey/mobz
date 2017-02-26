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
        this.websocket = websocketService.connect("ws://localhost:3001/echo");
        this.websocket.subscribe(response => {
            console.info("response", response);
        });
        (<any>window).ws = this.websocket;
    }

    ngOnInit() {
    }

    echo() {
        this.websocket.next("foo")
    }
}
