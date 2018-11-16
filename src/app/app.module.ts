
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { UserEntryComponent } from './user-entry/user-entry.component';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './admin/home/home.component';

import { UserdataService } from './services/userdata.service';
import { AdminService } from './services/admin.service';
import { TimeinComponent } from './timein/timein.component';
import { LeaveComponent } from './leave/leave.component';

const appRoutes: Routes = [
  { path: "home", component: UserEntryComponent},
  { path: "adminhome", component: HomeComponent},
  { path: "", component: LoginComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    UserEntryComponent,
    NavComponent,
    LoginComponent,
    HomeComponent,
    TimeinComponent,
    LeaveComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    NgbModule,
    HttpClientModule 
  ],
  providers: [UserdataService, AdminService],
  bootstrap: [AppComponent]
})
export class AppModule { }
