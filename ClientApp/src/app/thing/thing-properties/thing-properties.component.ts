import { Component, OnInit, Input } from '@angular/core';
import { Environment } from '../../../environments/environment';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-thing-properties',
  templateUrl: './thing-properties.component.html',
  styleUrls: ['./thing-properties.component.scss']
})
export class ThingPropertiesComponent implements OnInit {

  @Input() prop: any;
  @Input() i: any;
  @Input() item: any;
  @Input() currentData: any;
  @Input() routeParams: any;
  @Input() hierarchyDepth: any;
  @Input() currentKey: any;
  @Input() searchOpts: any;
  @Input() shouldFacet: any;
  Environment = Environment;
  ignoreProps = Environment.config.ignoreProps;


  constructor(
    public dataService: DataService
  ) { }

  ngOnInit() {
  }

}
