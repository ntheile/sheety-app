import { CdkTableModule } from "@angular/cdk/table";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from '@angular/forms';
import { Ignore } from './../../data/ignore';
import { Ng5SliderModule } from 'ng5-slider';
import { FlexLayoutModule } from '@angular/flex-layout';


import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatTableModule,
    MatToolbarModule,
    MatSliderModule,
    MatChipsModule,
    MatGridListModule,
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
    FlexLayoutModule
];

@NgModule({
    declarations: [],
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
        Ignore
    ]
})
export class SharedModule { }
