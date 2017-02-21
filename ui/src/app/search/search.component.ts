import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
// import 'rxjs/add/observable/of';
// import {TypeaheadMatch} from 'ng2-bootstrap/typeahead';
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

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  // public typeaheadLoading: boolean;
  // public typeaheadNoResults: boolean;
  // public dataSource: Observable<any>;

  constructor(public fb: FormBuilder,
              private configService: ConfigService,
              private http: Http) {

    console.info(configService.config);

    // this.dataSource = Observable
    //   .create((observer: any) => {
    //     // Runs on every search
    //     console.info("selected",
    // this.searchForm.controls["destination"].value);
    // observer.next(this.searchForm.controls["destination"].value); })
    // .mergeMap((token: string) => this.getStatesAsObservable(token));

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

  // public getStatesAsObservable(token: string): Observable<any> {
  //   let query = new RegExp(token, 'ig');
  //
  //   return this.http.get("assets/states.json").map((response) => {
  //     return response.json().filter((state: any) => {
  //       return query.test(state.name);
  //     })
  //   })
  // }

  // public changeTypeaheadLoading(e: boolean): void {
  //   this.typeaheadLoading = e;
  // }
  //
  // public changeTypeaheadNoResults(e: boolean): void {
  //   this.typeaheadNoResults = e;
  // }
  //
  // public typeaheadOnSelect(e: TypeaheadMatch): void {
  //   console.log('Selected value: ', e.value);
  // }

  public model: any;

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 2 ? []
        : states.filter(v => new RegExp(term, 'gi').test(v)).splice(0, 10));


}
