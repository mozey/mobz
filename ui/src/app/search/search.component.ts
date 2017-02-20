import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {TypeaheadMatch} from 'ng2-bootstrap/typeahead';
import {Http} from '@angular/http';

import {ConfigService} from '../config.service';

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
  public typeaheadLoading: boolean;
  public typeaheadNoResults: boolean;
  public dataSource: Observable<any>;

  constructor(public fb: FormBuilder,
              private configService: ConfigService,
              private http: Http) {

    console.info(configService.config);

    this.dataSource = Observable
      .create((observer: any) => {
        // Runs on every search
        console.info("selected", this.searchForm.controls["destination"].value);
        observer.next(this.searchForm.controls["destination"].value);
      })
      .mergeMap((token: string) => this.getStatesAsObservable(token));

    this.http = http;
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

  public getStatesAsObservable(token: string): Observable<any> {
    let query = new RegExp(token, 'ig');

    return this.http.get("assets/states.json").map((response) => {
      return response.json().filter((state: any) => {
        return query.test(state.name);
      })
    })
  }

  public changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  public changeTypeaheadNoResults(e: boolean): void {
    this.typeaheadNoResults = e;
  }

  public typeaheadOnSelect(e: TypeaheadMatch): void {
    console.log('Selected value: ', e.value);
  }

}
