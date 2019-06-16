import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatBottomSheetConfig, MatDialog, MatDialogRef } from "@angular/material";

@Component({
  selector: 'app-layout-dialog',
  templateUrl: './layout-dialog.component.html',
  styleUrls: ['./layout-dialog.component.scss']
})
export class LayoutDialogComponent {
  
  selectedHeader;
  selectedLayout = "";
  @Output() okClicked = new EventEmitter<any>();


  constructor(
    public dialogRef: MatDialogRef<LayoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  select(layout) {
    this.selectedLayout = layout;
    this.okClicked.emit(layout);
    this.dialogRef.close();
  }

}

export interface DialogData {
  headers: any;
  layout: any;
}
