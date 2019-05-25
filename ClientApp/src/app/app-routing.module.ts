import { NgModule } from "@angular/core";
import { Router, RouterModule, Routes } from "@angular/router";

import { Environment } from "../environments/environment";
import { RoutingService } from "./../services/routing.service";
import { AuthGuardService } from "./core/auth-guard";
import { ForbiddenComponent } from "./core/forbidden/forbidden.component";
import { HomeComponent } from "./core/home/home.component";
import { LoggedOutComponent } from "./core/loggedout/loggedout.component";
import { ETLComponent } from "./etl/etl.component";
import { ThingConfigComponent } from "./thing/thing-config/thing-config.component";
import { ThingTransformComponent } from "./thing/thing-transform/thing-transform.component";

const appRoutes: Routes = Environment.appRoutes;
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
    public routingService: RoutingService,
  ) {
    // this.configureDynamicRoutes();
  }

  configureDynamicRoutes() {
    this.routingService.configureDynamicRoutes(appRoutes);
  }

}
