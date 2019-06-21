import { Injectable, Inject, InjectionToken } from "@angular/core";
import { Environment } from "../environments/environment";
import { BlockstackRadiksModelProvider } from "../drivers/blockstack/BlockstackRadiksModelProvider";
let model;
if (Environment.ModelProvider === BlockstackRadiksModelProvider) {
   let { Model } = require("radiks");
   model = Model;
} 

export class SheetyAppModel extends model {
  static className = 'SheetyAppModel';
  static schema = {
    sheets: {
      type: Array<String>()
    },
    name: {
        type: String
    },
    rawData: {
        type: String 
    },
    rawJSON: {
        type: String
    },
    userGroupId: {
      type: String,
      decrypted: true,
    },
    createdBy: {
      type: String,
    },
    _id: {
      type: String
    }
  };
}