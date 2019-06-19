import { Injectable } from "@angular/core";
import * as XLSX from "xlsx";
declare let String: any;
declare let replaceAll: any;
declare let $:any;

@Injectable({
  providedIn: "root",
})
export class UtilsService {

  constructor() { }

  get_header_row(sheet) {
    const headers = [];
    const range = XLSX.utils.decode_range(sheet["!ref"]);
    let C, R = range.s.r; /* start in the first row */
    /* walk every column in the range */
    for (C = range.s.c; C <= range.e.c; ++C) {
      const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]; /* find the cell in the first row */
      let hdr = "UNKNOWN " + C; // <-- replace with your desired default 
      if (cell && cell.t) { hdr = XLSX.utils.format_cell(cell); }
      headers.push(hdr);
    }
    return headers;
  }

  is_empty_field = function(data) {
    if (data.startsWith("__EMPTY")) {
      return true;
    }
  };

  should_show_column = function(col, config) {
    let shouldShow = true;

    if (config.ignoreProps.includes(col) || this.utils.is_empty_field(col)) {
      shouldShow = false;
    }

    return shouldShow;
  };

  remove = function(ary, item) {
    const newAry = ary.filter((a) => a != item);
    return newAry;
  };

  object_keys_to_lower(obj) {
    const objLower = {};
    for (const item of Object.keys(obj)) {
      objLower[item.toLowerCase()] = obj[item];
    }
    return objLower;
  }

  object_keys_strip_space = function(obj) {
    const objSpaceless = {};
    for (const item of Object.keys(obj)) {
      // @ts-ignore
      objSpaceless[item.replaceAll(" ", "")] = obj[item];
    }
    return objSpaceless;
  };

  extend = function(obj, src) {
    for (const key in src) {
      if (src.hasOwnProperty(key)) { obj[key] = src[key]; }
    }
    return obj;
  };

  // dynamically replaces a string with tokens stored in an array dynamically

  replaceTokens(str, obj) {
    const tokens = [];
    let tokenizedString = null;
    str = str.toLowerCase().replaceAll(" ", "");
    obj = this.object_keys_to_lower(obj);
    obj = this.object_keys_strip_space(obj);
    const tokensArry = str.split("${");
    for (let item of tokensArry) {
      const tokenRightBoundIndex = item.indexOf("}");
      if (tokenRightBoundIndex >= 0) {
        // get text in front of } and its your token!
        item = item.split("}")[0];
        tokens.push(item);
      }
    }
    tokenizedString = str;
    for (let token of tokens) {
      token = token.replaceAll(" ", "");
      const replaceToken = "${" + token + "}";
      tokenizedString = tokenizedString.replace(replaceToken, obj[token]);
      const a = 1;
    }
    return tokenizedString;
  }

  stripHTML(data){
    return $( '<div>' + data + '</div>' ).text();
  }

  genGuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

}
