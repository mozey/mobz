import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DirectionsComponent} from "./directions/directions.component";
import {RouteComponent} from "./route/route.component";
import {SearchComponent} from "./search/search.component";
import {SocketComponent} from "./socket/socket.component";
import {TrackComponent} from "./track/track.component";

const routes: Routes = [
    {path: 'directions', component: DirectionsComponent},
    {path: 'route', component: RouteComponent},
    {path: 'search', component: SearchComponent},
    {path: 'socket', component: SocketComponent},
    {path: 'track', component: TrackComponent},
    {path: '**', redirectTo: '/search', pathMatch: 'full'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule {
}


