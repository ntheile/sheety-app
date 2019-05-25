import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as XLSX from "xlsx";
import { Environment } from "../../environments/environment";
import { RoutingService } from "../routing.service";
import { DataService } from "./../data.service";
import { UtilsService } from "./../utils.service";

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
          { key: "App Name",  title: "App Name" },
      ],
      staticProps: [
          { key: "@context", value: "https://schema.org/" },
          { key: "@type", value: "App" },
      ],
      id: "${App Name}",
      child: {
          name: "properties",
          rootKeys: null,
          ignoreColumns: [] , 
          genericTransform: true, 
          staticProps: [
              { key: "@context", value: "https://schema.org/" },
              { key: "@type", value: "Result" },
          ],
      },
    };

  constructor(
    public utils: UtilsService,
    public dataService: DataService,
    public router: Router,
    public routingService: RoutingService,
  ) {
    
  }

  init(thing) {
    this.config = this.setConfig(thing);

    this.database = [];
    // workbook = load('../data.xlsx');
    this.workbook = this.dataService.workbook;
    this.sheetNames = this.workbook.SheetNames;
    
    // flatten
    for (const sheet of this.sheetNames) {
        if (!this.config.ignoreSheets.includes(sheet)) {
            const data = this.flatten(sheet);
            for (const item of data) {
                this.database.push(item);
            }
        }
    }
    
    // transform
    this.database = this.transform(this.database);
    
    const jsonStr = JSON.stringify(this.database);
    // fs.writeFile('../data.json', jsonStr, 'utf8', function(){ });
    // fs.writeFile(config.outputDir + "/data.json", jsonStr, 'utf8', function () { });
    this.dataService.data = this.database;
    this.dataService.currentData = this.database;
    this.dataService.originalData = this.database;
    console.log("Transform completed successfully!");

  }

  setConfig(thing) {
    this.thing = thing;
    this.configTemplate.name = thing;
    this.configTemplate.rootKeys = [{key: thing, title: thing}];
    this.configTemplate.id = "${" + thing + "}";
    this.config = this.configTemplate;
    this.config.ignoreSheets = [];
    this.dataService.config = this.config;
    this.routingService.configureDynamicRoutes(Environment.appRoutes);
    return this.config;
  }

  load(excelFile) {
    const workbook = XLSX.readFile(excelFile);
    return workbook;
  }

  flatten(sheetName) {
    const data  = [];
    // data.sheet = sheetName;
    const sheet = this.workbook.Sheets[sheetName];
    const headers = this.utils.get_header_row(sheet);
    const json = XLSX.utils.sheet_to_json(sheet);

    for (const row of json) {
      const transform: any = {};
      transform.sheet = sheetName;
      for (const col of Object.keys(row)) {
        transform[col] = row[col];
      }
      data.push(transform);
    }
    return data;
  }

  transform(database) {

    const data = [];

    //
    // is children or flat data structure
    //

    // is flat     
    if (this.config.rootKeys == null) {
      const data = [];
      for (const row of database) {
        const transform = this.transformRow(row, this.config);
        data.push(transform);
      }
    } else { // is Nested 

      const data = [];
      // for(const row of database){

      // root props
      for (const rootItem of this.config.rootKeys) {

        // find and loop all root children
        const rootChildren = [... new Set(database.map((q) => q[rootItem.key]))];
        for (const rootChild of rootChildren) {
          let transform: any = {};

          transform[rootItem.title] = rootChild;

          // recursive
          const childrenRows = database.filter((q) => q[rootItem.key] == rootChild);

          transform[this.config.child.name] = [];
          for (const childRow of childrenRows) {

            // set root static props
            transform = this.addStaticProps(this.config.staticProps, childRow, transform);

            const transformedRow = this.transformRow(childRow, this.config.child, {});
            transform[this.config.child.name].push(transformedRow);
          }
          data.push(transform);
        }

      }

    }
    return data;
  }

  transformRow(row, config, transform?) {

    const expandAry = [];

    if (config.id) {
      const id = this.replaceTokens(config.id, row);
      transform["@id"] = id;
    }

    // add static keys
    transform = this.addStaticProps(config.staticProps, row, transform);

    for (const col of Object.keys(row)) {
      // ignore cols
      if (config.ignoreColumns) {

        if (config.ignoreColumns === true) {
          // ignore all columns in this transfom
        } else {
          if (!config.ignoreColumns.includes(col)) {
            // expand key value?
            if (config.genericTransform === true) {
              const newData = Object.assign({}, transform);
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
      const childTransform = this.transformRow(row, config.child, {});
      transform[config.child.name] = childTransform;
    }

    if (config.genericTransform === true) {
      return expandAry;
    }

    return transform;
  }

  addStaticProps(staticProps, row, transform) {

    if (staticProps) {
      for (const prop of staticProps) {
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
    const tokens = [];
    let tokenizedString = null;
    // var originalCase = str;
    str = str.toLowerCase().replaceAll(" ", "");
    obj = this.utils.object_keys_to_lower(obj);
    obj = this.utils.object_keys_strip_space(obj);
    const tokensArry = str.split("${");
    for (let item of tokensArry) {
      const tokenRightBoundIndex = item.indexOf("}");
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
      const replaceToken = "${" + token + "}";
      tokenizedString = tokenizedString.replace(replaceToken, obj[token]);
      const a = 1;
    }
    return tokenizedString;
  }

}
