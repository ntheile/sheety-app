import { Component, OnInit, Input } from '@angular/core';
import { Environment } from '../../../environments/environment';
import { DataService } from '../../../services/data.service';
import { Router } from '@angular/router';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation, fadeInExpandOnEnterAnimation, fadeOutCollapseOnLeaveAnimation, bounceInOnEnterAnimation } from 'angular-animations';


@Component({
  selector: 'app-thing-category',
  templateUrl: './thing-category.component.html',
  styleUrls: ['./thing-category.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation(),
    fadeInExpandOnEnterAnimation(),
    fadeOutCollapseOnLeaveAnimation(),
    bounceInOnEnterAnimation()
  ]
})
export class ThingCategoryComponent implements OnInit {


  currentData;
  routeParams;
  hierarchyDepth;
  currentKey;
  searchOpts;
  shouldFacet;
  Environment = Environment;
  ignoreProps = Environment.config.ignoreProps;

  constructor(
    public dataService: DataService,
    private router: Router,
  ) { }

  ngOnInit() {
   this.initData();
  }

  nav(page) {
    console.log('[Router Config] ', this.router.config);
    let route = decodeURI(this.router.url);
    if (!route.includes('search')) {
      route = "/search" + route;
    }
    route = route + "/" + page;
    route = route.replace("//", "/");
    this.router.navigate([route]).then(() => {
      // @todo fix reload hack. i.e sometimes data does not load properly if if it reloaded
      // location.reload();
    });

  }

  initData(){
    console.log('[Router Config] ', this.router.config);
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
