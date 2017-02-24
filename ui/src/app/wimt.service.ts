import {Injectable} from '@angular/core';

import {ConfigService} from './config.service';

import {Http, Headers} from '@angular/http';

let access_token = "xxx"

@Injectable()
export class WimtService {

    constructor(private http: Http,
                private config: ConfigService) {
        this.http = http;
        this.config = config.config;
    }

    // TODO Write code to refresh token
    // TODO Better stub handling
    journeyMultipoint(coordinates: any) {
        return this.http.get("assets/journey.json")
            .map(response => response.json())
    }

    // journeyMultipoint(coordinates: any) {
    //     console.info("Journey multipoint ", coordinates);
    //
    //     let base = "https://platform.whereismytransport.com/api/journeys";
    //
    //     let body = {
    //         geometry: {
    //             type: "Multipoint",
    //             coordinates: coordinates,
    //         },
    //         time: "2017-02-25T10:55:25.575Z",
    //         timeType: "DepartAfter",
    //         profile: "ClosestToTime",
    //         maxItineraries: 5,
    //     }
    //
    //     var headers = new Headers();
    //     headers.append("Authorization", "Bearer " + access_token);
    //     headers.append("Content-Type", "application/json");
    //     return this.http.post(base, JSON.stringify(body), {headers: headers})
    //         .map(response => response.json())
    //         .subscribe(
    //             response => {
    //                 // let results = response.json().results;
    //                 console.info("Journey multipoint results ", response);
    //             }
    //         );
    // }

}
