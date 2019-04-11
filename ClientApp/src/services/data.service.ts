import { HttpClient } from "@angular/common/http";
import { PropertyBindingType } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { initChangeDetectorIfExisting } from "@angular/core/src/render3/instructions";
import * as Fuse from "fuse.js";
import * as _ from "lodash";
import { filter, reduce } from "rxjs/operators";
import { SearchOptions } from "../data/interfaces";
declare let underscore: any;
import { Environment } from "../environments/environment";
import { Ignore  } from './../data/ignore'

@Injectable({
  providedIn: "root",
})
export class DataService {

  hierarchy;
  data;
  routeLookup = [];
  stopDepth = -1;
  keysOrig;
  orginalSearchOptions;
  savedData;
  pubfuse = Fuse;
  facets;
  originalData;
  currentSeachOptions;
  currentData;

  constructor(
    public http: HttpClient,
    public ignore: Ignore,
  ) {
    this.init();
  }

  async init() {

  }

  async getHierarchy() {
    let url;
    if (Environment.isFlat){
      url = "./../data/hierarchy.flat.json"
    } else {
      url = "./../data/hierarchy.json"
    }
    this.hierarchy = await this.http.get(url).toPromise();
    return this.hierarchy;
  }

  async getData() {
    let url;
    if (Environment.isFlat){
      url = "./../data/data.flat.json"
    } else {
      url = "./../data/data.json"
    }
    this.data = await this.http.get(url).toPromise();
    this.originalData = this.data;
    return this.data;
  }

  async getFacets() {

    let url;
    if (Environment.isFlat){
      url = "./../data/facets.flat.json"
    } else {
      url = "./../data/facets.json"
    }

    if (this.getFacets) {
      this.facets = await this.http.get(url).toPromise(); 
      this.facets = this.reduceFacets(this.currentData, this.facets);
      return this.facets;
    } else {
      return null;
    }
  }

  // keys = ['market'],
  // showOnly = 'sheet' || null
  // searchTerm = null || 'Rigids'
  // omitFields = ['products']

  // keys = ['products.name'],
  // showOnly = null
  // omitFields = ['properties']
  // searchTerm = 'DOWLEXTM 2629UE'

  async search(searchOptions: SearchOptions) {

    // Transformer 
    //   - good for custom logic if reading from goofy structured spreadsheets/json
    if (searchOptions.transform) {
      searchOptions = searchOptions.transform(searchOptions);
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
      const reduced = searchOptions.reducer(filtered, searchTerm);
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

  async filter(data, properties) {

    const results = [];

    properties = properties.map((d) => {
      const obj: any = {};
      obj.name = d.name;
      obj.value = d.value;
      return obj;
    });

    // queryBuilder
    let queryBuilder = " q => ";
    for (const prop of properties) {
      queryBuilder = queryBuilder + ` q.name == ${prop.name} `;
    }

    // find by name in properties leaf
    for (const item of data) {
      if (item.properties) {

        // remove dups (the "thing" need to be unique in the data structure); if its a dup we auto remove the second duplicate
        let propsAry;
        if (item.properties.length > 0 ) {
          if (Array.isArray(item.properties[0])){
            propsAry = item.properties[0];
          }
          else {
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
        
        

        // execute query
        let isInList = false;
        for (const prop of properties) {
          const result  = propsAry.filter( (f) => f.name == prop.name && f.value == prop.value );
          if (result.length > 0) {
            isInList = true;
          } else {
            isInList = false;
            break;
          }
        }

        if (isInList) {
          results.push(item);
        }
        
        const a = 1;
      }
    }

    return results;
  }

  async reduceFacets(data, facets){
    
    if (data && facets){
      let ignoreFields = this.ignore.facets();      
      for (let ignoreField of ignoreFields){
        facets = facets.filter(k=> k.key !== ignoreField  );
      }

      //reduce to the facets that pertain to  only the current data set
      let facetsWeCareAbout = [];
      for (let item of data){
        for (let p of item.properties){
          if (Array.isArray(p)){
            for (let prop of p){
              let a = 1;  
              facetsWeCareAbout.push(prop.name)
            }
          } else{
            facetsWeCareAbout.push(p.name)
          }
        }
      }

      facetsWeCareAbout = _.uniq(facetsWeCareAbout);
      
      // remove not relevant facets to our current data set
      for(let facet of facets){
        if (!facetsWeCareAbout.includes(facet.key)){
          facets = facets.filter( f=> f !== facet)
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

}
