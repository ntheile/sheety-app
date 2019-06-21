import { Injectable } from "@angular/core";
import { InMemoryStorageProvider } from "../drivers/memory/InMemoryStorageProvider";
import { BlockstackStorageProvider } from "../drivers/blockstack/BlockstackStorageProvider";
import { BlockstackAuthProvider } from "../drivers/blockstack/BlockstackAuthProvider";
import { BlockstackRadiksModelProvider } from "../drivers/blockstack/BlockstackRadiksModelProvider";
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
    public static storageDriver = "memory"; // memory, sample, blockstack
    public static debugFacets = false;
    public static production = false;
    public static hmr = false;
    public static Api_Uri = "#OverwrittenByAppSettings#";
    public static Api_Resource_Uri = "#OverwrittenByAppSettings#";
    public static Application_Id = "#OverwrittenByAppSettings#";
    public static Application_Insights_Id = "#OverwrittenByAppSettings#";
    public static Redirect_Uri = "#OverwrittenByAppSettings#";
    public static Tenant = "#OverwrittenByAppSettings#";
    public static StorageProvider = InMemoryStorageProvider;
    public static AuthProvider = BlockstackAuthProvider;
    public static ModelProvider = BlockstackRadiksModelProvider;
    public static ModelProviderImport = "radiks";
    public static RadiksUrl = "https://blockusign-radiks.azurewebsites.net";

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
