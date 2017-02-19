import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TypeaheadMatch } from 'ng2-bootstrap/typeahead';

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

  constructor(public fb: FormBuilder, private configService: ConfigService) {
    console.info(configService.config);

    this.dataSource = Observable
      .create((observer: any) => {
        // Runs on every search
        console.info("selected", this.searchForm.controls["destination"].value);
        observer.next(this.searchForm.controls["destination"].value);
      })
      .mergeMap((token: string) => this.getStatesAsObservable(token));
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

    return Observable.of(
      this.statesComplex.filter((state: any) => {
        return query.test(state.name);
      })
    );
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

  public statesComplex: any[] = [
    {id: 1, name: 'Alabama', region: 'South'}, {
      id: 2,
      name: 'Alaska',
      region: 'West'
    }, {
      id: 3,
      name: 'Arizona',
      region: 'West'
    },
    {id: 4, name: 'Arkansas', region: 'South'}, {
      id: 5,
      name: 'California',
      region: 'West'
    },
    {id: 6, name: 'Colorado', region: 'West'}, {
      id: 7,
      name: 'Connecticut',
      region: 'Northeast'
    },
    {id: 8, name: 'Delaware', region: 'South'}, {
      id: 9,
      name: 'Florida',
      region: 'South'
    },
    {id: 10, name: 'Georgia', region: 'South'}, {
      id: 11,
      name: 'Hawaii',
      region: 'West'
    },
    {id: 12, name: 'Idaho', region: 'West'}, {
      id: 13,
      name: 'Illinois',
      region: 'Midwest'
    },
    {id: 14, name: 'Indiana', region: 'Midwest'}, {
      id: 15,
      name: 'Iowa',
      region: 'Midwest'
    },
    {id: 16, name: 'Kansas', region: 'Midwest'}, {
      id: 17,
      name: 'Kentucky',
      region: 'South'
    },
    {id: 18, name: 'Louisiana', region: 'South'}, {
      id: 19,
      name: 'Maine',
      region: 'Northeast'
    },
    {id: 21, name: 'Maryland', region: 'South'}, {
      id: 22,
      name: 'Massachusetts',
      region: 'Northeast'
    },
    {id: 23, name: 'Michigan', region: 'Midwest'}, {
      id: 24,
      name: 'Minnesota',
      region: 'Midwest'
    },
    {id: 25, name: 'Mississippi', region: 'South'}, {
      id: 26,
      name: 'Missouri',
      region: 'Midwest'
    },
    {id: 27, name: 'Montana', region: 'West'}, {
      id: 28,
      name: 'Nebraska',
      region: 'Midwest'
    },
    {id: 29, name: 'Nevada', region: 'West'}, {
      id: 30,
      name: 'New Hampshire',
      region: 'Northeast'
    },
    {id: 31, name: 'New Jersey', region: 'Northeast'}, {
      id: 32,
      name: 'New Mexico',
      region: 'West'
    },
    {id: 33, name: 'New York', region: 'Northeast'}, {
      id: 34,
      name: 'North Dakota',
      region: 'Midwest'
    },
    {id: 35, name: 'North Carolina', region: 'South'}, {
      id: 36,
      name: 'Ohio',
      region: 'Midwest'
    },
    {id: 37, name: 'Oklahoma', region: 'South'}, {
      id: 38,
      name: 'Oregon',
      region: 'West'
    },
    {id: 39, name: 'Pennsylvania', region: 'Northeast'}, {
      id: 40,
      name: 'Rhode Island',
      region: 'Northeast'
    },
    {id: 41, name: 'South Carolina', region: 'South'}, {
      id: 42,
      name: 'South Dakota',
      region: 'Midwest'
    },
    {id: 43, name: 'Tennessee', region: 'South'}, {
      id: 44,
      name: 'Texas',
      region: 'South'
    },
    {id: 45, name: 'Utah', region: 'West'}, {
      id: 46,
      name: 'Vermont',
      region: 'Northeast'
    },
    {id: 47, name: 'Virginia', region: 'South'}, {
      id: 48,
      name: 'Washington',
      region: 'South'
    },
    {id: 49, name: 'West Virginia', region: 'South'}, {
      id: 50,
      name: 'Wisconsin',
      region: 'Midwest'
    },
    {id: 51, name: 'Wyoming', region: 'West'}];
}
