import { Injectable } from "@angular/core";
import { Router, Routes } from "@angular/router";
import { HomeComponent} from "./../app/core/home/home.component";
import { DataService } from "./data.service";
declare let _ :any;

@Injectable({
  providedIn: "root",
})
export class RoutingService {

  fullRoutePath = "search";
  depth = 0;

  constructor(
    public router: Router,
    public data: DataService,
  ) { }

  async configureDynamicRoutes(appRoutes) {
    this.depth = 0;
    appRoutes = this.cleanRoutes(appRoutes);
    const hierarchy = await this.data.getHierarchy();
    this.recurseHierarchyObject(hierarchy, appRoutes);
    this.router.resetConfig(appRoutes);
  }

  recurseHierarchyObject(node, appRoutes) {
    let hasPropName = true;
    if (node) {
      // 1) Root
      if (node.name) {
        // add name route
        if (this.fullRoutePath === "search" || this.fullRoutePath.includes('properties') ) {
          this.fullRoutePath = `search`;
          hasPropName = false;
          const omitFields = [node.child.name];
          this.data.routeLookup.push({
            route: this.fullRoutePath,
            keys: [`${node.name}`],
            showOnly: null,
            searchTerm: null,
            omitFields,
            component: "HomeComponent",
          });
          this.depth++;
          appRoutes.push({
            path: this.fullRoutePath, component: HomeComponent,
          });
        }
      }

      let keys = `${node.name}`;
      this.fullRoutePath = this.fullRoutePath + `/:${node.name}`;
      if (hasPropName) {
        keys = `${node.name}.name`;
      }

      // 2 ) Middle - children
      if (node.child) {
        //  if children this is a main page
        // let omitFields;
        // if (!isRoot) {
        // keys = this.data.routeLookup[depth].keys[0];
        let omitFields = null;
        omitFields = this.data.routeLookup[this.depth - 1].omitFields;
        
        // }  else {
        //  omitFields = [node.child.name];
        // }
        this.data.routeLookup.push({
          route: this.fullRoutePath,
          keys: [keys],
          showOnly: null,
          searchTerm: null,
          omitFields,
          component: "HomeComponent",
        });
        this.depth++;
        appRoutes.push({
          path: this.fullRoutePath, component: HomeComponent,
        });
        // add child node routes via recursion
        this.recurseHierarchyObject(node.child, appRoutes);
      } else { // 3) End no childdren
        // if no children then this is the details page (using the keys from the parent for fuse.js search)
        //  keys = this.data.routeLookup[depth].keys;
        let showOnly = null;
        showOnly = this.data.routeLookup[this.depth - 1].omitFields[0];
        
        
        this.data.routeLookup.push({
          route: this.fullRoutePath,
          keys,
          showOnly,
          searchTerm: null,
          omitFields: null,
          component: "DetailsComponent",
        });
        this.depth++;
        appRoutes.push({
          path: this.fullRoutePath, component: HomeComponent,
        });
      }
    }
  }

  cleanRoutes(appRoutes){

    for (let route of appRoutes){
      if (route.path.includes('search')){
        appRoutes = _.without(appRoutes, route);
      }
    }
    this.router.resetConfig(appRoutes);
    return appRoutes;
  }

}
