import { HttpClient } from "@angular/common/http";
import { Injectable, Inject } from "@angular/core";
import * as Fuse from "fuse.js";
import * as _ from "lodash";
import { SearchOptions } from "../data/interfaces";
declare let underscore: any;
import { Environment } from "../environments/environment";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { StorageProvider } from "../drivers/StorageProvider";
declare let require: any;
declare let blockstack: any;
import 'rxjs/add/operator/toPromise';
import { SheetyappModel } from "../app/sheetyapp/Sheetyapp.model";
import { SheetyAppDataModel } from "../models/sheetyapp.data.model";
import { ModelProvider } from "../drivers/ModelProvider";


@Injectable({
  providedIn: "root",
})
export class DataService {

  hierarchy;
  routeLookup = [];
  stopDepth = -1;
  keysOrig;
  orginalSearchOptions;
  savedData;
  pubfuse = Fuse;
  originalData;
  currentSeachOptions;
  originalFilterData;
  thing;
  config;
  workbook;
  storageDriver = Environment.storageDriver;
  currentDataCache;
  facets;
  sheets;
  layout;
  currentSheetyAppModel: SheetyappModel;
  currentSheetyAppDataModel: SheetyAppDataModel;

  public data: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentData: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public routeParams: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public hierarchyDepth: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentKey: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public searchOpts: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public shouldFacet: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    public http: HttpClient,
    public router: Router,
    @Inject('StorageProvider') private storage: StorageProvider,
    @Inject('ModelProvider') private model: ModelProvider
  ) {
    this.init();
  }

  async init() {
    
  }

  async getHierarchy() {
    // this.hierarchy = Environment.config.jsonNesting;
    let c = await this.getConfig();
    if (!c) {
      console.log("need to choose key in /data");
    }
    this.hierarchy = this.config;
    return this.hierarchy;
  }

  setThing(thing) {
    this.thing = thing;
  }

  setLayout(layout) {
    this.layout = layout;
  }


  getDataUrl() {
    return Environment.transformFolder + "data.json";
  }

  getConfigUrl() {

    return Environment.dataPath + "/config.js";
  }

  // todo made async, so need to refactor the callers
  async getConfig() {

    if (this.storageDriver === "memory") {
      // let configStr = localStorage.getItem("config");
      let configStr = await this.storage.getFile("config");
      if (configStr) {
        this.config = JSON.parse(configStr);
      }
      if (!this.config) {
        console.log("gotta choose key config first on /data page");
      }
      return this.config;
    }

    if (this.storageDriver === "blockstack") {
      let configStr = await blockstack.getFile("config").toPromise();
      if (configStr) {
        this.config = JSON.parse(configStr);
      }
      if (!this.config) {
        console.log("gotta choose key config first on /data page");
      }
      return this.config;
    }


    if (this.storageDriver === "sample") {
      const c = require(`./../data/${this.getConfigUrl()}`);
      this.config = c;
      return c;
    }

  }

  saveConfig(config) {
    this.config = config;
    if (this.storageDriver === "memory") {
      localStorage.setItem("config", JSON.stringify(this.config));
    }
    return this.config;
  }

  genRoute() {

  }

  getTransformUrl() {
    return Environment.dataPath + "/transformer.js";
  }

  getReducerUrl() {
    return Environment.dataPath + "/reducer.js";
  }

  getFacetsUrl() {
    return Environment.transformFolder + "facets.json";
  }

  getExcelUrl() {
    return Environment.dataPath + "/data.xlsx";
  }

  getDataPath() {
    return Environment.dataPath;
  }

  async getSheetyAppModel(id){
    let data = await SheetyappModel.findById(id);
    if (data){
      data = data.attrs;
    }
    this.currentSheetyAppModel = data;
    return data;
  }

  async getSheetyAppDataModel(id){
    let data = await SheetyAppDataModel.fetchList({ sheetyAppModelId: id });
    if (data.length > 0){
      data = data[0].attrs;
    }  else {
      return null;
    } 

    const d = await SheetyAppDataModel.findById(data._id);
    this.currentSheetyAppDataModel = d;
    return data;
  }

  async createSheetyAppDataModel(payload){
    // @ts-ignore
    let newSheetyDatamodel = new SheetyAppDataModel(payload);
    const resp = await newSheetyDatamodel.save();
    return resp.attrs;
  }

  async updateSheetyAppDataModel(payload) {
    // @ts-ignore
    this.currentSheetyAppDataModel.update(payload);
    const resp = await this.currentSheetyAppDataModel.save();
    return resp.attrs;
  }

  async getData() {
    if (this.storageDriver === "memory") {
      let dataLocal = localStorage.getItem("data")
      if (dataLocal) {
        dataLocal = JSON.parse(dataLocal);
        this.currentDataCache = dataLocal;
      }
      if (!this.currentDataCache) {
        // this.router.navigate(['/data']);
      }
      return this.currentDataCache;
    }

    if (this.storageDriver === "sample") {
      const url = this.getDataUrl();
      let data = await this.http.get(url).toPromise();
      this.data.next(data);
      this.originalData = data;
      return data;
    }

  }

  saveData(data) {

    if (this.storageDriver === "memory") {
      localStorage.setItem("data", JSON.stringify(data));
    }

  }

  async getFacets() {

    if (this.storageDriver === "memory") {
      let facetsLocal = localStorage.getItem("facets");
      if (facetsLocal) {
        this.facets = JSON.parse(facetsLocal);
      }
      this.facets = this.reduceFacets(this.currentDataCache, this.facets);
      return this.facets;
    }

    if (this.storageDriver === "sample") {
      const url = Environment.transformFolder + "facets.json";
      let facetsResp = await this.http.get(url).toPromise();
      this.facets = this.reduceFacets(this.currentDataCache, facetsResp);
      return this.facets;
    }

  }

  saveFacets(facets) {
    if (this.storageDriver === "memory") {
      localStorage.setItem("facets", JSON.stringify(facets));
    }

    this.facets = facets;
    return this.facets;
  }

  //
  // 
  // keys = ['market'],
  // showOnly = 'sheet' || null
  // searchTerm = null || 'Rigids'
  // omitFields = ['products']
  // or
  // keys = ['products.name'],
  // showOnly = null
  // omitFields = ['properties']
  // searchTerm = 'Name'
  //
  //
  async search(searchOptions: SearchOptions) {

    // Transformer 
    //   - good for custom logic if reading from goofy structured spreadsheets/json
    if (searchOptions.transform) {
      searchOptions = searchOptions.transform(searchOptions, Environment);
    }
    let data = searchOptions.data;
    const keys = searchOptions.keys;
    const searchTerm = searchOptions.searchTerm;
    const omitFields = searchOptions.omitFields;
    const showOnly = searchOptions.showOnly;
    const headerKey = searchOptions.headerKey;
    const options: any = {
      threshold: 0,
      distance: 0,
      keys,
    };
    if (showOnly) {
      options.id = showOnly;
    }
    let data2 = null;

    // loop the hierchary 
    //   - from the top route to the bottom . it filters down the data 
    //   - good for bookmarking, so you dont have to start at route 1 then 2 then 3 to N
    if (searchOptions.routeParms) {
      if (searchOptions.depth > 1) {
        const nextSearchOptions = JSON.parse(JSON.stringify(searchOptions));
        if (this.stopDepth == 0) {
          // save original options
          this.stopDepth = searchOptions.depth;
          this.keysOrig = searchOptions.keys.slice(0);
          this.orginalSearchOptions = { ...searchOptions };
        }
        for (const levelItem of Object.keys(searchOptions.routeParms)) {
          if (searchOptions.depth < 0 || levelItem == "properties") {
            // you are at the bottom!
            break;
          }
          nextSearchOptions.keys = [];
          nextSearchOptions.keys.push(levelItem);
          nextSearchOptions.searchTerm = searchOptions.routeParms[levelItem];
          nextSearchOptions.depth = (searchOptions.depth - 1);
          nextSearchOptions.routeParms = { [levelItem]: searchOptions.routeParms[levelItem] };
          const opts: any = {
            threshold: 0,
            distance: 0,
            keys: nextSearchOptions.keys,
          };
          if (this.savedData) {
            data = this.savedData;
          }
          const results: any = new Fuse(data, opts);
          let trimmedData;
          if (nextSearchOptions.searchTerm) {
            trimmedData = results.search(nextSearchOptions.searchTerm);
          } else {
            trimmedData = results.list;
          }
          data2 = trimmedData;
          this.savedData = trimmedData;
          const a = 1;
          this.stopDepth--;
        }
      }
    }

    // Search the bottom most node
    if (data2) {
      searchOptions = this.orginalSearchOptions;
      searchOptions.data = data2;
    }
    const results: any = new Fuse(data, options);
    let filtered;
    if (searchTerm) {
      filtered = results.search(searchTerm);
    } else {
      filtered = results.list;
    }

    // Reducer (filters the array some more)
    if (searchOptions.reducer) {
      const reduced = searchOptions.reducer(filtered, searchTerm, searchOptions, Environment);
      filtered = reduced;
    }

    // Omitter (omits keys you don't want)
    if (omitFields) {
      for (const item of filtered) {
        for (let omit of omitFields) {
          const splitDot = omit.split(".");
          omit = splitDot[splitDot.length - 1];
          this.removeKeys(item, [omit]);
        }
      }
    }

    this.currentSeachOptions = searchOptions;

    return filtered;
  }

  async filter(data, propertyGroups) {

    // cache the original data to support filter changes 
    if (this.originalFilterData) {
      data = this.originalFilterData;
    } else {
      this.originalFilterData = data;
    }

    // if no filters are passed return the full dataset
    if (propertyGroups.length == 0) {
      return data;
    }

    const results = [];

    // operation within each Group (AND or OR)
    for (const propertyGroup of propertyGroups) {

      const groupResults = [];
      const removeGroup = [];

      const properties = propertyGroup.properties.map((d) => {
        try {
          const obj: any = {};
          obj.name = d.name;
          obj.value = d.value;
          return obj;
        } catch (e) {
          console.log("no props", e);
        }

      });

      // find by name in properties leaf
      for (const item of data) {
        if (item.properties) {

          // remove dups (the "thing" need to be unique in the data structure); if its a dup we auto remove the second duplicate
          let propsAry;
          if (item.properties.length > 0) {
            if (Array.isArray(item.properties[0])) {
              propsAry = item.properties[0];
            } else {
              propsAry = item.properties;
            }
          }

          // map to only name and value properties
          propsAry = propsAry.map((d) => {
            const obj: any = {};
            obj.name = d.name;
            obj.value = d.value;
            return obj;
          });

          // execute query for OR logicalOperator
          if (propertyGroup.type == "number") {
            const min = propertyGroup.selectedMin;
            const max = propertyGroup.selectedMax;
            const result = propsAry.filter((f) => f.name == propertyGroup.name && f.value >= min && f.value <= max);
            if (result.length > 0) {
              groupResults.push(item);
            }
          } else {
            const isInList = false;
            for (const prop of properties) {
              try {
                if (prop.name === propertyGroup.name) {
                  const result = propsAry.filter((f) => f.name == prop.name && f.value == prop.value);
                  if (result.length > 0) {
                    groupResults.push(item);
                  }
                }
              } catch (e) {
                console.log("null prop", e);
              }

            }
          }
          // @TODO execute query for AND logicalOperator, for example in a car you want a seat color of Black AND White
        }
      }
      if (groupResults.length > 0) {
        results.push(groupResults);
      }
    }

    // AND operation (intersection) against each group results
    const finalResults = _.intersection(...results);
    this.currentData.next(finalResults);
    this.currentDataCache = finalResults;
    return finalResults;

  }

  reduceFacets(data, facets) {


    if (data && facets) {
      const ignoreFields = this.config.ignoreFacets;
      for (const ignoreField of ignoreFields) {
        facets = facets.filter((k) => k.key !== ignoreField);
      }

      // reduce to the facets that pertain to  only the current data set
      let facetsWeCareAbout = [];
      for (const item of data) {
        for (const p of item.properties) {
          if (Array.isArray(p)) {
            for (const prop of p) {
              const a = 1;
              facetsWeCareAbout.push(prop.name);
            }
          } else {
            facetsWeCareAbout.push(p.name);
          }
        }
      }

      facetsWeCareAbout = _.uniq(facetsWeCareAbout);

      // remove not relevant facets to our current data set
      for (const facet of facets) {
        if (!facetsWeCareAbout.includes(facet.key)) {
          facets = facets.filter((f) => f !== facet);
        }
      }
    }

    return facets;


  }

  removeKeys(obj, keys) {
    let index;
    for (const prop in obj) {
      // important check that this is objects own property
      // not from prototype prop inherited
      if (obj.hasOwnProperty(prop)) {
        switch (typeof (obj[prop])) {
          case "string":
            index = keys.indexOf(prop);
            if (index > -1) {
              delete obj[prop];
            }
            break;
          case "object":
            index = keys.indexOf(prop);
            if (index > -1) {
              delete obj[prop];
            } else {
              this.removeKeys(obj[prop], keys);
            }
            break;
        }
      }
    }
  }

  getTransformer() {
    let transformer = null;
    let transformerTemplate = null;
    if (this.storageDriver === "memory") {
      transformer = localStorage.getItem("transformer");
    }
    // let transformerTemplate = require(`../data/${this.getTransformUrl()}`);
    if (!transformer) {
      let functionBody = `
        console.log('=>executing transformer template'); 
        searchOptions.omitFields = null;
        return searchOptions
      `
      transformerTemplate = ["searchOptions", "Environment", functionBody];
      this.setTransformer(functionBody);
    } else{
      transformerTemplate = ["searchOptions", "Environment", transformer];
    }
    transformer = transformerTemplate;
    transformer = new Function(...transformer);
    return transformer;
    // return require(`../data/${this.getTransformUrl()}`);
  }

  setTransformer(transformer) {
    if (this.storageDriver === "memory") {
      transformer = localStorage.setItem("transformer", transformer);
    }
    return transformer;
  }

  getReducer() {
    let reducer = null;
    let reducerTemplate = null;
    if (this.storageDriver === "memory") {
      reducer = localStorage.getItem("reducer");
    }
    if (!reducer) {
      let functionBody =  `
        if (searchOptions.keys.includes('products.name') && searchOptions.searchTerm !== null) {
          list = list[0].products.filter(product => product.name == keyword);
        }
        return list;
      `;
      reducerTemplate = ["list", "keyword", "searchOptions", "Environment", functionBody];
      this.setReducer(functionBody);
    } else{
      reducerTemplate = ["list", "keyword", "searchOptions", "Environment", reducer];
    }
    reducer = reducerTemplate;
    reducer = new Function(...reducer);
    return reducer;
    //return require('../data/' + this.getReducerUrl());
  }

  setReducer(reducer) {
    if (this.storageDriver === "memory") {
      reducer = localStorage.setItem("reducer", reducer);
    }
    return reducer;
    //return reducer;
  }

  getWorkbook() {
    return this.workbook;
  }

  setWorkbook(workbook) {
    this.workbook = workbook;
  }

  getSheets() {

    if (this.storageDriver === "memory") {
      let sheets = localStorage.getItem("sheets");
      if (sheets) {
        this.sheets = JSON.parse(sheets);
      }
    }

    return this.sheets;
  }

  setSheets(sheets) {

    if (this.storageDriver === "memory") {
      localStorage.setItem("sheets", JSON.stringify(sheets));
    }
  }





}
