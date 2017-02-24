import {Component, OnInit} from '@angular/core';

import {Http, Headers} from '@angular/http';

@Component({
    selector: 'app-track',
    templateUrl: './track.component.html',
    styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {
    public lat;
    public lng;
    public polyLines = [];

    constructor(private http: Http,) {
        this.http = http;
    }

    ngOnInit() {
        this.lat = -33.924158;
        this.lng = 18.454311;

        this.http.get("assets/journey.json")
            .map(response => response.json())
            .subscribe((response) => {
                for (let itinerary of response.itineraries) {
                    let coords = [];
                    for (let leg of itinerary.legs) {
                        if (leg.type == "Walking") {
                            coords.concat(leg.geometry.coordinates)
                        } else if (leg.type == "Transit") {
                            for (let waypoint of leg.waypoints) {
                                coords.push(
                                    waypoint.stop.geometry.coordinates)
                            }
                        }
                    }
                    this.polyLines.push(coords);
                }
            })
    }
}
