import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Http } from "@angular/http";
import { MAT_DIALOG_DATA, MatBottomSheetConfig, MatDialog, MatDialogRef } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import * as canvasDatagrid from "canvas-datagrid";
import * as XLSX from "xlsx";
import { DataService } from "../../services/data.service";
import { EtlService } from "../../services/etl/etl.service";
import { Environment } from "../../environments/environment";
import { SidenavService } from "../sidenav.service";
import { ExcelService } from "../../services/excel.service";
import { LayoutDialogComponent } from './../dialogs/layout-dialog/layout-dialog.component';
import { LayoutConfigDialogComponent } from './../dialogs/layout-config-dialog/layout-config-dialog.component';
// dont remove worker or $$ - need to avoid compile error for dynamic module loading with require()
import { worker } from "cluster";
import { $$ } from "protractor";
import { getLocaleDateTimeFormat } from "@angular/common";
import { bounceInOnEnterAnimation, fadeOutOnLeaveAnimation } from "angular-animations";
import { ToggleHide, ToggleShow } from "../spinner/spinner.actions";
import { Store } from "@ngxs/store";
import {MatSnackBar} from '@angular/material/snack-bar';

declare let DropSheet: any;
declare let $: any;
declare let require: any;
declare let window: any;


@Component({
  selector: "app-etl",
  templateUrl: "./etl.component.html",
  styleUrls: ["./etl.component.scss"],
  animations: [
    bounceInOnEnterAnimation(),
    fadeOutOnLeaveAnimation(),
  ]
})
export class ETLComponent implements OnInit {

  formGroup = this.fb.group({
    file: [null, Validators.required],
  });

  sheets;
  workbook;
  json;
  currentSheetJson;
  headers;
  selectedHeader;
  currentSheetIndex;
  routeParams;
  appId;

  @ViewChild("excelEl") excelEl: ElementRef;


