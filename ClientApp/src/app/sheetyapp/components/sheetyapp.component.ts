import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Inject } from '@angular/core';
import { Store, Select, Selector, ofActionCompleted, ofAction } from '@ngxs/store';
import { Observable } from 'rxjs/Observable';
import { GetSheetyapp, AddSheetyapp, UpdateSheetyapp, DeleteSheetyapp } from '../sheetyapp.actions';
import { SheetyappModel } from '../sheetyapp.model';
import { SheetyappState } from '../sheetyapp.state';
import { SpinnerState } from '../../../state/spinner.state';
import { ToggleShow, ToggleHide } from '../../../actions/spinner.actions';
import { fadeOutOnLeaveAnimation, bounceInOnEnterAnimation } from 'angular-animations';
import { UtilsService } from '../../../services/utils.service';
import { AuthProvider } from '../../../drivers/AuthProvider';
import { AppConfigDialogComponent, AppConfigData } from './../dialogs/appconfig-dialog.component';
import { MAT_DIALOG_DATA, MatBottomSheetConfig, MatDialog, MatDialogRef } from "@angular/material";
declare let window: any;
import html2canvas from 'html2canvas';
import { DataService } from '../../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sheetyapp',
  templateUrl: './sheetyapp.component.html',
  styleUrls: ['./sheetyapp.component.scss'],
  animations: [
    bounceInOnEnterAnimation(),
    fadeOutOnLeaveAnimation(),
  ]
})
export class SheetyappComponent implements OnInit {
  
  @Select(SheetyappState.select) sheetyapps$: Observable<SheetyappModel>;
  @Select(SpinnerState) loading: Observable<boolean>;

  currentSheetyapp;
  thumbnail = "";
  

  constructor(
    private store: Store,
    private utils: UtilsService,
    private cd: ChangeDetectorRef,
    @Inject('AuthProvider') public authProvider: AuthProvider,
    public dialog: MatDialog,
    public dataService: DataService,
    private router: Router,
  ) { 
    window.html2canvas = html2canvas;
  }

  ngOnInit() {
    this.getSheetyapp();
  }

  async getSheetyapp(){
    this.Loading();
    await this.store.dispatch(
      await new GetSheetyapp()
    ).toPromise(); 
    this.NotLoading();
  }

  async addSheetyapp(payload: AppConfigData) {
    this.Loading();
    let model: SheetyappModel = new SheetyappModel();
    model.attrs.name = payload.name;
    model.attrs.layout = payload.layout;    
    model.attrs.isPublic = false;
    this.currentSheetyapp = model.attrs;
    await this.store.dispatch( await new AddSheetyapp(this.currentSheetyapp)).toPromise();
    this.dataService.currentSheetyAppModel = this.currentSheetyapp;
    this.NotLoading();
  }

  gotoApp(app: SheetyappModel){
    this.dataService.currentSheetyAppModel = app;
    this.router.navigate(['/data', app._id]);
  }

  
  async deleteSheetyapp( payload ){
    this.Loading();
    await this.store.dispatch( new DeleteSheetyapp(payload) ).toPromise();
    this.NotLoading();
  }

  async query(){
    this.store.select(state => state.sheetyapp.sheetyapp).subscribe( ( data ) => {
      // console.log(data.filter(a=>a._id == '' ));
    });
  }

  openAppConfigDialog(): void {

    const dialogRef = this.dialog.open(AppConfigDialogComponent, {
      data: { },
      disableClose: true,
    });

    const dialogOKSubscription = dialogRef.componentInstance.okClicked.subscribe( (result: AppConfigData ) => {
      if (result){
        console.log(result);
        // this.openLayoutConfigDialog(layout);
        this.addSheetyapp(result);
      }
      dialogOKSubscription.unsubscribe();
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed, ", result);
    });

  }

  getRandNum(){
    return (this.utils.getRandomInt(1, 5)).toString() ;
  }

  Loading() {
    this.store.dispatch(new ToggleShow("spinner"));
  }

  NotLoading() {
    this.store.dispatch(new ToggleHide("spinner"));
  }

}
