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
import { ExcelService } from "../../services/excel.service";
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
    private sidenav: SidenavService,
    public excelService: ExcelService,
  ) {

  }

  ngOnInit() {
    // if (this.dataService.currentDataCache){
    //   //location.reload();
    // }

    this.clear();
    if (Environment.storageDriver === "sample") {
      const url = location.origin + "/data/" + this.dataService.getDataPath() + "/data.xlsx";
      this.excelService.downloadExcel(url);
    }

    let excelCache = localStorage.getItem("excel");
    if (excelCache) {
      let readtype: any = { type: this.excelService.rABS ? "binary" : "base64" };
      this.excelService.loadExcel(excelCache, readtype);
      this.sheets = this.dataService.getSheets();
      this.workbook = this.dataService.getWorkbook();
      this.showSheet(this.workbook, 0);
    }

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
    for (i = 0, f = files[i]; i !== files.length; ++i) {
      const reader = new FileReader();
      const name = f.name;
      reader.onload = (ee: any) => {
        this.excelService.convertExcelBinary(ee);
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



  openDialog(): void {

    if (!this.headers) {
      alert('Please choose an excel spreadsheet that is tabular and has the first row as headers')
    }

    const dialogRef = this.dialog.open(DialogChooseSearchKey, {
      data: { headers: this.headers },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed, ", result);
      if (result){
        this.setThing(result);
      }
     
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
      <mat-dialog-content align="center">
        <h2 mat-dialog-title>Select a column to use as the search item:</h2>
        <mat-form-field width="100%" >
          <mat-select [(value)]="selectedHeader" >
            <mat-option [value]="header" *ngFor="let header of data.headers">{{ header }}</mat-option>
          </mat-select>
        </mat-form-field>
     
        <h2 mat-dialog-title style="text-align:center">Choose a layout:</h2>
        <div style="display:flex; flex-wrap: wrap;">
          <mat-card style="background:#1e88e5">
            <div class="layout-square" style="cursor:pointer">
              <div class="layout-square">
                  <h3 style="text-align:center">Filter</h3>
                  <div style="text-align:center;">&nbsp;</div>
                </div>
              <img class="layoutImage" src="./../../assets/layouts/filtering.svg" width="150px" />
            </div>
          </mat-card>
          <mat-card>
          <div class="layout-square" >
              <div class="layout-square">
                <h3 style="text-align:center">Category Drill Down</h3>
                <div style="text-align:center;">coming soon</div>
            </div>
            <img src="./../../assets/layouts/category.svg" width="150px" />
          </div>
          </mat-card>
          <mat-card>
          <div class="layout-square" >
            <div class="layout-square">
              <h3 style="text-align:center">Shopping</h3>
              <div style="text-align:center;">coming soon</div>
            </div>
            <img src="./../../assets/layouts/shopping.svg" width="150px" />
          </div>
          </mat-card>
        </div>
      </mat-dialog-content>

      <div mat-dialog-actions>
          <button mat-button [mat-dialog-close]="cancel" >Cancel</button>
          <button mat-button [mat-dialog-close]="selectedHeader" cdkFocusInitial>Ok</button>
      </div>
  `,
})
export class DialogChooseSearchKey {

  selectedHeader;

  constructor(
    public dialogRef: MatDialogRef<DialogChooseSearchKey>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
