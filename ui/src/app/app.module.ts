import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import {AppRoutingModule} from './app-routing.module';
import {AgmCoreModule} from 'angular2-google-maps/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {RouteComponent} from './route/route.component';
import {TrackComponent} from './track/track.component';
import {SearchComponent} from './search/search.component';

import {ConfigService} from './config.service';
import {GeocodeService} from './geocode.service';
import {GeolocationService} from './geolocation.service';
import {WimtService} from './wimt.service';
import {WebsocketService} from './websocket.service';
import { MapDirectionsDirective } from './map-directions.directive';

@NgModule({
    declarations: [
        AppComponent,
        RouteComponent,
        TrackComponent,
        SearchComponent,
        MapDirectionsDirective
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        AppRoutingModule,
        AgmCoreModule.forRoot({
            apiKey: window["config"].google.api_key
        }),
        NgbModule.forRoot(),
        JsonpModule
    ],
    providers: [
        ConfigService,
        GeocodeService,
        GeolocationService,
        WimtService,
        WebsocketService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
