import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { DataService } from "../../../services/data.service";
import { EtlService } from "../../../services/etl/etl.service";
import { UtilsService } from './../../../services/utils.service';
declare let require: any;
declare let $: any;
@Component({
  selector: "app-thing-config",
  templateUrl: "./thing-config.component.html",
  styleUrls: ["./thing-config.component.scss"],
})
export class ThingConfigComponent implements OnInit {

  config;
  thing;
  @ViewChild("configEl") configEl: ElementRef;

  constructor(
    public dataService: DataService,
    public etlService: EtlService,
    public utils: UtilsService
  ) { }

  
  ngOnInit() {
    
    this.getConfig();
  }

  async getConfig() {
   
    this.config = this.dataService.getConfig();
    return this.config;
  }

  saveConfig(){
    let configObj:any = JSON.parse( this.utils.stripHTML(this.configEl.nativeElement.innerHTML) ) ;
    this.dataService.saveConfig(configObj);
    this.etlService.init(configObj.name, configObj);
  }

}
