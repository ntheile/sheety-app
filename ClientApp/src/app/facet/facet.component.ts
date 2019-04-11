import { Component, OnInit, Input } from "@angular/core";
import { DataService } from "./../../services/data.service";
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Environment } from './../../environments/environment';

@Component({
  selector: "app-facet",
  templateUrl: "./facet.component.html",
  styleUrls: ["./facet.component.scss"],
})
export class FacetComponent implements OnInit {

  facets;
  facetsGroup;
  selectedOptions;
  formFacet;
  options;
  Environment = Environment;
  @Input() parent;

  constructor(
    public dataService: DataService,
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit() {
    this.init();
  }

  async init() {
    
  }

  public async getFacets() {
    let facets = await this.dataService.getFacets();
    this.formFacet = this.createFormGroup(facets);
    this.facets = facets;
    return this.facets;
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
        // this.options = {
        //     floor: facet.min,
        //     ceil: facet.max,
        //     step: ( (facet.max + facet.min) / 100)
        // };
        // facet.options = this.options;
        // group[facet.name] = new FormControl([facet.min, facet.max]);
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
      if (items.length > 0 && (typeof items !== "string")) {
        for (let item of items) {
          selected.push(item);
        }
      }
    }
    return selected;
  }

}
