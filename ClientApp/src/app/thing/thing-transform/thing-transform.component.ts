import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
declare let require: any;
@Component({
  selector: 'app-thing-transform',
  templateUrl: './thing-transform.component.html',
  styleUrls: ['./thing-transform.component.scss']
})
export class ThingTransformComponent implements OnInit {


  transform;
  reduce;

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.getFiles();
  }

  getFiles(){
    this.transform  = require(`./../../../data/${this.dataService.getTransformUrl()}`).transform;
    this.reduce = require(`./../../../data/${this.dataService.getReducerUrl()}`).reduce;
  }

}
