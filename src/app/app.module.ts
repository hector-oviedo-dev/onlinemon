import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, FormGroup, FormControl,ReactiveFormsModule } from '@angular/forms';
import { EventsModule } from 'angular4-events';
import { HttpClientModule } from '@angular/common/http';

import { FlexLayoutModule } from "@angular/flex-layout";
import {
  MatDividerModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';

import { AgGridModule } from "ag-grid-angular/main";

import { ServicesService } from './services.service';

import { AppComponent } from './app.component';

import { HeaderComponent } from './header/header.component';
import { LeftSideComponent } from './left-side/left-side.component';
import { LayoutComponent } from './layout/layout.component';
import { RightSideComponent } from './right-side/right-side.component';
import { FooterComponent } from './footer/footer.component';
import { DiagramComponent } from './diagram/diagram.component';

import { DialogPopup } from './app.component';
import { AutoCheckComponent } from './auto-check/auto-check.component';
import { AutoChecklistComponent } from './auto-checklist/auto-checklist.component';
import { AutoDateComponent } from './auto-date/auto-date.component';
import { AutoFormComponent } from './auto-form/auto-form.component';
import { AutoGridComponent } from './auto-grid/auto-grid.component';
import { AutoInputComponent } from './auto-input/auto-input.component';
import { AutoRadioComponent } from './auto-radio/auto-radio.component';
import { AutoSelectComponent } from './auto-select/auto-select.component';
import { AutoTextareaComponent } from './auto-textarea/auto-textarea.component';
import { ContainerComponent } from './container/container.component';
import { DynamicComponent } from './dynamic/dynamic.component';
import { ErrorComponent } from './error/error.component';
import { DetailComponent } from './detail/detail.component';
import { DetailContainerComponent } from './detail-container/detail-container.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LeftSideComponent,
    LayoutComponent,
    RightSideComponent,
    FooterComponent,
    DiagramComponent,
    DialogPopup,
    AutoCheckComponent,
    AutoChecklistComponent,
    AutoDateComponent,
    AutoFormComponent,
    AutoGridComponent,
    AutoInputComponent,
    AutoRadioComponent,
    AutoSelectComponent,
    AutoTextareaComponent,
    ContainerComponent,
    DynamicComponent,
    ErrorComponent,
    DetailComponent,
    DetailContainerComponent
  ],
  entryComponents: [
    DialogPopup,
    AutoCheckComponent,
    AutoChecklistComponent,
    AutoDateComponent,
    AutoFormComponent,
    AutoGridComponent,
    AutoInputComponent,
    AutoRadioComponent,
    AutoSelectComponent,
    AutoTextareaComponent,
    ContainerComponent,
    DynamicComponent,
    DetailComponent,
    DetailContainerComponent
  ],
  imports: [
    HttpClientModule,
    EventsModule.forRoot(),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,

    MatDividerModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,

    AgGridModule.withComponents([])
  ],
  providers: [
     ServicesService,
     { provide: MAT_DIALOG_DATA, useValue: {} },
     { provide: MatDialogRef, useValue: {} }
    ],
  bootstrap: [AppComponent]
})

export class AppModule { }
