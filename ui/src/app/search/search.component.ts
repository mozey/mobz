import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators, FormControl} from '@angular/forms';
import {Router} from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import {GeocodeService} from "../geocode.service";

function validDestination(c: FormControl) {
    if (!c.value["geometry"]) {
        return {
            validDestination: "Destination not selected" // Error message
        };
    }
    return null; // Valid
}

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
    constructor(private _fb: FormBuilder,
                private _geocode: GeocodeService,
                private _router: Router) {
    }

    ngOnInit() {
    }

    public searchForm = this._fb.group({
        destination: ["", [Validators.required, validDestination]],
    });

    searchResultFormatter(value: any) {
        return value["formatted_address"];
    }

    searchInputFormatter(value: any) {
        return value["formatted_address"];
    }

    searching = false;
    searchFailed = false;
    search = (text$: Observable<string>) =>
        text$
            .debounceTime(800)
            .distinctUntilChanged()
            .do(() => {
                this.searching = true
            }).switchMap(term =>
            this._geocode.search(term)
                .do(() => this.searchFailed = false)
                .catch(() => {
                    this.searchFailed = true;
                    return Observable.of([]);
                }))
            .do(() => this.searching = false);

    listRoutes() {
        console.info("searchForm.valid", this.searchForm.valid);
        if (this.searchForm.valid) {
            let form = this.searchForm.value
            let destination = form.destination;
            let queryParams = {
                "lat": destination["geometry"]["location"]["lat"],
                "lng": destination["geometry"]["location"]["lng"]
            }
            this._router.navigate(["/route"], {queryParams: queryParams})
        }
    }
}
