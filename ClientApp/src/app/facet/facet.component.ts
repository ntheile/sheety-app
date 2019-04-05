import { Component, OnInit } from "@angular/core";
import { DataService } from "./../../services/data.service";

@Component({
  selector: "app-facet",
  templateUrl: "./facet.component.html",
  styleUrls: ["./facet.component.scss"],
})
export class FacetComponent implements OnInit {

  facets;
  selectedOptions;

  constructor(
    public dataService: DataService,
  ) {
    
  }

  ngOnInit() {
    this.init();
  }

  async init() {
    this.facets = await this.getFacets();
  }

  public async getFacets() {
    this.facets = await this.dataService.getFacets();
    return this.facets;
  }

  onNgModelChange(event) {
    console.log("on ng model change", event);

    // now filter your props

  }

}
