import { Environment } from "./../../../environments/environment";
import { BlockstackRadiksModelProvider } from "./../../../drivers/blockstack/BlockstackRadiksModelProvider";
let model;
if (Environment.ModelProvider === BlockstackRadiksModelProvider) {
   let { Model } = require("radiks");
   model = Model;
} 

export class SheetyappModel extends model {
  static className = 'SheetyappModel';
  static schema = {
    name: {
        type: String
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
    }
  };
}