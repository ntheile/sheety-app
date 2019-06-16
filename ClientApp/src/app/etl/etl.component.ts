import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Http } from "@angular/http";
import { MAT_DIALOG_DATA, MatBottomSheetConfig, MatDialog, MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";
import * as canvasDatagrid from "canvas-datagrid";
import * as XLSX from "xlsx";
import { DataService } from "../../services/data.service";
import { EtlService } from "../../services/etl/etl.service";
import { Environment } from "../../environments/environment";
import { SidenavService } from "../sidenav.service";
import { ExcelService } from "../../services/excel.service";
import { LayoutDialogComponent } from './../dialogs/layout-dialog/layout-dialog.component';
import { LayoutConfigDialogComponent } from './../dialogs/layout-config-dialog/layout-config-dialog.component';
// dont remove worker of $$ - need to avoid compile error for dynamic module loading with require()
import { worker } from "cluster";
import { $$ } from "protractor";

declare let DropSheet: any;
declare let $: any;
declare let require: any;
declare let window: any;


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

  openLayoutDialog(): void {

    if (!this.headers) {
      alert('Please choose an excel spreadsheet that is tabular and has the first row as headers')
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

    const dialogOKSubscription = dialogRef.componentInstance.okClicked.subscribe(selectedHeader => {
      if (selectedHeader){
        console.log(selectedHeader);
        this.setThing(selectedHeader, dialogRef.componentInstance.data.layout);
      }
      dialogOKSubscription.unsubscribe();
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed, ", result);
    });

  }


  setThing(thing, layout) {
    this.dataService.setThing(thing);
    this.dataService.setLayout(layout);
    let data = this.etlService.init(thing, layout);
    // this.dataService.routeLookup = [];
    // this.router.navigate(['/']);
    location.replace('/');
  }

}
