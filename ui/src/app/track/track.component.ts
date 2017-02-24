import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-track',
    templateUrl: './track.component.html',
    styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    lat: number = -33.924158;
    lng: number = 18.454311;
}
