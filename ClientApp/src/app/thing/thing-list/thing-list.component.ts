import { Component, OnInit, Input } from '@angular/core';
import { DataService } from "../../../services/data.service";
import { Environment } from '../../../environments/environment';

@Component({
  selector: 'app-thing-list',
  templateUrl: './thing-list.component.html',
  styleUrls: ['./thing-list.component.scss']
})
export class ThingListComponent implements OnInit {

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
