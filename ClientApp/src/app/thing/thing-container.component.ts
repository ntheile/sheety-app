import { Component, OnInit, Input } from '@angular/core';
import { DataService } from "../../services/data.service";
import { Environment } from '../../environments/environment';


@Component({
  selector: 'app-thing-container',
  templateUrl: './thing-container.component.html',
  styleUrls: ['./thing-container.component.scss']
})
export class ThingContainerComponent implements OnInit {

  currentData;
  routeParams;
  hierarchyDepth;
  currentKey;
  searchOpts;
  shouldFacet;
  Environment = Environment;
  ignoreProps = Environment.config.ignoreProps;
  
  
  constructor (
    public dataService: DataService
  ) {

  }

  ngOnInit() {
    this.initData();
  }

  initData(){
    
    this.dataService.currentData.subscribe( (currData)=>{
      this.currentData = currData;
    });

    this.dataService.routeParams.subscribe( (routeParams)=>{
      this.routeParams = routeParams;
    });

    this.dataService.currentKey.subscribe( (currentKey)=>{
      this.currentKey = currentKey;
    });

    this.dataService.searchOpts.subscribe( (searchOpts)=>{
      this.searchOpts = searchOpts;
    });

    this.dataService.shouldFacet.subscribe( (shouldFacet)=>{
      this.shouldFacet = shouldFacet;
    });

  }

}
