// Directions service
// https://github.com/SebastianM/angular2-google-maps/issues/495
// https://developers.google.com/maps/documentation/javascript/directions

import {Directive, Input} from '@angular/core';
import {GoogleMapsAPIWrapper} from 'angular2-google-maps/core/services/google-maps-api-wrapper';
declare let google: any;


@Directive({
    selector: 'sebm-google-map-directions'
})
export class MapDirectionsDirective {
    @Input() origin;
    @Input() destination;
    @Input() waypoints;

    constructor(private gmapsApi: GoogleMapsAPIWrapper) {
    }

    ngOnInit() {
        this.gmapsApi.getNativeMap().then(map => {
            let directionsService = new google.maps.DirectionsService;
            let directionsDisplay = new google.maps.DirectionsRenderer;
            console.info("this.origin", this.origin);
            console.info("this.destination", this.destination);
            console.info("this.waypoints", this.waypoints);
            directionsDisplay.setMap(map);
            directionsService.route({
                origin: {
                    lat: this.origin.latitude,
                    lng: this.origin.longitude
                },
                destination: {
                    lat: this.destination.latitude,
                    lng: this.destination.longitude
                },
                waypoints: this.waypoints,
                optimizeWaypoints: true,
                provideRouteAlternatives: true,
                travelMode: 'DRIVING'
            }, function (response, status) {
                console.info("response", response);
                let coords = [];
                for (let item of response.routes[0].overview_path) {
                    coords.push([item.lng(), item.lat()])
                }
                console.info("coords", JSON.stringify(coords, null, 2));
                if (status === 'OK') {
                    directionsDisplay.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });

        });
    }
}
