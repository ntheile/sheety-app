import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'appconfig-dialog',
  templateUrl: './appconfig-dialog.component.html',
  styleUrls: ['./appconfig-dialog.component.scss']
})
export class AppConfigDialogComponent {

  name = "";
  selectedLayout = "";
  @Output() okClicked = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<AppConfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppConfigData
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  select(layout) {
    this.selectedLayout = layout;

    if (this.name == "") {
      alert("Please choose a name for your app");
      return;
    };

    this.okClicked.emit({
      layout: layout,
      name: this.name
    });
    this.dialogRef.close();
  }

}

export interface AppConfigData {
  name: string;
  layout: any;
}
