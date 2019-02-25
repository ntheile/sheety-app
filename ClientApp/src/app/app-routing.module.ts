import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './core/auth-guard';
import { HomeComponent } from './core/home/home.component';
import { LoggedOutComponent } from './core/loggedout/loggedout.component';
import { ForbiddenComponent } from './core/forbidden/forbidden.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuardService] },
    { path: 'loggedout', component: LoggedOutComponent, canActivate: [AuthGuardService] },
    { path: 'forbidden', component: ForbiddenComponent },
    { path: 'showcase', loadChildren: './showcase/showcase.module#ShowcaseModule', canLoad: [AuthGuardService] },
    { path: 'todo', loadChildren: './todo/todo.module#TodoModule', canLoad: [AuthGuardService] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
