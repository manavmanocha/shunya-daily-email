import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { DateEntryComponent } from './date-entry/date-entry.component';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './auth/login/login.component';

import { UserdataService } from './services/userdata.service';

const appRoutes: Routes = [
  { path: "home", component: DateEntryComponent},
  { path: "", component: LoginComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    DateEntryComponent,
    NavComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    NgbModule,
    HttpClientModule 
  ],
  providers: [UserdataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
