// export interface SheetyAppModel {
//     sheets: Array<string>;
//     name: string;
//     rawData: any;
//     rawJSON: any;
//     id: string;
//     thumbnail: any;
// }
// sheets ['cars', 'commercial']
// name cars.xlsx
// rawData nvcds8(*(JDS))  
// rawJSON [{}]
// id 43543-fdvfegdfb34-vdffd34r-vdfvdf

import { Model } from 'radiks';

export class SheetyAppModel extends Model {
  static className = 'SheetyAppModel';
  static schema = {
    sheets: {
      type: Array<String>()
    },
    name: {
        type: String
    },
    rawData: {
        type: String // base64 encoded data
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