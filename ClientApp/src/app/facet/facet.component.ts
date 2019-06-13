import { Component, OnInit, Input, EventEmitter } from "@angular/core";
import { DataService } from "./../../services/data.service";
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Environment } from './../../environments/environment';
import { Options } from 'ng5-slider';


@Component({
  selector: "app-facet",
  templateUrl: "./facet.component.html",
  styleUrls: ["./facet.component.scss"],
})
export class FacetComponent implements OnInit {

  public facets;
  facetsGroup;
  selectedOptions;
  formFacet;
  options: Options;
  Environment = Environment;
  facetsTouchedAry = [];
  @Input() parent;
  sliderRefreshHackEvent: EventEmitter<void> = new EventEmitter<void>();


  constructor(
    public dataService: DataService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.init();
  }

  async init() {

    // subsribe to data change

    this.dataService.currentData.subscribe( async (currData)=>{
      this.facets = await this.dataService.getFacets();
      this.formFacet = this.createFormGroup(this.facets);
      this.sliderRefreshHackEvent.emit();
    });
  }
  
  public createFormGroup(facets): FormGroup {
    let group: any = {};

    let i = 0;
    for (let facet of facets) {
      if (facet.values[0].type == 'string') {
        for (let val in facet.values) {
          // @ts-ignore
          group[facet.key] = new FormControl(val);
        }

      } else {
        facet.options = {
           floor: facet.min,
           ceil: facet.max,
           step: .01
         };
        group[facet.key] = new FormControl([facet.min, facet.max]);
      }
      i++;
    }

    let returnGroup: FormGroup = new FormGroup(group);

    console.log(returnGroup.controls)

   
    return returnGroup;
  }

  onNgModelChange(event) {
    console.log("on ng model change", event);

    // now filter your props

  }

  public getSelectedFilters() {
    let selected = [];
    for (let key of Object.keys(this.formFacet.value)) {
      let items = this.formFacet.value[key];
      if (Array.isArray(items)){
        if(typeof items[0] !== "number"){
          let obj = {
            name: key,
            properties: items
          }
          if (items.length > 0){
            selected.push(obj);
          }
        }
        else { 
          if (this.facetsTouchedAry.includes(key)){

            let numbersRangeAry = this.facets.find( f=> f.key == key );

            let obj = {
              name: key,
              properties: numbersRangeAry.values,
              selectedMin: numbersRangeAry.min,
              selectedMax: numbersRangeAry.max,
              min: numbersRangeAry.options.floor,
              max: numbersRangeAry.options.ceil,
              type: 'number'
            }
            selected.push(obj);
          }
        }
      }
    }
    return selected;
  }

  unselectFacet(facet){
    let f = this.formFacet;
    let a = 1;
  } 

  facetTouched(facet){
    if (!this.facetsTouchedAry.includes(facet)){
      this.facetsTouchedAry.push(facet);
    }
  }

}
