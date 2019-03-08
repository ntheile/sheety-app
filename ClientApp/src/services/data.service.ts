import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { initChangeDetectorIfExisting } from '@angular/core/src/render3/instructions';
import * as Fuse from 'fuse.js';
import * as _ from 'lodash';
import { SearchOptions } from '../data/interfaces';
import { filter, reduce } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  hierarchy;
  data;
  routeLookup = [];
  stopDepth = -1;
  keysOrig;
  orginalSearchOptions;
  savedData;

  constructor(
    public http: HttpClient,
  ) {
    this.init();
  }

  async init() {

  }

  async getHierarchy() {
    this.hierarchy = await this.http.get('./../data/hierarchy.json').toPromise();
    return this.hierarchy;
  }

  async getData() {
    this.data = await this.http.get('./../data/data.json').toPromise();
    return this.data;
  }

  async getDataAtDepth(depth, keys, filterStr, refresh, childKeys) {
    let childData = null;
    if (!this.data || refresh) {
      await this.getData();
    }

    if (filterStr) {


      // this.data[0].products.filter( f=>f.name == 'DOWLEXTM 2629UE' )

      if (  _.isArray(this.data) ) {
        this.data = this.data.filter(eval(filterStr));
        let loopedData = [];
        for (let item of this.data) {
          let d = item['products'].find(  item => item.name === 'DOWLEXTM 2629UE' ) ;  
          if (d){
            loopedData.push(d);
          }
        }
      } else {
        // for (let aryItem of this.data){
        //   let b = 2;
        // }
        let a = 1;
      }
    }


    if (keys.length === 0) {
      childData = this.data;
    } else {
      // example query: this.data.map( item => ( {'sheet': item.sheet ,'market': item.market } ) )
      let query = 'item => ({';
      let i = 1;
      for (const key of keys) {
        query = query + ` '${key.key}' : item.${key.key} `;
        if (i < keys.length) {
          query = query + ',';
        }

        i++;
      }
      query = query + '})';
      const mappedData = this.data.map(eval(query));
      childData = Array.from(new Set(mappedData));
    }

    if (childKeys.length > 0) {
      // delete child (children are shown in sub page)
      for (const key of keys) {
        if (childKeys.length > 0) {
          for (const childAry of childData) {
            const omitChildren = childAry[`${key.key}`];
            for (const childKey of childKeys) {
              for (const omitChild of omitChildren) {
                delete omitChild[`${childKey.key}`];
              }
            }
          }
        }
      }
    } else { // you are at the bottom, create facets and details page

    }

    return childData;
  }

  async getDataAt(data, depth, childKey) {
    
    let childData = [];

    let d = data;
    let dep = depth;
    let chi = childKey;





   
    return childData;
  }

  // /market/Rigids/products/DOWLEXTM%202629UE/0
  async search(route) {

    if (!this.data) {
      await this.getData();
    }


    // pair 1

    // /markets
    let options: any = {
      keys: ['market'],
    };
    let markets: any = new Fuse(this.data, options);
    let marketKeys = markets.list.map(select => select.market);

    // /markets/Active Comfort
    let oneMarket = markets.search('Active Comfort');
    let arraysToConcat = [];
    for (let item of oneMarket) {
      arraysToConcat.push(item.products);
    }
    let oneMarketsProducts = Array.prototype.concat.apply([], arraysToConcat);


    // sub pair 2

    // /markets/Active Comfort/products
    options = {
      keys: ['name']
    };
    let products = new Fuse(oneMarketsProducts, options);

    // properties
    // /markets/Active Comfort/products/50% ASPUN 6834 + 50%PP/0
    let oneProduct: any = products.search('50% ASPUN 6834 + 50%PP');
    let oneProductProps = oneProduct[0].properties;

    let a = 1;
  }

  // keys = ['market'],
  // showOnly = 'sheet' || null
  // searchTerm = null || 'Rigids'
  // omitFields = ['products']
  

  // keys = ['products.name'],
  // showOnly = null
  // omitFields = ['properties']
  // searchTerm = 'DOWLEXTM 2629UE'
  
  async search2(searchOptions: SearchOptions) {
  
    if (searchOptions.transform) {
      searchOptions = searchOptions.transform(searchOptions);
    }
    
    let data = searchOptions.data;
    let keys = searchOptions.keys;
    let searchTerm = searchOptions.searchTerm;
    let omitFields = searchOptions.omitFields;
    let showOnly = searchOptions.showOnly;
  

    let options: any = {
      threshold: 0,
      distance: 0,
      keys: keys
    };

    if (showOnly) {
      options.id = showOnly;
    }

    let data2 = null;
   
     // recurse the hierchary to from the top route to the bottom to filter down the data (good for bookmarking, so you dont have to start at route 1)
    if (searchOptions.routeParms){
      if ( searchOptions.depth  > 1 ) {
        // recurse
        let nextSearchOptions = JSON.parse(JSON.stringify(searchOptions));
        if (this.stopDepth == 0){
          // this.search = searchOptions.routeParms.length;
          this.stopDepth = searchOptions.depth;
          this.keysOrig  = searchOptions.keys.slice(0);
          this.orginalSearchOptions = {...searchOptions};
        }
        for (let levelItem of Object.keys(searchOptions.routeParms) ){
          
          if ( searchOptions.depth < 0 || levelItem == 'properties') {
            // you are at the bottom!
            break;
          }
          // stop when you are at the bottoms
          nextSearchOptions.keys = [];
          nextSearchOptions.keys.push(levelItem);
          nextSearchOptions.searchTerm = searchOptions.routeParms[levelItem];
          nextSearchOptions.depth = (searchOptions.depth - 1);
          nextSearchOptions.routeParms = {[levelItem]: searchOptions.routeParms[levelItem]}
          let opts: any = {
            threshold: 0,
            distance: 0,
            keys: nextSearchOptions.keys 
          };
          if (this.savedData){
            data = this.savedData;
          }
          let results: any = new Fuse(data, opts);
          let trimmedData ;
          if (nextSearchOptions.searchTerm) {
            trimmedData = results.search(nextSearchOptions.searchTerm);
          } else {
            trimmedData = results.list;
          }
         // await this.search2(nextSearchOptions);
          data2 = trimmedData;
          this.savedData = trimmedData;
          let a = 1;
          this.stopDepth--;
        }
        
      } else{
        
      }
    }


    if (data2){
      searchOptions = this.orginalSearchOptions;
      searchOptions.data = data2;
    }
    
    
    let results: any = new Fuse(data, options);
    let filtered; 
    if (searchTerm) {
      filtered = results.search(searchTerm);
    } else {
      filtered = results.list;
    }

    // if search term make sure you are filtered down
    if (searchOptions.reducer) {
      let reduced = searchOptions.reducer(filtered, searchTerm);
      filtered = reduced;
    }
    


    if (omitFields) {
      for (let item of filtered) {
         for (let omit of omitFields) {
             let splitDot = omit.split('.');
             omit = splitDot[splitDot.length - 1];
             this.removeKeys(item, [omit] );  
         }
      }
    }
    let a = 1;
    return filtered;
  
  }


  removeKeys (obj, keys){
    var index;
    for (var prop in obj) {
        // important check that this is objects own property
        // not from prototype prop inherited
        if(obj.hasOwnProperty(prop)){
            switch(typeof(obj[prop])){
                case 'string':
                    index = keys.indexOf(prop);
                    if(index > -1){
                        delete obj[prop];
                    }
                    break;
                case 'object':
                    index = keys.indexOf(prop);
                    if(index > -1){
                        delete obj[prop];
                    }else{
                        this.removeKeys(obj[prop], keys);
                    }
                    break;
            }
        }
    }
  }
  
 
}