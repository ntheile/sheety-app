import { Injectable } from '@angular/core';
declare let require: any;

// This environment file corresponds to the key/values found in appsettings.json(server-side)
// At runtime, the serverside environment values will override the vars in this file
// When updating this file, update appsettings.json, appsettings.Development.json
@Injectable()
export class Environment {
  public static production = true;
  public static hmr = false;
  public static Api_Uri = '#OverwrittenByAppSettings#';
  public static Api_Resource_Uri = '#OverwrittenByAppSettings#';
  public static Application_Id = '#OverwrittenByAppSettings#';
  public static Application_Insights_Id = '#OverwrittenByAppSettings#';
  public static Redirect_Uri = '#OverwrittenByAppSettings#';
  public static Tenant = '#OverwrittenByAppSettings#';

  public static dataPath = "samples/blockstack";
  public static transformFolder = "./../data/samples/blockstack/";
  public static config = require("./../data/samples/blockstack/config");
  public static storageDriver = "memory"; // memory, sample, blockstack
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
