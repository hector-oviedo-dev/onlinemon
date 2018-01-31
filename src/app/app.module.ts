import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventsModule } from 'angular4-events';

import { FlexLayoutModule } from "@angular/flex-layout";
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';

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


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LeftSideComponent,
    LayoutComponent,
    RightSideComponent,
    FooterComponent,
    DiagramComponent,
    DialogPopup
  ],
  entryComponents: [DialogPopup],
  imports: [
    EventsModule.forRoot(),
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatSidenavModule,
    MatExpansionModule,
    AgGridModule.withComponents([])
  ],
  providers: [ ServicesService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
