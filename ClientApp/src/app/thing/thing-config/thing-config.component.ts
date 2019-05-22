import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
declare let require: any;

@Component({
  selector: 'app-thing-config',
  templateUrl: './thing-config.component.html',
  styleUrls: ['./thing-config.component.scss']
})
export class ThingConfigComponent implements OnInit {

  config;

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.getConfig();
  }

  async getConfig(){
    const Config = require(`./../../../data/${this.dataService.getConfigUrl()}`);
    this.config = Config;
    return this.config;
  }



}
