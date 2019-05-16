import { Injectable } from '@angular/core';

// This environment file corresponds to the key/values found in appsettings.json(server-side)
// At runtime, the serverside environment values will override the vars in this file
// When updating this file, update appsettings.json, appsettings.Development.json
@Injectable()
export class Environment {
    public static production = false;
    public static hmr = false;
    public static Api_Uri = '#OverwrittenByAppSettings#';
    public static Api_Resource_Uri = '#OverwrittenByAppSettings#';
    public static Application_Id = '#OverwrittenByAppSettings#';
    public static Application_Insights_Id = '#OverwrittenByAppSettings#';
    public static Redirect_Uri = '#OverwrittenByAppSettings#';
    public static Tenant = '#OverwrittenByAppSettings#';
    public static isFlat = true; 
    public static debugFacets = false;

    public static init(environment: any = window['Environment']) {
        if (environment) {
            Object.assign(Environment, environment);
        }
    }

    constructor(environment: any = window['Environment']) {
        if (environment) {
            Object.assign(Environment, environment);
        }
    }

}
