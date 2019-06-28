import { Injectable, Inject, InjectionToken } from "@angular/core";
import { Environment } from "../../environments/environment";
import { BlockstackRadiksModelProvider } from "../../drivers/blockstack/BlockstackRadiksModelProvider";
let model;
if (Environment.ModelProvider === BlockstackRadiksModelProvider) {
   let { Model } = require("radiks");
   model = Model;
} 

export class SheetyAppDataModel extends model {
  static className = 'SheetyAppDataModel';
  static schema = {
    sheetyAppModelId: {
        type: String,
        decrypted: true
    },
    config: {
        type: String 
    },
    reducer: {
      type: String 
    },
    transformer: {
      type: String,
    },
    sheets: {
      type: Array<String>()
    },
    dataPath: {
      type: String // https://gaia.blockstack.org/hub/15P2niPu16fLYTJ6zn3FkC2tiGD6EMvS8w/{{app._id}}/data.json
    },
    excelPath: {
      type: String // https://gaia.blockstack.org/hub/15P2niPu16fLYTJ6zn3FkC2tiGD6EMvS8w/{{app._id}}/excel.xml
    },
    facetsPath: {
      type: String // // https://gaia.blockstack.org/hub/15P2niPu16fLYTJ6zn3FkC2tiGD6EMvS8w/{{app._id}}/facets.json
    },
    createdBy: {
      type: String,
    },
    _id: {
      type: String,
      decrypted: true
    }
  };
}