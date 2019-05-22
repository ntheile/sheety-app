import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { FormBuilder, Validators } from '@angular/forms';
import * as canvasDatagrid from 'canvas-datagrid';
import { DataService } from '../../services/data.service';
import { $$ } from 'protractor';
import { Http } from '@angular/http';
declare let DropSheet: any;
declare let $: any;
declare let require: any;

@Component({
  selector: 'app-etl',
  templateUrl: './etl.component.html',
  styleUrls: ['./etl.component.scss']
})
export class ETLComponent implements OnInit {

  formGroup = this.fb.group({
    file: [null, Validators.required]
  });
  rABS = typeof FileReader !== 'undefined' && FileReader.prototype && FileReader.prototype.readAsBinaryString;
  sheets;  
  workbook;
  json;
  currentSheetJson;
  @ViewChild('excelEl') excelEl: ElementRef;
  
  constructor(
    private fb: FormBuilder, 
    private cd: ChangeDetectorRef,
    public dataService: DataService,
    public http: Http
    ) {

  }

  ngOnInit() {
    // this.downloadExcel('http://localhost:4200/data/samples/products-plastics-nested/data.xlsx');
  } 

  async downloadExcel(url){
    let data:any = await this.http.get(url).toPromise();    
    this.convertExcelBinary(null, data._body);
    let a = 1;
  }

  /// https://gist.github.com/amcdnl/bebcab2e962076558fb4a5f05b96a7e4#file-end-ts 
  onFileChange(e: any) {
    let files:any = e.target.files;
    let i,f;
    for (i = 0, f = files[i]; i != files.length; ++i) {
      let reader = new FileReader();
      let name = f.name;
      reader.onload = (e:any) => {
        this.convertExcelBinary(e);
      };
      if(this.rABS) reader.readAsBinaryString(f);
      else reader.readAsArrayBuffer(f);
    }
  }

  convertExcelBinary(e?, rawData?){
    let data;
    if (rawData){
      data = rawData;
    } else{
      data = e.target.result;
    }
    let wb, arr;
    let readtype:any = {type: this.rABS ? 'binary' : 'base64' };
    if(!this.rABS) {
      arr = this.fixdata(data);
      data = btoa(arr);
    }
    try {
      wb = XLSX.read(data, readtype);
      this.workbook = wb;
      this.sheets = wb.SheetNames;
      this.processExcel(wb, 0);
    } catch(e) { 
      console.log(e); 
    }
  }

  processExcel(workbook, sheetIndex?){
    if (!workbook){
      $('canvas-datagrid').remove();
      this.cd.detectChanges();
      workbook = this.workbook;
      
    }
    let sheet = workbook.SheetNames[sheetIndex||0];
    let json = this.excelToJson(workbook)[sheet];
    this.cd.markForCheck();
    this.makeWebExcel(workbook, json);
  }

  excelToJson(workbook){
      let result = {};
      workbook.SheetNames.forEach( (sheetName) => {
        let roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {raw:false, header:1});
        if(roa.length > 0) result[sheetName] = roa;
      });
      return result;
  }

  makeWebExcel(workbook, json){
      
      let grid = this.excelEl.nativeElement;
      grid.style.display = "block";
      grid.style.height = (window.innerHeight - 200) + "px";
      grid.style.width = (window.innerWidth - 200) + "px";
      
      let cdg = canvasDatagrid({
        parentNode: grid
      });
      cdg.style.height = '100%';
      cdg.style.width = '100%';
      cdg.data = json;
     
  }

  fixdata(data) {
    let o = "", l = 0, w = 10240;
    for(; l<data.byteLength/w; ++l)
      o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
    o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(o.length)));
    return o;
  }


 



}
