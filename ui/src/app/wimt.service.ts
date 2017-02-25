import {Injectable} from '@angular/core';

import {ConfigService} from './config.service';

import {Http, Headers} from '@angular/http';

@Injectable()
export class WimtService {
    public access_token;

    constructor(private http: Http,
                private config: ConfigService) {
        this.http = http;
        this.config = config.config;

        // if (!this.access_token) {
        //     let body = "client_id=" + this.config["wimt"]["client_id"]
        //     body += "&client_secret=" + this.config["wimt"]["client_secret"]
        //     body += "&grant_type=client_credentials"
        //     body += "&scope=transportapi:all"
        //
        //     var headers = new Headers();
        //     headers.append("Content-Type", "application/x-www-form-urlencoded");
        //     this.http.post(
        //         "https://identity.whereismytransport.com/connect/token", body,
        //         {headers: headers})
        //         .map(response => response.json())
        //         .subscribe(response => {
        //             console.info("response", JSON.stringify(response, null, 2))
        //             this.access_token = response.access_token
        //         })
        // }
    }

    // TODO Write code to refresh token
    // TODO Better stub handling
    journeyMultipoint(coordinates: any) {
        return this.http.get("assets/journey2.json")
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
    //         time: "2017-02-26T10:55:25.575Z",
    //         timeType: "DepartAfter",
    //         profile: "ClosestToTime",
    //         maxItineraries: 5,
    //     }
    //
    //     var headers = new Headers();
    //     headers.append("Authorization", "Bearer " + this.access_token);
    //     headers.append("Content-Type", "application/json");
    //     return this.http.post(base, JSON.stringify(body), {headers: headers})
    //         .map(response => response.json())
    // }

}
