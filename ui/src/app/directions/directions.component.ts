// Example usage of MapDirectionsDirective,
// use Google Directions API to display directions
// from origin to destination with waypoints

import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-directions',
    templateUrl: './directions.component.html',
    styleUrls: ['./directions.component.css']
})
export class DirectionsComponent implements OnInit {
    public websocket;
    public origin;
    public destination;
    public waypoints;

    constructor() {
        this.origin = {longitude: 18.368264, latitude: -34.020874};
        this.destination = {longitude: 18.468704, latitude: -34.107487};
        this.waypoints = [
            {location: {lat: -33.950384, lng: 18.378689}},
        ];
    }

    ngOnInit() {
    }
}
