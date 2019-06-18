import { Component, OnInit } from '@angular/core';
import { Store, Select, Selector } from '@ngxs/store';
import { AddExcel, RemoveExcel } from '../../actions/excel.actions';
import { ExcelState } from '../../state/excel.state';
import { Observable } from 'rxjs/Observable';
import { Excel } from '../../models/excel.model';

// https://coursetro.com/posts/code/152/Angular-NGXS-Tutorial---An-Alternative-to-Ngrx-for-State-Management
@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  // excelFiles$: Observable<Excel>
  @Select(ExcelState.getExcelFiles) excelFiles$: Observable<Excel>

  constructor(
    private store: Store,
  ) { 
    // this.excelFiles$ = this.store.select(state => state.excelFiles.excelFiles )
  }

  ngOnInit() {
    this.addExcel('excel.xls', '{json: data}', 'rawBinary', 'sheets');
  }

  addExcel(name, json, raw, sheets){
    this.store.dispatch( new AddExcel({name: name, rawData: raw, rawJSON: json, sheets: sheets}));
  }

  readExcel(){

  }

}
