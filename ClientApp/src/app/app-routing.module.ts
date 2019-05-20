import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { AuthGuardService } from './core/auth-guard';
import { HomeComponent } from './core/home/home.component';
import { LoggedOutComponent } from './core/loggedout/loggedout.component';
import { ForbiddenComponent } from './core/forbidden/forbidden.component';
import { DataService } from '../services/data.service';


let appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [] },
  { path: 'home', component: HomeComponent, canActivate: [] },
  { path: 'loggedout', component: LoggedOutComponent, canActivate: [] },
  { path: 'forbidden', component: ForbiddenComponent }
];
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
    public data: DataService,
    public router: Router,
  ) {
    this.configureDynamicRoutes();
  }

  async configureDynamicRoutes() {
    let hierarchy = await this.data.getHierarchy();
    this.recurseHierarchyObject(hierarchy);
    this.router.resetConfig(appRoutes);
  }

  recurseHierarchyObject(node) {
    let hasPropName = true;
    if (node) {
      // 1) Root
      if (node.name) {
        // add name route
        if (fullRoutePath === 'search') {
          fullRoutePath = `search`;
          hasPropName = false;
          const omitFields = [node.child.name];
          this.data.routeLookup.push({
            route: fullRoutePath,
            keys: [`${node.name}`],
            showOnly: null,
            searchTerm: null,
            omitFields: omitFields,
            component: 'HomeComponent',
          });
          depth++;
          appRoutes.push({
            path: fullRoutePath, component: HomeComponent,
          });
        }
      }

      let keys = `${node.name}`;
      fullRoutePath = fullRoutePath + `/:${node.name}`;
      if (hasPropName) {
        keys = `${node.name}.name`;
      }

      // 2 ) Middle - children
      if (node.child) {
        //  if children this is a main page
        //let omitFields;
        //if (!isRoot) {
        //keys = this.data.routeLookup[depth].keys[0];
        const omitFields = this.data.routeLookup[depth - 1].omitFields;
        //}  else {
        //  omitFields = [node.child.name];
        //}
        this.data.routeLookup.push({
          route: fullRoutePath,
          keys: [keys],
          showOnly: null,
          searchTerm: null,
          omitFields: omitFields,
          component: 'HomeComponent',
        });
        depth++;
        appRoutes.push({
          path: fullRoutePath, component: HomeComponent,
        });
        // add child node routes via recursion
        this.recurseHierarchyObject(node.child);
      } else { // 3) End no childdren
        // if no children then this is the details page (using the keys from the parent for fuse.js search)
        //  keys = this.data.routeLookup[depth].keys;
        let showOnly = this.data.routeLookup[depth - 1].omitFields[0];
        this.data.routeLookup.push({
          route: fullRoutePath,
          keys: keys,
          showOnly: showOnly,
          searchTerm: null,
          omitFields: null,
          component: 'DetailsComponent',
        });
        depth++;
        appRoutes.push({
          path: fullRoutePath, component: HomeComponent,
        });
      }
    }
  }
}
