import {Injectable} from '@angular/core';

import 'rxjs/add/observable/of';
import {Observable} from "rxjs";
import {Http} from '@angular/http';
// import {URLSearchParams} from "@angular/http";

@Injectable()
export class GeocodeService {
  constructor(private http: Http) {
    this.http = http;
  }

  search(term: string) {
    // Only search if term is at least two characters
    if (term.length < 2) {
      return Observable.of([]);
    }

    let query = new RegExp(term, 'ig');
    console.info("term", term);
    return this.http.get("assets/states.json").map((response) => {
      return response.json().filter((state: any) => {
        return query.test(state.name);
      })
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
