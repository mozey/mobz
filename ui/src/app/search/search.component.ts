import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import {ConfigService} from '../config.service';
import {GeocodeService} from "../geocode.service";

let destinationSelected = false;
function validDestination(/*c: FormControl*/) {
  console.info("destinationSelected", destinationSelected);
  if (!destinationSelected) {
    console.info("not valid");
    return {
      validDestination: "Destination not selected" // Error message
    };
  }
  console.info("valid");
  return null; // Valid
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  constructor(public fb: FormBuilder,
              private _config: ConfigService,
              private _geocode: GeocodeService) {

    console.info(_config.config);
  }

  ngOnInit() {
  }

  public searchForm = this.fb.group({
    destination: ["", [Validators.required, validDestination]],
  });

  listRoutes() {
    console.info("listRoutes", this.searchForm.valid);
    console.info(this.searchForm.value);
  }

  searching = false;
  searchFailed = false;
  search = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this._geocode.search(term)
            .do(() => this.searchFailed = false)
            .catch(() => {
              this.searchFailed = true;
              return Observable.of([]);
            }))
      .do(() => this.searching = false);

}
