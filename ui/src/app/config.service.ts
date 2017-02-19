import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

  constructor() { }

  get config(): any {
    let config = Object.assign(window["config"]);
    console.info("config", config);
    return config;
  }

}

