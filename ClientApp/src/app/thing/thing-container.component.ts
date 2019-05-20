import { Component, OnInit, Input } from '@angular/core';
import { DataService } from "../../services/data.service";
import { Environment } from '../../environments/environment';


@Component({
  selector: 'app-thing-container',
  templateUrl: './thing-container.component.html',
  styleUrls: ['./thing-container.component.scss']
})
export class ThingContainerComponent implements OnInit {

  @Input() currentData: any;
  @Input() routeParams: any;
  @Input() hierarchyDepth: any;
  @Input() currentKey: any;
  @Input() searchOpts: any;
  @Input() shouldFacet: any;
  Environment = Environment;
  ignoreProps = Environment.config.ignoreProps;
  
  
  constructor (
    public dataService: DataService
  ) {

  }

  ngOnInit() {
    
  }

}
