import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { UtilsService } from '../../../services/utils.service';
declare let require: any;
@Component({
  selector: 'app-thing-transform',
  templateUrl: './thing-transform.component.html',
  styleUrls: ['./thing-transform.component.scss']
})
export class ThingTransformComponent implements OnInit {


  transform;
  reduce;
  @ViewChild("transformEl") transformEl: ElementRef;
  @ViewChild("reduceEl") reduceEl: ElementRef;

  constructor(
    public dataService: DataService,
    public utils: UtilsService
  ) { }

  ngOnInit() {
    this.init();
  }

  async init(){
    await this.getFiles();
  }

  async getFiles(){
    // this.transform  = localStorage.getItem("transformer");  // this.dataService.getTransformer(); //require(`./../../../data/${this.dataService.getTransformUrl()}`).transform;
    // this.reduce = localStorage.getItem("reducer");   //this.dataService.getReducer(); // require(`./../../../data/${this.dataService.getReducerUrl()}`).reduce;
    this.transform = await this.dataService.getTransformer();
    this.reduce = await this.dataService.getReducer();
  }

  async saveConfig(){
    // wire up with ETL scripts, need to kick off a new ETL, etl should take these params
    // etl(config, transform, reduce)

    let reduceStr = this.utils.stripHTML(this.reduceEl.nativeElement.innerHTML);
    let transformStr = this.utils.stripHTML(this.transformEl.nativeElement.innerHTML);

    

    await this.dataService.setReducer(reduceStr);
    await this.dataService.setTransformer(transformStr);

  }

  
}
