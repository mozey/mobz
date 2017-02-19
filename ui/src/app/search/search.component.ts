import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

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

  constructor(public fb: FormBuilder, private configService: ConfigService) {
    console.info(configService.config);
  }

  ngOnInit() {
  }

  public searchForm = this.fb.group({
    destination: ["", [Validators.required, validDestination]],
    selected: [""],
  });

  destinationChanged() {
    destinationSelected = this.searchForm.controls["selected"].value;
  }

  listRoutes(event) {
    console.info("listRoutes", this.searchForm.valid);
    console.info(this.searchForm);
  }
}
