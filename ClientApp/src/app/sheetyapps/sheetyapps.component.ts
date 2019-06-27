import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Inject } from '@angular/core';
import { Store, Select, Selector, ofActionCompleted, ofAction } from '@ngxs/store';
import { AddSheetyApp, RemoveSheetyApp, UpdateSheetyApp, GetAllSheetyApps, DeleteSheetyApp } from '../../actions/sheetyapps.actions';
import { SheetyAppState } from '../../state/sheetyapp.state';
import { Observable } from 'rxjs/Observable';
import { SheetyAppModel } from '../../models/sheetyapp.model';
import { UtilsService } from '../../services/utils.service';
import html2canvas from 'html2canvas';
import { AuthProvider } from '../../drivers/AuthProvider';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation, fadeInExpandOnEnterAnimation, fadeOutCollapseOnLeaveAnimation, bounceInOnEnterAnimation } from 'angular-animations';
import { SpinnerState } from './../../state/spinner.state';
import { ToggleShow, ToggleHide } from './../../actions/spinner.actions';

declare let window: any;

// https://coursetro.com/posts/code/152/Angular-NGXS-Tutorial---An-Alternative-to-Ngrx-for-State-Management
@Component({
  selector: 'app-sheetyapps',
  templateUrl: './sheetyapps.component.html',
  styleUrls: ['./sheetyapps.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation(),
    fadeInExpandOnEnterAnimation(),
    fadeOutCollapseOnLeaveAnimation(),
    bounceInOnEnterAnimation()
  ]
})
export class SheetyAppsComponent implements OnInit {
  
  @Select(SheetyAppState.getSheetyApps) sheetyApps$: Observable<SheetyAppModel>;
  @Select(SpinnerState) loading: Observable<boolean>;

  
  thumbnail = "";
  
  currentSheetyApp: any; // SheetyAppModel;

  constructor(
    private store: Store,
    private utils: UtilsService,
    @Inject('AuthProvider') public authProvider: AuthProvider,
    private cd: ChangeDetectorRef
  ) { 
    window.html2canvas = html2canvas;
    
  }

  ngOnInit() {
    this.getAllSheetyApps();
  }

  async getAllSheetyApps(){
    this.Loading();
    await this.store.dispatch(
      await new GetAllSheetyApps()
    ).toPromise(); 
    this.NotLoading();
  }

  async addSheetyApp(name, json, raw, sheets, thumbnail){

    this.Loading();
    let userInfo = await this.authProvider.getUserInfo();

    this.currentSheetyApp = { 
      name: name, 
      rawData: raw, 
      rawJSON: json, 
      sheets: sheets, 
      thumbnail: thumbnail,
      createdBy: userInfo.name
    };
    await this.store.dispatch( await new AddSheetyApp(this.currentSheetyApp)).toPromise();
    this.NotLoading();
  }


  async genThumbnail(){
    let canvas = await html2canvas(document.body);
    let thumbnail = canvas.toDataURL();
    return thumbnail;
  }

  async createApp(){
    let thumbnail = await this.genThumbnail();
    this.addSheetyApp('excel' + this.randInt() + '.xls', '{json: data}', 'rawBinary', 'sheets', thumbnail);
  }

  async deleteApp(app){
    this.Loading();
    await this.store.dispatch( new DeleteSheetyApp(app) ).toPromise();
    this.NotLoading();
    console.log("delete app")
  }

  async queryApps(){
    this.store.select(state => state.sheetyApps.sheetyApps).subscribe( (apps) => {
      console.log(apps.filter(a=>a._id == 'afd4426e4a00-45d5-a898-f4b06f949652' ));
    });
  }

  randInt(){
    // @ts-ignore
    return parseInt((Math.random() * 100), 10)
  }
  
  Loading() {
    this.store.dispatch(new ToggleShow("spinner"));
  }
  NotLoading() {
    this.store.dispatch(new ToggleHide("spinner"));
  }


}
