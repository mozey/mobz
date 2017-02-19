import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
// import {Http} from '@angular/http';

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
  });

  listRoutes() {
    console.info("listRoutes", this.searchForm.valid);
    console.info(this.searchForm.value);
  }

  public states: string[] = ['Alabama', 'Alaska', 'Arizona', 'Arkansas',
    'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
    'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico',
    'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'];
}
