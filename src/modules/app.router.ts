import { AuthGuard } from './gaurds/auth.guard';
import { CreateUserComponent } from "./components/create-user/create-user.component";
import { LoginComponent } from "./components/login/login.component";
import { Routes } from "@angular/router";
import { ErrorComponent } from "./components/error/error.component";
import { AdminHomeComponent } from "./components/admin-home/admin-home.component";
import { UserHomeComponent } from "./components/user-home/user-home.component";
import { TimeinComponent } from "./components/time-in/time-in.component";
import { ManageLeavesComponent } from "./components/manage-leaves/manage-leaves.component";
import { ReportComponent } from "./components/report/report.component";
import { ApplyLeaveComponent } from "./components/apply-leave/apply-leave.component";
import { LeaveStatusComponent } from "./components/leave-status/leave-status.component";
import { LeaveRecordsComponent } from "./components/leave-records/leave-records.component";
import { ChangePasswordComponent } from "./components/change-password/change-password.component";
import { ChangeUsernameComponent } from "./components/change-username/change-username.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { RemoveUserComponent } from "./components/remove-user/remove-user.component";
import { AdminComponent } from "./components/admin/admin.component";
import { UserComponent } from "./components/user/user.component";
import { LoggedGuard } from './gaurds/logged.guard';

export const appRoutes: Routes = [
  {
    path: "error",
    component: ErrorComponent
  },
  {
    path: "",
     redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: "login",
    component: LoginComponent,canActivate: [ LoggedGuard ] 
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent
  },
  {
    path: "user",
    component: UserComponent, canActivate: [ AuthGuard ] ,
    children: [
      { path: "home", component: UserHomeComponent },
      { path: "time-in", component: TimeinComponent },
      { path: "report", component: ReportComponent },
      { path: "apply-leave", component: ApplyLeaveComponent },
      { path: "status-leave", component: LeaveStatusComponent },
      { path: "record-leave", component: LeaveRecordsComponent },
      { path: "profile/passsword", component: ChangePasswordComponent },
      { path: "profile/username", component: ChangeUsernameComponent }
    ]
  },
  {
    path: "admin",
    component: AdminComponent, canActivate: [ AuthGuard ] ,
    children: [
      { path: "home", component: AdminHomeComponent },
      { path: "manage-leaves", component: ManageLeavesComponent },
      { path: "create-user", component: CreateUserComponent },
      { path: "remove-user", component: RemoveUserComponent },
      { path: "time-in", component: TimeinComponent },
      { path: "report", component: ReportComponent },
      { path: "apply-leave", component: ApplyLeaveComponent },
      { path: "status-leave", component: LeaveStatusComponent },
      { path: "record-leave", component: LeaveRecordsComponent },
      { path: "profile/passsword", component: ChangePasswordComponent },
      { path: "profile/username", component: ChangeUsernameComponent }
    ]
  }
];
