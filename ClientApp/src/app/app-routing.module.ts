import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { AuthGuardService } from './core/auth-guard';
import { HomeComponent } from './core/home/home.component';
import { LoggedOutComponent } from './core/loggedout/loggedout.component';
import { ForbiddenComponent } from './core/forbidden/forbidden.component';
import { ETLComponent } from './etl/etl.component';
import { ThingConfigComponent } from './thing/thing-config/thing-config.component';
import { ThingTransformComponent } from './thing/thing-transform/thing-transform.component';
import { RoutingService } from './../services/routing.service';
import { Environment } from '../environments/environment';

let appRoutes: Routes = Environment.appRoutes;
let fullRoutePath = 'search';
let depth = 0;

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

  constructor(
    public router: Router,
    public routingService: RoutingService
  ) {
    // this.configureDynamicRoutes();
  }

  configureDynamicRoutes(){
    this.routingService.configureDynamicRoutes(appRoutes);
  }


}
