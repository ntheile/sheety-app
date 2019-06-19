import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Store, Select, Selector } from '@ngxs/store';
import { AddExcel, RemoveExcel, UpdateExcel } from '../../actions/excel.actions';
import { ExcelState } from '../../state/excel.state';
import { Observable } from 'rxjs/Observable';
import { Excel } from '../../models/excel.model';
import { UtilsService } from '../../services/utils.service';
import html2canvas from 'html2canvas';
declare let window: any;

// https://coursetro.com/posts/code/152/Angular-NGXS-Tutorial---An-Alternative-to-Ngrx-for-State-Management
@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  // excelFiles$: Observable<Excel>
  @Select(ExcelState.getExcelFiles) excelFiles$: Observable<Excel>;

  @ViewChild('thumbsCanvasEL') thumbsCanvasEL: ElementRef;
  

  currentExcel: Excel;

  constructor(
    private store: Store,
    private utils: UtilsService,
    private cd: ChangeDetectorRef
  ) { 
    // this.excelFiles$ = this.store.select(state => state.excelFiles.excelFiles )
  }

  ngOnInit() {
    this.addExcel('excel.xls', '{json: data}', 'rawBinary', 'sheets');
  }

  async addExcel(name, json, raw, sheets){
    this.currentExcel = { 
      name: name, 
      rawData: raw, 
      rawJSON: json, 
      sheets: sheets, 
      id: this.utils.genGuid(),
      thumbnail: null
    };
    this.store.dispatch( new AddExcel(this.currentExcel));
  }

  readExcel(){

  }

  async genThumbnail(){
    let canvas = await html2canvas(document.body);
    let thumbnail = canvas.toDataURL();
    this.currentExcel.thumbnail = thumbnail;
    this.store.dispatch( new UpdateExcel({ excel: this.currentExcel }));
    return thumbnail;
  }

  async saveThumbnail(){
    let thumbnail =  await this.genThumbnail();
    this.showThumnail(thumbnail, this.thumbsCanvasEL.nativeElement)
  }

  showThumnail(strDataURI, canvas){
    // "use strict";
    var img = new window.Image();
    img.addEventListener("load", function () {
        canvas.getContext("2d").drawImage(img, 0, 0);
    });
    img.setAttribute("src", strDataURI);
  }


}
