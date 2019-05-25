import { Injectable } from '@angular/core';
import { DataService } from "./../data.service";
import * as _ from "lodash";
import * as d3 from 'd3-collection';
import * as d3Ary from 'd3-array';


@Injectable({
  providedIn: 'root'
})
export class FacetService {


  childPropertiesLeaf = [];
  keyPath = null;
  propsArray = [];
  config;
  data;

  constructor(
    public dataService: DataService
  ) { }

  init(data, config){
    this.data = data;
    this.config = config;
    let facetsAry = [];

    this.findPropertiesLeaf(this.data);

    // break into nested heirarchy, one for each property
    let facets = d3.nest().key(d => d.name).rollup((leaves) => {
        let reduced = d3.map(leaves, (d) => { return d.value });
        return reduced;
    }).entries(this.propsArray);


    // break up the numbers and strings
    let numbersArray = [];
    for (const [index, facet] of facets.entries()) {

        for (let facetProps of facet.value.entries() ) {
            if (facetProps.value.type == "number"){
                numbersArray.push({ [facetProps.value.name]:  facet.value });
                break;
            }
        }
    }

    // find min max for numbers
    for (let numItem of numbersArray){
        let rawNums = [];
        let key = Object.keys(numItem)[0];
        let a = 1;
        for (let num of numItem[key].entries()){
            rawNums.push(num.value.value);
            let a = 1;
        }

        let min = d3Ary.min(rawNums);
        let max = d3Ary.max(rawNums);

        let updateFacet = facets.find( d=>d.key == key );
        updateFacet.min = min;
        updateFacet.max = max;

    }

    // re-model, remove weird keys
    for(let facet of facets){
        let a = 1;
        facet.values = [];
        for (let obj of facet.value.entries()){
            facet.values.push(obj.value);
        }
        delete facet.value;
    }

    // var jsonStr = JSON.stringify(facets);
    // fs.writeFile('../facets.json', jsonStr, 'utf8', function () { });
    //fs.writeFile( config.outputDir + '/facets.json', jsonStr, 'utf8', function () { });

    console.log('Facets completed successfully!');
    return facets;
  }


  findPropertiesLeaf(data) {

    for (let child of data) {

      var a = 1;
      for (let key of Object.keys(child)) {
        if (key == "properties") {
          let hey = 'ya';
          for (let grandKid of child.properties) {
            if (grandKid.length) {
              for (let prop of grandKid) {
                prop[this.config.name] = child[this.config.name];
                this.propsArray.push(prop);
              }
            } else {
              this.propsArray.push(grandKid);
            }
          }
        } else {

          // search child leaves for the key "properties"
          // loop thru the config props

          if (child.child) {
            this.findPropertiesLeaf(child.child);
          }
          else {
            let childKeyName = this.config.child.name;
            let childNode = child[childKeyName];
            if (childNode) {
              this.findPropertiesLeaf(childNode);
            }
          }
        }
      }
    }
  }

  flattenToChildArray(root, prop) {
    let flat = [];
    let children = root.map(p => p[prop]);
    // array to obj
    for (let childArray of children) {
      for (let childObj of childArray) {
        flat.push(childObj);
      }
    }
    return flat;
  }

}
