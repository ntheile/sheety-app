import { Injectable } from "@angular/core";
import { Router, Route, Routes } from "@angular/router";
import * as XLSX from "xlsx";
import { Environment } from "../../environments/environment";
import { DataService } from "./../data.service";
import { UtilsService } from "./../utils.service";
import { FacetService } from './facet.service';
import { ThingTransformComponent } from "../../app/thing/thing-transform/thing-transform.component";
import { ThingConfigComponent } from "../../app/thing/thing-config/thing-config.component";
import { ETLComponent } from "../../app/etl/etl.component";
import { ForbiddenComponent } from "../../app/core/forbidden/forbidden.component";
import { LoggedOutComponent } from "../../app/core/loggedout/loggedout.component";
import { HomeComponent } from "../../app/core/home/home.component";


@Injectable({
  providedIn: "root",
})
export class EtlService {

  workbook;
  database;
  sheetNames;
  jsonStr;
  config;
  thing;

  // flat
  configTemplate = {
    name: "App Name",
    rootKeys: [
      { key: "App Name", title: "App Name" },
    ],
    staticProps: [
      { key: "@context", value: "https://schema.org/" },
      { key: "@type", value: "App" },
    ],
    id: "${App Name}",
    child: {
      name: "properties",
      rootKeys: null,
      ignoreColumns: [],
      genericTransform: true,
      staticProps: [
        { key: "@context", value: "https://schema.org/" },
        { key: "@type", value: "Result" },
      ],
    },
    ignoreSheets: [],
    ignoreFacets: ["__EMPTY_2"]
  };

  constructor(
    public utils: UtilsService,
    public dataService: DataService,
    public router: Router,
    public facetService: FacetService,
  ) {

  }

  init(thing, config?) {
    this.clear();
    if (config){
      this.config = this.setConfig(thing, config);
    } else {
      this.config = this.setConfig(thing);
    }
    
    // workbook = load('../data.xlsx');
    this.workbook = this.dataService.workbook;
    this.sheetNames = this.workbook.SheetNames;

    // flatten
    for (let sheet of this.sheetNames) {
      if (!this.config.ignoreSheets.includes(sheet)) {
        let data = this.flatten(sheet);
        for (let item of data) {
          this.database.push(item);
        }
      }
    }

    // transform
    this.database = this.transform(this.database);

    let jsonStr = JSON.stringify(this.database);
    // fs.writeFile('../data.json', jsonStr, 'utf8', function(){ });
    // fs.writeFile(config.outputDir + "/data.json", jsonStr, 'utf8', function () { });
    this.dataService.data.next(this.database);
    this.dataService.saveData(this.database);
    this.dataService.currentData.next(this.database);
    this.dataService.originalData = this.database;
    console.log("Transform completed successfully!");
    let facets = this.facetService.init(this.database, this.config);
    this.dataService.saveFacets(facets);
  }

  clear(){
    this.database = [];
    //this.dataService.routeLookup = [];
    this.dataService.saveFacets(null);
  }

  setConfig(thing, config?) {
    this.thing = thing;
    if (!config){
      this.configTemplate.name = thing;
      this.configTemplate.rootKeys = [{ key: thing, title: thing }];
      this.configTemplate.id = "${" + thing + "}";
      this.config = this.configTemplate;
    } else {
      this.config = config;
    }
    this.dataService.saveConfig(this.config);
    return this.config;
  }

  load(excelFile) {
    let workbook = XLSX.readFile(excelFile);
    return workbook;
  }

  flatten(sheetName) {
    let data = [];
    // data.sheet = sheetName;
    let sheet = this.workbook.Sheets[sheetName];
    let headers = this.utils.get_header_row(sheet);
    let json = XLSX.utils.sheet_to_json(sheet);

    for (let row of json) {
      let transform: any = {};
      transform.sheet = sheetName;
      for (let col of Object.keys(row)) {
        transform[col] = row[col];
      }
      data.push(transform);
    }
    return data;
  }

  transform(database) {

    let data = [];

    //
    // is children or flat data structure
    //

    // is flat     
    if (this.config.rootKeys == null) {
      
      for (let row of database) {
        let transform = this.transformRow(row, this.config);
        data.push(transform);
      }
    } else { // is Nested 

      // for(let row of database){

      // root props
      for (let rootItem of this.config.rootKeys) {

        // find and loop all root children
        let rootChildren = [... new Set(database.map((q) => q[rootItem.key]))];
        for (let rootChild of rootChildren) {
          let transform: any = {};

          transform[rootItem.title] = rootChild;

          // recursive
          let childrenRows = database.filter((q) => q[rootItem.key] == rootChild);

          transform[this.config.child.name] = [];
          for (let childRow of childrenRows) {

            // set root static props
            transform = this.addStaticProps(this.config.staticProps, childRow, transform);

            let transformedRow = this.transformRow(childRow, this.config.child, {});
            transform[this.config.child.name].push(transformedRow);
          }
          data.push(transform);
        }

      }

    }
    return data;
  }

  transformRow(row, config, transform?) {

    let expandAry = [];

    if (config.id) {
      let id = this.replaceTokens(config.id, row);
      transform["@id"] = id;
    }

    // add static keys
    transform = this.addStaticProps(config.staticProps, row, transform);

    for (let col of Object.keys(row)) {
      // ignore cols
      if (config.ignoreColumns) {

        if (config.ignoreColumns === true) {
          // ignore all columns in this transfom
        } else {
          if (!config.ignoreColumns.includes(col)) {
            // expand key value?
            if (config.genericTransform === true) {
              let newData = Object.assign({}, transform);
              newData.name = col;
              newData.value = row[col];
              newData.type = typeof (row[col]);
              expandAry.push(newData);
            } else {
              // normal key value
              transform[col] = row[col];
            }

          }
        }
      }

    }

    // add ui hints
    if (config.ui) {
      transform.ui = config.ui;
    }

    if (config.child) {
      let childTransform = this.transformRow(row, config.child, {});
      transform[config.child.name] = childTransform;
    }

    if (config.genericTransform === true) {
      return expandAry;
    }

    return transform;
  }

  addStaticProps(staticProps, row, transform) {

    if (staticProps) {
      for (let prop of staticProps) {
        transform[prop.key] = this.replaceTokens(prop.value, row);
        if (prop.eval) {
          try {
            transform[prop.key] = eval(transform[prop.key]);
          } catch (e) {
            // evaluation
          }

        }
      }
    }
    return transform;
  }

  // dynamically replaces a string with tokens stored in an array dynamically
  // for example it replaces this @id
  //    "https://dow.com/en-us/industries/${Application}/${Market segment}"
  // with this
  //    "https://dow.com/en-us/industries/Health & Hygiene/Active Comfort"
  replaceTokens(str, obj) {
    let tokens = [];
    let tokenizedString = null;
    // var originalCase = str;
    str = str.toLowerCase().replaceAll(" ", "");
    obj = this.utils.object_keys_to_lower(obj);
    obj = this.utils.object_keys_strip_space(obj);
    let tokensArry = str.split("${");
    for (let item of tokensArry) {
      let tokenRightBoundIndex = item.indexOf("}");
      if (tokenRightBoundIndex >= 0) {
        // get text in front of } and its your token!
        item = item.split("}")[0];
        item = item.toLowerCase().replaceAll(" ", "");
        tokens.push(item);
      }
    }
    tokenizedString = str;
    for (let token of tokens) {
      token = token.replaceAll(" ", "");
      let replaceToken = "${" + token + "}";
      tokenizedString = tokenizedString.replace(replaceToken, obj[token]);
      let a = 1;
    }
    return tokenizedString;
  }

}
