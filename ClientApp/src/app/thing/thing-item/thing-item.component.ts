import { Component, OnInit, Input } from '@angular/core';
import { Environment } from '../../../environments/environment';
import { DataService } from '../../../services/data.service';
import { isTemplateExpression } from 'typescript';

@Component({
  selector: 'app-thing-item',
  templateUrl: './thing-item.component.html',
  styleUrls: ['./thing-item.component.scss']
})
export class ThingItemComponent implements OnInit {

  @Input() item: any;
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

    // turn properties into array to tak into consideration duplicate things (keys) with the same name
    if (Array.isArray(this.item.properties[0]) === false) {
      this.item.properties = [
        this.item.properties
      ]
    }

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
