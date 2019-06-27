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
    name: {
        type: String
    },
    isPublic: {
      type: Boolean,
      decrypted: true,
    },
    publicName: {
      type: String,
      decrypted: true,
    },
    publicOwner: {
      type: String,
      decrypted: true,
    },
    _id: {
      type: String
    },
    userGroupId: {
      type: String,
      decrypted: true,
    },
    createdBy: {
      type: String,
    }, 
    key: {
      type: String,
    }, 
  };
}