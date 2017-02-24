import {Injectable} from '@angular/core';

import {ConfigService} from './config.service';

import 'rxjs/add/observable/of';
import {Observable} from "rxjs";
import {Http, URLSearchParams} from '@angular/http';
// import {URLSearchParams} from "@angular/http";

@Injectable()
export class GeocodeService {
  constructor(private http: Http,
              private config: ConfigService) {
    this.http = http;
    this.config = config.config;
  }

  search(term: string) {
    // Only search if term is at least two characters
    if (term.length < 2) {
      return Observable.of([]);
    }
    console.info("Geocoding ", term);

    let base = "https://maps.googleapis.com/maps/api/geocode/json";
    let params: URLSearchParams = new URLSearchParams();
    params.set("region", "za")
    params.set("address", term)
    params.set("key", this.config["google"]["api_key"])

    return this.http.get(base, {search: params}).map((response) => {
      let results = response.json().results;
      console.info("Geocoding matches = ", results.length);
      return results;
    });
  }

  // Wikipedia jsonp example

  // public times: number;
  //
  // constructor(private _jsonp: Jsonp) {
  //   this.times = 0;
  // }
  //
  // search(term: string) {
  //   if (term === '') {
  //     return Observable.of([]);
  //   }
  //
  //   let wikiUrl = 'https://en.wikipedia.org/w/api.php';
  //   let params = new URLSearchParams();
  //   params.set('search', term);
  //   params.set('action', 'opensearch');
  //   params.set('format', 'json');
  //   params.set('callback', 'JSONP_CALLBACK');
  //   // Hack as per: http://stackoverflow.com/a/42154295/639133
  //   // to fix this bug: https://github.com/angular/angular/issues/14267
  //   // params.set('callback', `__ng_jsonp__.__req${this.times}.finished`);
  //   this.times = this.times + 1;
  //   console.info("this.times", this.times);
  //
  //   return this._jsonp
  //     .get(wikiUrl, {search: params})
  //     .map(response => <string[]> response.json()[1]);
  // }
  //
}