  constructor(
    public store: Store,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    public dataService: DataService,
    public http: Http,
    public dialog: MatDialog,
    private router: Router,
    public etlService: EtlService,
    private sidenav: SidenavService,
    public excelService: ExcelService,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {

  }

  ngOnInit() {
    this.init();
  }

  async init(){
    // if (this.dataService.currentDataCache){
      //   //location.reload();
    // }
    this.store.dispatch(new ToggleShow("spinner"));
    this.routeParams = this.activeRoute.snapshot.params;
    console.log('params: ', this.routeParams);
    // getData based on route
    await this.getSheetyData();

    this.clear();
    if (Environment.storageDriver === "sample") {
      const url = location.origin + "/data/" + this.dataService.getDataPath() + "/data.xlsx";
      this.excelService.downloadExcel(url);
    }

    // let excelCache = localStorage.getItem("excel");
    let excelCache = await this.dataService.getExcel();
    if (excelCache) {
      let readtype: any = { type: this.excelService.rABS ? "binary" : "base64" };
      await this.excelService.loadExcel(excelCache, readtype);
      this.sheets = this.dataService.getSheets();
      this.workbook = this.dataService.getWorkbook();
      this.showSheet(this.workbook, 0);
    }

    this.store.dispatch(new ToggleHide("spinner"));
    $(document).ready( ()=>{
      $('.app-loader').hide();
    });


  }

  ngAfterViewInit() {
    this.sidenav.close();
  }


  clear() {
    this.workbook = null;
    this.sheets = null;
    this.json = null;
    this.currentSheetJson = null;
    this.headers = null;
    this.selectedHeader = null;
    this.currentSheetIndex = null;
    this.excelEl.nativeElement.innerHTML = "";
  }



  /// https://gist.github.com/amcdnl/bebcab2e962076558fb4a5f05b96a7e4#file-end-ts 
  onFileChange(e: any) {
    this.excelEl.nativeElement.innerHTML = "";
    const files: any = e.target.files;
    let i;
    let f;
    this.store.dispatch(new ToggleShow("spinner"));
    for (i = 0, f = files[i]; i !== files.length; ++i) {
      const reader = new FileReader();
      const name = f.name;
      reader.onload = async (ee: any) => {
        await this.excelService.convertExcelBinary(ee);
        this.sheets = this.dataService.getSheets();
        this.workbook = this.dataService.getWorkbook();
        this.showSheet(this.workbook, 0);
      };
      if (this.excelService.rABS) {
        reader.readAsBinaryString(f);
      }
      else {
        reader.readAsArrayBuffer(f);
      }
    }
    this.store.dispatch(new ToggleHide("spinner"));
  }



  showSheet(workbook, sheetIndex?) {
    this.currentSheetIndex = sheetIndex;
    if (!workbook) {
      $("canvas-datagrid").remove();
      this.cd.detectChanges();
      workbook = this.workbook;

    }
    const sheet = workbook.SheetNames[sheetIndex || 0];
    this.json = this.excelService.excelToJson(workbook)[sheet];
    this.headers = this.excelService.getHeaders(this.json);
    this.cd.markForCheck();
    this.makeWebExcel(workbook, this.json);
  }

  hideSheet(sheet, i) {
    // this.dataService.con

  }


  makeWebExcel(workbook, json) {

    const grid = this.excelEl.nativeElement;
    grid.style.display = "block";
    grid.style.height = (window.innerHeight - 200) + "px";
    grid.style.width = (window.innerWidth - 10) + "px";

    const cdg = canvasDatagrid({
      parentNode: grid,
    });
    cdg.style.height = "100%";
    cdg.style.width = "100%";
    cdg.data = json;

  }

  openLayoutDialog(): void {

    if (!this.headers) {
      let snackBarRef = this._snackBar.open('Please choose an excel spreadsheet that is tabular and has the first row as headers', "close", { duration: 5000 });
    }

    const dialogRef = this.dialog.open(LayoutDialogComponent, {
      data: { headers: this.headers },
      disableClose: true,
    });

    const dialogOKSubscription = dialogRef.componentInstance.okClicked.subscribe(layout => {
      if (layout){
        console.log(layout);
        this.openLayoutConfigDialog(layout);
      }
      dialogOKSubscription.unsubscribe();
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed, ", result);
    });

  }


  openLayoutConfigDialog(layout){
   
    const dialogRef = this.dialog.open(LayoutConfigDialogComponent, {
      data: { 
        headers: this.headers,
        layout: layout,
      },
      disableClose: true,
    });

    const dialogOKSubscription = dialogRef.componentInstance.okClicked.subscribe(async selectedHeader => {
      if (selectedHeader){
        console.log(selectedHeader);
        await this.setThing(selectedHeader, dialogRef.componentInstance.data.layout);
      }
      dialogOKSubscription.unsubscribe();
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed, ", result);
    });

  }


  async setThing(thing, layout) {
    this.store.dispatch(new ToggleShow("spinner"));
    await this.dataService.setThing(thing);
    this.dataService.setLayout(layout);
    let data = await this.etlService.init(thing, layout);
    // this.dataService.routeLookup = [];
    // this.router.navigate(['/']);
    this.store.dispatch(new ToggleHide("spinner"));
    setTimeout( ()=>{
      location.replace('/search/' + this.dataService.currentSheetyAppModel._id);
    }, 2000 );
  }

  async getSheetyData(){
    let id = this.routeParams['appID'];  
    let sheetyApp = await this.dataService.getSheetyAppModel(id);
    let sheetyAppData = await this.getSheetyAppDataModel();
    console.log('[SheetyAppData] =>', sheetyAppData );
    if (!sheetyAppData){
      this.createSheetyAppDataModel();
    }
  }

  async getSheetyAppDataModel(){
    let data = await this.dataService.getSheetyAppDataModel(this.dataService.currentSheetyAppModel._id);
    console.log('getSheetyAppDataModel: ', data);
    return data;
  }

  async createSheetyAppDataModel(){

    let gaiaUrl = window.userSession.loadUserData().gaiaHubConfig.url_prefix + window.userSession.loadUserData().gaiaHubConfig.address;
    let basefilePath = gaiaUrl + '/' + this.dataService.currentSheetyAppModel._id + '/';

    let newSheetyAppDataModel = {
      sheetyAppModelId: this.dataService.currentSheetyAppModel._id,
      reducer: `
if (searchOptions.keys.includes('products.name') && searchOptions.searchTerm !== null) {
  list = list[0].products.filter(product => product.name == keyword);
}
return list;
      `,
      transformer: `
console.log('=>executing transformer template'); 
searchOptions.omitFields = null;
return searchOptions
      `,      
      dataPath: basefilePath + 'data.json',
      excelPath: basefilePath + 'excel.xml',
      facetsPath: basefilePath + 'facets.json'
    };
    let resp = await this.dataService.createSheetyAppDataModel(newSheetyAppDataModel);
    console.log('[SheetyAppDataModel] Create => ', resp);
    this.init();
  }

  // async updateSheetyAppDataModel(){
  //   let updatedSheetyAppDataModel = {
  //     config: 'updatedConfig' + '12'
  //   };
  //   let resp = await this.dataService.updateSheetyAppDataModel(updatedSheetyAppDataModel);
  //   console.log('[SheetyAppDataModel] Update => ', resp);
  // }


}
