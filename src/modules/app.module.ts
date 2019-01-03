import { AuthGuard } from './gaurds/auth.guard';
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import {
  MatFormFieldModule,
  MatInputModule,
  MatPaginatorModule,
  MatTableModule,
  MatSortModule
} from "@angular/material";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxLineChartModule } from "./../libs/my-ngx-line-chart";

import { AppComponent } from "./components/main/app.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { ErrorComponent } from "./components/error/error.component";
import { TimeinComponent } from "./components/time-in/time-in.component";
import { ReportComponent } from "./components/report/report.component";
import { ManageLeavesComponent } from "./components/manage-leaves/manage-leaves.component";
import { LoginComponent } from "./components/login/login.component";
import { UserHomeComponent } from "./components/user-home/user-home.component";
import { AdminHomeComponent } from "./components/admin-home/admin-home.component";
import { LeaveService } from "./services/leave.service";
import { ReportService } from "./services/report.service";
import { TimeinService } from "./services/timein.service";
import { ManageLeaveService } from "./services/manage-leave.service";
import { ManageUserService } from "./services/manage-user.service";
import { LoginService } from "./services/login.service";

import { appRoutes } from "./app.router";
import { ApplyLeaveComponent } from "./components/apply-leave/apply-leave.component";
import { LeaveStatusComponent } from "./components/leave-status/leave-status.component";
import { LeaveRecordsComponent } from "./components/leave-records/leave-records.component";
import { ChangePasswordComponent } from "./components/change-password/change-password.component";
import { ChangeUsernameComponent } from "./components/change-username/change-username.component";
import { CreateUserComponent } from "./components/create-user/create-user.component";
import { RemoveUserComponent } from "./components/remove-user/remove-user.component";
import { ReportModalComponent } from "./components/report-modal/report-modal.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { UserComponent } from "./components/user/user.component";
import { AdminComponent } from "./components/admin/admin.component";
import { MsgModalComponent } from "./components/msg-modal/msg-modal.component";
import { ManageProfileService } from "./services/manage-profile.service";
import { ConfirmEqualValidatorDirective } from "./directives/confirm-equal-validator.directive";
import { LoggedGuard } from './gaurds/logged.guard';
@NgModule({
  declarations: [
    AppComponent,
    ConfirmEqualValidatorDirective,
    HeaderComponent,
    LoginComponent,
    TimeinComponent,
    ReportComponent,
    FooterComponent,
    AdminHomeComponent,
    UserHomeComponent,
    ErrorComponent,
    ManageLeavesComponent,
    ApplyLeaveComponent,
    LeaveStatusComponent,
    LeaveRecordsComponent,
    ChangePasswordComponent,
    ChangeUsernameComponent,
    CreateUserComponent,
    RemoveUserComponent,
    ReportModalComponent,
    ForgotPasswordComponent,
    UserComponent,
    AdminComponent,
    MsgModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    NgxLineChartModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    LeaveService,
    ReportService,
    TimeinService,
    ManageLeaveService,
    ManageUserService,
    ManageProfileService,
    LoginService,
    AuthGuard,
    LoggedGuard
  ],
  bootstrap: [AppComponent],
  entryComponents: [ReportModalComponent, MsgModalComponent]
})
export class AppModule {}
