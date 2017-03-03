import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {WimtService} from '../wimt.service'
import {Router} from '@angular/router';
import {GeolocationService} from "../geolocation.service";

@Component({
    selector: 'app-route',
    templateUrl: './route.component.html',
    styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {
    public lat;
    public lng;
    public zoom;
    public journey = {itineraries: []};
    public polyLines = [];
    public itinerary;
    public position;

    constructor(private route: ActivatedRoute,
                private wimt: WimtService,
                private modalService: NgbModal,
                private router: Router,
                private geolocation: GeolocationService) {
    }

    ngOnInit() {
        this.zoom = 11;

        this.geolocation.getCurrentPosition().subscribe(position => {
            this.position = position;

            this.route.queryParams.subscribe(queryParams => {
                this.lat = Number(queryParams["lat"]);
                this.lng = Number(queryParams["lng"]);
            });
            // (<any>window).mobz = this.route.queryParams;

            this.wimt.journeyMultipoint([
                // TODO Insert current location here
                [
                    Number(this.position.coords.longitude),
                    Number(this.position.coords.latitude)
                ],
                [this.lng, this.lat]
            ]).subscribe(
                response => {
                    console.info("Journey multipoint results ", response);
                    this.journey = response;
                }
            )
        })
    }

    showRouteDetails(itinerary, routeDetailsTemplate) {
        // Set selected itinerary
        this.itinerary = itinerary;

        this.modalService.open(routeDetailsTemplate, {
            // TODO Make modal large,
            // this class needs to go on the "modal-dialog" div
            // windowClass: "modal-lg"
        })
    }

    showRoute(newItinerary) {
        // Set selected itinerary
        this.itinerary = newItinerary;

        // Clear plots
        this.polyLines = [];

        // Plot selected route
        for (let itinerary of this.journey.itineraries) {
            console.info(this.itinerary.id);
            if (itinerary.id == this.itinerary.id) {
                let coords = [];
                for (let leg of itinerary.legs) {
                    if (leg.type == "Walking") {
                        coords.concat([
                            leg.geometry.coordinates[0].lng,
                            leg.geometry.coordinates[0].lat,
                        ])
                    } else if (leg.type == "Transit") {
                        for (let waypoint of leg.waypoints) {
                            if (waypoint.geometry && waypoint.geometry.coordinates) {
                                coords.push([
                                    waypoint.geometry.coordinates.lat,
                                    waypoint.geometry.coordinates.lng,
                                ])
                            } else if (waypoint.stop && waypoint.stop.geometry.coordinates) {
                                coords.push([
                                    waypoint.stop.geometry.coordinates[0].lng,
                                    waypoint.stop.geometry.coordinates[0].lat,
                                ])
                            }
                        }
                    }
                }
                console.info("route", JSON.stringify(coords, null, 2));
                this.polyLines.push(coords);
            }
        }
    }

    track() {
        if (this.itinerary) {
            console.info("Track itinerary ", this.itinerary.id);
            let queryParams = {
                "itinerary": this.itinerary.id,
            };
            this.router.navigate(["/track"], {queryParams: queryParams})
        } else {
            alert("Please select a route");
        }
    }

}
