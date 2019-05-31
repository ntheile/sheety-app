import { NgModule } from "@angular/core";
import { Router, RouterModule, Routes } from "@angular/router";

import { Environment } from "../environments/environment";
import { AuthGuardService } from "./core/auth-guard";
import { ForbiddenComponent } from "./core/forbidden/forbidden.component";
import { HomeComponent } from "./core/home/home.component";
import { LoggedOutComponent } from "./core/loggedout/loggedout.component";
import { ETLComponent } from "./etl/etl.component";
import { ThingConfigComponent } from "./thing/thing-config/thing-config.component";
import { ThingTransformComponent } from "./thing/thing-transform/thing-transform.component";

const appRoutes: Routes  = [
  { path: "", component: HomeComponent, canActivate: [] },
  { path: "home", component: HomeComponent, canActivate: [] },
  { path: "loggedout", component: LoggedOutComponent, canActivate: [] },
  { path: "forbidden", component: ForbiddenComponent },
  { path: "data", component: ETLComponent },
  { path: "config", component: ThingConfigComponent },
  { path: "transform", component: ThingTransformComponent },
];
const fullRoutePath = "search";
const depth = 0;

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true },
    ),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {

  constructor(
    public router: Router,
  ) {
    // this.configureDynamicRoutes();
  }

  configureDynamicRoutes() {
    // this.routingService.configureDynamicRoutes(appRoutes);
  }

}
