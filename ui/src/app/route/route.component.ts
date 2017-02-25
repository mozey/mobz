import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {WimtService} from '../wimt.service'
import {Router} from '@angular/router';

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

    constructor(private route: ActivatedRoute,
                private wimt: WimtService,
                private modalService: NgbModal,
                private router: Router) {
    }

    ngOnInit() {
        this.zoom = 11;

        this.route.queryParams.subscribe(queryParams => {
            this.lat = Number(queryParams["lat"])
            this.lng = Number(queryParams["lng"])
        })
        // (<any>window).mobz = this.route.queryParams;

        this.wimt.journeyMultipoint([
            // TODO Insert current location here
            [18.3799843, -33.9510746],
            [this.lng, this.lat]
        ]).subscribe(
            response => {
                console.info("Journey multipoint results ", response);
                this.journey = response;
            }
        )
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
                        coords.concat(leg.geometry.coordinates)
                    } else if (leg.type == "Transit") {
                        for (let waypoint of leg.waypoints) {
                            coords.push(
                                waypoint.stop.geometry.coordinates)
                        }
                    }
                }
                this.polyLines.push(coords);
            }
        }
    }

    track() {
        if (this.itinerary) {
            console.info("Track itinerary ", this.itinerary.id);
            let queryParams = {
                "itinerary": this.itinerary.id,
            }
            this.router.navigate(["/track"], {queryParams: queryParams})
        } else {
            alert("Please select a route");
        }
    }

}
