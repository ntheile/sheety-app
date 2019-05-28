import { Component, OnInit, Input } from '@angular/core';
import { DataService } from "../../../services/data.service";
import { Environment } from '../../../environments/environment';

@Component({
  selector: 'app-thing-list',
  templateUrl: './thing-list.component.html',
  styleUrls: ['./thing-list.component.scss'],
})
export class ThingListComponent implements OnInit {

  currentData;
  routeParams;
  hierarchyDepth;
  currentKey;
  searchOpts;
  shouldFacet;
  Environment = Environment;
  ignoreProps = Environment.config.ignoreProps;

  constructor(
    public dataService: DataService
  ) { }

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
