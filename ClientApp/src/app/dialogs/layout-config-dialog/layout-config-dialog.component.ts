import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { DialogData } from '../layout-dialog/layout-dialog.component';
import { MAT_DIALOG_DATA, MatBottomSheetConfig, MatDialog, MatDialogRef } from "@angular/material";

@Component({
  selector: 'app-layout-config-dialog',
  templateUrl: './layout-config-dialog.component.html',
  styleUrls: ['./layout-config-dialog.component.scss']
})
export class LayoutConfigDialogComponent implements OnInit {
  

  selectedHeader;
  @Output() okClicked = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<LayoutConfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { 
    
  }

  ngOnInit(): void {
    console.log('layout =>', this.data.layout)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  select(header) {
    this.okClicked.emit(header);
    this.dialogRef.close();
  }

}
