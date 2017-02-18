import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RouteComponent} from "./route/route.component";
import {TrackComponent} from "./track/track.component";
import {SearchComponent} from "./search/search.component";

const routes: Routes = [
  {path: 'search', component: SearchComponent},
  {path: 'route', component: RouteComponent},
  {path: 'track', component: TrackComponent},
  {path: '**', redirectTo: '/search', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }


