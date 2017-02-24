import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {WimtService} from '../wimt.service'

@Component({
    selector: 'app-route',
    templateUrl: './route.component.html',
    styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {
    public lat;
    public lng;
    public journey = {}

    constructor(private _route: ActivatedRoute,
                private _wimt: WimtService) {
    }

    ngOnInit() {
        this._route.queryParams.subscribe(queryParams => {
            this.lat = queryParams["lat"]
            this.lng = queryParams["lng"]
        })
        // (<any>window).mobz = this._route.queryParams;

        this._wimt.journeyMultipoint([
            // TODO Insert current location here
            [18.3799843, -33.9510746],
            [this.lng, this.lat]
        ]).subscribe(
            response => {
                console.info("Journey multipoint results ", response);
                this.journey = response;
            }
        )
    }

}
