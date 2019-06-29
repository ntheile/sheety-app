import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import * as XLSX from "xlsx";

@Injectable({
  providedIn: 'root'
})
export class ExcelService {


  headers;
  rABS = typeof FileReader !== "undefined" && FileReader.prototype && FileReader.prototype.readAsBinaryString;
  workbook;
  sheets;

  constructor(
    public dataService: DataService,
  ){ 

  }

  async downloadExcel(url) {
    const req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "arraybuffer";
    req.onload = async (e) => {
      const data = new Uint8Array(req.response);
      await this.convertExcelBinary(null, data);
    };
    req.send();
  }

  async convertExcelBinary(e?, rawData?) {
    let data;
    let wb;
    let arr;
    let readtype: any = { type: this.rABS ? "binary" : "base64" };
    if (rawData) {
      data = rawData;
      readtype = { type: "array" };
    } else {
      data = e.target.result;
      if (!this.rABS) {
        arr = this.fixdata(data);
        data = btoa(arr);
      }
    }
    await this.saveExcelBlob(data);
    await this.loadExcel(data, readtype);
  }

  async saveExcelBlob(data) {
    // localStorage.setItem("excel", data);
    await this.dataService.putExcel(data);
  }

  async loadExcel(data, readtype?) {
    let wb;
    try {
      wb = XLSX.read(data, readtype);
      this.workbook = wb;
      this.dataService.setWorkbook(this.workbook);
      this.sheets = wb.SheetNames;
      await this.dataService.setSheets(this.sheets);
      this.dataService.setWorkbook(this.workbook);
    } catch (e) {
      console.log(e);
    }
  }

  excelToJson(workbook) {
    const result = {};
    workbook.SheetNames.forEach((sheetName) => {
      const roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false });
      if (roa.length > 0) { result[sheetName] = roa; }
    });
    return result;
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
    for (let i = 0; i <= numSheets; i++) {
      for (let header of Object.keys(json[i])) {
        this.headers.push(header)
      }
    }

    return this.headers;
  }



}
