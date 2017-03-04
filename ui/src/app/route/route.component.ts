import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {WimtService} from '../wimt.service'
import {Router} from '@angular/router';
declare let google: any;

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
    public friend = {
        name: ""
    };
    public pickup = {
        coord: <any>{},
        display: ""
    };

    constructor(private route: ActivatedRoute,
                private wimt: WimtService,
                private modalService: NgbModal,
                private router: Router) {

        this.zoom = 11;

        this.route.queryParams.subscribe(queryParams => {
            this.lat = Number(queryParams["lat"]);
            this.lng = Number(queryParams["lng"]);
            let params = {
                destination: {
                    lat: this.lat,
                    lng: this.lng
                },
                year: Number(queryParams["year"]),
                month: Number(queryParams["month"]),
                day: Number(queryParams["day"]),
                hour: Number(queryParams["hour"]),
                minute: Number(queryParams["minute"]),
            };

            this.wimt.journeyMultipoint(params).subscribe(
                response => {
                    console.info("Journey multipoint results ", response);
                    this.journey = response;
                    this.plotRoutes();
                }
            )
        });
    }

    plotRoutes() {
        // Clear plots
        let polyLines = [];
        let colors = [
            "#B22222",
            "#FF1493",
            "#1E90FF",
            "#FFD700",
            "#228B22"];

        // Extract routes
        for (let itinerary of this.journey.itineraries) {
            let coords = [];
            for (let leg of itinerary.legs) {
                if (leg.type == "Walking") {
                    coords.concat([
                        leg.geometry.coordinates[0].lng,
                        leg.geometry.coordinates[0].lat
                    ])
                } else if (leg.type == "Transit") {
                    for (let waypoint of leg.waypoints) {
                        if (waypoint.geometry && waypoint.geometry.coordinates) {
                            coords.push([
                                waypoint.geometry.coordinates.lng,
                                waypoint.geometry.coordinates.lat
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
            // console.info("route", JSON.stringify(coords, null, 2));
            polyLines.push({
                strokeColor: colors.pop(),
                coords: coords
            });
        }

        // Plot
        console.info("polyLines", polyLines);
        this.polyLines = polyLines;
    }

    ngOnInit() {
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

    setPickup(event) {
        console.info("setPickup", event);
        let dec = 1000;
        let lat = Math.round(event.coords.lat * dec) / dec;
        let lng = Math.round(event.coords.lng * dec) / dec;
        this.pickup.coord.lat = lat;
        this.pickup.coord.lng = lng;
        this.pickup.display = lat + "," + lng;
    }

    track() {
        console.info("Track mobz link");
        let queryParams = {
            "linkId": 123456790
        };
        this.router.navigate(["/track"], {queryParams: queryParams})
    }

}
