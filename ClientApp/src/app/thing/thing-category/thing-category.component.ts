import { Component, OnInit, Input } from '@angular/core';
import { Environment } from '../../../environments/environment';
import { DataService } from '../../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thing-category',
  templateUrl: './thing-category.component.html',
  styleUrls: ['./thing-category.component.scss']
})
export class ThingCategoryComponent implements OnInit {


  @Input() currentData: any;
  @Input() routeParams: any;
  @Input() hierarchyDepth: any;
  @Input() currentKey: any;
  @Input() searchOpts: any;
  @Input() shouldFacet: any;
  Environment = Environment;
  ignoreProps = Environment.config.ignoreProps;

  constructor(
    public dataService: DataService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  nav(page){
    let route = decodeURI(this.router.url);
    if (!route.includes('search')){
        route = "/search" + route;
    }
    route = route + "/" + page;
    this.router.navigate([route]).then( ()=>{
        // @todo fix reload hack. i.e sometimes data does not load properly if if it reloaded
        location.reload();
    } );
    
}

}
