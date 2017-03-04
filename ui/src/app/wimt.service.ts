import {Injectable} from '@angular/core';

import {ConfigService} from './config.service';

import {Http, Headers} from '@angular/http';

@Injectable()
export class WimtService {

    constructor(private http: Http,
                private config: ConfigService) {
        this.http = http;
        this.config = config.config;
    }

    journeyMultipoint(coordinates: any) {
        console.info("journeyMultipoint", coordinates);
        return this.http.get("http://localhost:4100/assets/journey3.json")
            .map(response => response.json())
    }
}
