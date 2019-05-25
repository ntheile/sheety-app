import { Component, OnInit } from "@angular/core";
import { DataService } from "../../../services/data.service";
declare let require: any;

@Component({
  selector: "app-thing-config",
  templateUrl: "./thing-config.component.html",
  styleUrls: ["./thing-config.component.scss"],
})
export class ThingConfigComponent implements OnInit {

  config;
  thing;

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.getConfig();
  }

  async getConfig() {
   
    this.config = this.dataService.getConfig();
    return this.config;
  }

}
