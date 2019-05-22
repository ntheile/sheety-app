import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Http } from "@angular/http";
import * as canvasDatagrid from "canvas-datagrid";
import { $$ } from "protractor";
import * as XLSX from "xlsx";
import { DataService } from "../../services/data.service";
declare let DropSheet: any;
declare let $: any;
declare let require: any;

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
  @ViewChild("excelEl") excelEl: ElementRef;
  
  constructor(
    private fb: FormBuilder, 
    private cd: ChangeDetectorRef,
    public dataService: DataService,
    public http: Http,
    ) {

  }

  ngOnInit() {
    this.downloadExcel("http://localhost:4200/data/samples/products-plastics-nested/data.xlsx");
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
    try {
      wb = XLSX.read(data, readtype);
      this.workbook = wb;
      this.sheets = wb.SheetNames;
      this.processExcel(wb, 0);
    } catch (e) { 
      // console.log(e); 
    }
  }

  processExcel(workbook, sheetIndex?) {
    if (!workbook) {
      $("canvas-datagrid").remove();
      this.cd.detectChanges();
      workbook = this.workbook;
      
    }
    const sheet = workbook.SheetNames[sheetIndex || 0];
    const json = this.excelToJson(workbook)[sheet];
    this.cd.markForCheck();
    this.makeWebExcel(workbook, json);
  }

  excelToJson(workbook) {
      const result = {};
      workbook.SheetNames.forEach( (sheetName) => {
        const roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {raw: false, header: 1});
        if (roa.length > 0) { result[sheetName] = roa; }
      });
      return result;
  }

  makeWebExcel(workbook, json) {
      
      const grid = this.excelEl.nativeElement;
      grid.style.display = "block";
      grid.style.height = (window.innerHeight - 200) + "px";
      grid.style.width = (window.innerWidth - 200) + "px";
      
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

}
