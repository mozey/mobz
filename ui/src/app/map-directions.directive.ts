import {Directive, Input} from '@angular/core';
import {GoogleMapsAPIWrapper} from 'angular2-google-maps/core/services/google-maps-api-wrapper';
declare let google: any;

/*
 @Directive({
 selector: '[appMapDirections]'
 })
 export class MapDirectionsDirective {

 constructor() { }

 }
 */

@Directive({
    selector: 'sebm-google-map-directions'
})
export class MapDirectionsDirective {
    @Input() origin;
    @Input() destination;

    constructor(private gmapsApi: GoogleMapsAPIWrapper) {
    }

    ngOnInit() {
        this.gmapsApi.getNativeMap().then(map => {
            let directionsService = new google.maps.DirectionsService;
            let directionsDisplay = new google.maps.DirectionsRenderer;
            console.info("this.origin", this.origin);
            console.info("this.destination", this.destination);
            directionsDisplay.setMap(map);
            directionsService.route({
                origin: {lat: this.origin.latitude, lng: this.origin.longitude},
                destination: {
                    lat: this.destination.latitude,
                    lng: this.destination.longitude
                },
                waypoints: [],
                optimizeWaypoints: true,
                travelMode: 'DRIVING'
            }, function (response, status) {
                if (status === 'OK') {
                    directionsDisplay.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });

        });
    }
}
