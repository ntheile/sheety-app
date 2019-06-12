import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Http } from "@angular/http";
import { MAT_DIALOG_DATA, MatBottomSheetConfig, MatDialog, MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";
import * as canvasDatagrid from "canvas-datagrid";
import { worker } from "cluster";
import { $$ } from "protractor";
import * as XLSX from "xlsx";
import { DataService } from "../../services/data.service";
import { EtlService } from "../../services/etl/etl.service";
import { Environment } from "../../environments/environment";
import { SidenavService } from "../sidenav.service";
declare let DropSheet: any;
declare let $: any;
declare let require: any;
declare let window: any;
export interface DialogData {
  headers: any;
}

@Component({
  selector: "app-etl",
  templateUrl: "./etl.component.html",
  styleUrls: ["./etl.component.scss"],
})
export class ETLComponent implements OnInit {

  formGroup = this.fb.group({
    file: [null, Validators.required],
  });
  rABS = typeof FileReader !== "undefined" && FileReader.prototype && FileReader.prototype.readAsBinaryString;
  sheets;  
  workbook;
  json;
  currentSheetJson;
  headers;
  selectedHeader;
  currentSheetIndex;
  @ViewChild("excelEl") excelEl: ElementRef;

  
  constructor(
    private fb: FormBuilder, 
    private cd: ChangeDetectorRef,
    public dataService: DataService,
    public http: Http,
    public dialog: MatDialog,
    private router: Router,
    public etlService: EtlService,
    private sidenav: SidenavService
    ) {

  }

  ngOnInit() {
    // if (this.dataService.currentDataCache){
    //   //location.reload();
    // }
    
    this.clear();
    if (Environment.storageDriver === "sample"){
      const url = location.origin + "/data/" + this.dataService.getDataPath() + "/data.xlsx";
      this.downloadExcel(url);
    }

    let excelCache = localStorage.getItem("excel");
    if(excelCache){
      let readtype: any = {type: this.rABS ? "binary" : "base64" };
      this.loadExcel(excelCache, readtype);
    }

  } 

  ngAfterViewInit(){
    this.sidenav.close();
  }


  clear(){
    this.workbook = null;
    this.sheets = null;  
    this.json = null;
    this.currentSheetJson = null;
    this.headers = null;
    this.selectedHeader = null;
    this.currentSheetIndex = null;
    this.excelEl.nativeElement.innerHTML = "";
  }

  async downloadExcel(url) {
    const req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "arraybuffer";
    req.onload = (e) => {
      const data = new Uint8Array(req.response);
      this.convertExcelBinary(null, data);
    };
    req.send();
  }

  /// https://gist.github.com/amcdnl/bebcab2e962076558fb4a5f05b96a7e4#file-end-ts 
  onFileChange(e: any) {
    this.excelEl.nativeElement.innerHTML = "";
    const files: any = e.target.files;
    let i;
    let f;
    for (i = 0, f = files[i]; i !== files.length; ++i) {
      const reader = new FileReader();
      const name = f.name;
      reader.onload = (ee: any) => {
        this.convertExcelBinary(ee);
      };
      if (this.rABS) { reader.readAsBinaryString(f); } else { reader.readAsArrayBuffer(f); }
    }
  }

  convertExcelBinary(e?, rawData?) {
    let data;
    let wb;
    let arr;
    let readtype: any = {type: this.rABS ? "binary" : "base64" };
    if (rawData) {
      data = rawData;
      readtype = {type: "array"};
    } else {
      data = e.target.result;
      if (!this.rABS) {
        arr = this.fixdata(data);
        data = btoa(arr);
      }
    }
    this.saveExcelBlob(data);
    this.loadExcel(data, readtype);
  }

  saveExcelBlob(data){
    if(this.dataService.storageDriver === "memory"){
      localStorage.setItem("excel", data);    
    }
  }

  loadExcel(data, readtype?){
    let wb;
    try {
      wb = XLSX.read(data, readtype);
      this.workbook = wb;
      this.dataService.workbook = this.workbook;
      this.sheets = wb.SheetNames;
      this.showSheet(this.workbook, 0);
    } catch (e) { 
      console.log(e); 
    }
  }

  showSheet(workbook, sheetIndex?) {
    this.currentSheetIndex = sheetIndex;
    if (!workbook) {
      $("canvas-datagrid").remove();
      this.cd.detectChanges();
      workbook = this.workbook;
      
    }
    const sheet = workbook.SheetNames[sheetIndex || 0];
    this.json = this.excelToJson(workbook)[sheet];
    this.headers = this.getHeaders(this.json);
    this.cd.markForCheck();
    this.makeWebExcel(workbook, this.json);
  }

  hideSheet(sheet, i){
    // this.dataService.con

  }

  excelToJson(workbook) {
      const result = {};
      workbook.SheetNames.forEach( (sheetName) => {
        const roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {raw: false});
        if (roa.length > 0) { result[sheetName] = roa; }
      });
      return result;
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

  fixdata(data) {
    let o = "";
    let l = 0;
    const w = 10240;
    for (; l < data.byteLength / w; ++l) {
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
    }
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(o.length)));
    return o;
  }

  getHeaders(json) {
    this.headers = [];
    let numSheets = this.sheets.length;
    for (let i = 0; i <= numSheets; i++ ){
      for (let header of Object.keys(json[i])){
        this.headers.push(header)
      }
    }
   
    return this.headers;
  }

  openDialog(): void {

    if (!this.headers){
      alert('Please choose an excel spreadsheet that is tabular and has the first row as headers')
    }

    const dialogRef = this.dialog.open(DialogChooseSearchKey, {
      data: {headers: this.headers},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed, ", result);
      this.setThing(result);
    });
  }

  setThing(thing) {
    this.dataService.setThing(thing);
    let data = this.etlService.init(thing);
    // this.dataService.routeLookup = [];
    // this.router.navigate(['/']);
    location.replace('/');
  }

}

@Component({
  selector: "dialog-choose-search-key",
  template: `
      <div mat-dialog-content>
        <h1 mat-dialog-title>Select a column to <br/> use as the search item:</h1>
          <mat-form-field>
            <mat-select [(value)]="selectedHeader" >
              <mat-option [value]="header" *ngFor="let header of data.headers">{{ header }}</mat-option>
            </mat-select>
        </mat-form-field>
      </div>
      <div mat-dialog-actions>
          <button mat-button [mat-dialog-close]="selectedHeader" cdkFocusInitial>Ok</button>
      </div>
  `,
})
export class DialogChooseSearchKey {

  selectedHeader;

  constructor(
    public dialogRef: MatDialogRef<DialogChooseSearchKey>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
