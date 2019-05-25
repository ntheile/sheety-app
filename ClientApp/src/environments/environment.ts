import { Injectable } from "@angular/core";
import { ForbiddenComponent } from "../app/core/forbidden/forbidden.component";
import { HomeComponent } from "../app/core/home/home.component";
import { LoggedOutComponent } from "../app/core/loggedout/loggedout.component";
import { ETLComponent } from "../app/etl/etl.component";
import { ThingConfigComponent } from "../app/thing/thing-config/thing-config.component";
import { ThingTransformComponent } from "../app/thing/thing-transform/thing-transform.component";
declare let require: any;

// This environment file corresponds to the key/values found in appsettings.json(server-side)
// At runtime, the serverside environment values will override the vars in this file
// When updating this file, update appsettings.json, appsettings.Development.json
@Injectable()
export class Environment {
    // public static dataPath = "samples/cars";
    // public static transformFolder = "./../data/samples/cars/";
    // public static config = require('./../data/samples/cars/config');

    public static dataPath = "samples/blockstack";
    public static transformFolder = "./../data/samples/blockstack/";
    public static config = require("./../data/samples/blockstack/config");
    public static storageDriver = "memory"; // or blockstack or aws or memory etc...
    public static appRoutes = [
        { path: "", component: HomeComponent, canActivate: [] },
        { path: "home", component: HomeComponent, canActivate: [] },
        { path: "loggedout", component: LoggedOutComponent, canActivate: [] },
        { path: "forbidden", component: ForbiddenComponent },
        { path: "data", component: ETLComponent },
        { path: "config", component: ThingConfigComponent },
        { path: "transform", component: ThingTransformComponent },
      ];

    public static debugFacets = false;
    public static production = false;
    public static hmr = false;
    public static Api_Uri = "#OverwrittenByAppSettings#";
    public static Api_Resource_Uri = "#OverwrittenByAppSettings#";
    public static Application_Id = "#OverwrittenByAppSettings#";
    public static Application_Insights_Id = "#OverwrittenByAppSettings#";
    public static Redirect_Uri = "#OverwrittenByAppSettings#";
    public static Tenant = "#OverwrittenByAppSettings#";

    public static init(environment: any = window["Environment"]) {
        if (environment) {
            Object.assign(Environment, environment);
        }
    }

    constructor(environment: any = window["Environment"]) {
        if (environment) {
            Object.assign(Environment, environment);
        }
    }

}
