import { CdkTableModule } from "@angular/cdk/table";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { Ng5SliderModule } from "ng5-slider";
import { LayoutDialogComponent } from "../dialogs/layout-dialog/layout-dialog.component";
import { LayoutConfigDialogComponent } from "../dialogs/layout-config-dialog/layout-config-dialog.component";


import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTableModule,
    MatToolbarModule,
} from "@angular/material";



const MATERIALCOMPONENTS = [
    CdkTableModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatSliderModule,
    Ng5SliderModule,
    MatChipsModule,
    MatGridListModule,
    FlexLayoutModule,
    MatDialogModule,
    MatSelectModule,
];

@NgModule({
    declarations: [
        LayoutDialogComponent,
        LayoutConfigDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MATERIALCOMPONENTS,
    ],
    exports: [
        CommonModule,
        FormsModule,
        MATERIALCOMPONENTS,
    ],
    providers: [

    ],
    entryComponents: [
        LayoutDialogComponent,
        LayoutConfigDialogComponent
    ],
})
export class SharedModule { }
