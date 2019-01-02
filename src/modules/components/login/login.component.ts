import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "../../services/login.service";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  loader=false;
  rotate=true;
  fail = false;
  user = {
    email: null,
    password: null
  };
  constructor(
    private _loginser: LoginService,
    private _router: Router
  ) {}

  ngOnInit() {
    this._loginser.checklogged().subscribe(res => {
      if (res) {
        if (localStorage.getItem("AUser")) this._router.navigate(["admin/home"]);
        else {
          this._router.navigate(["user/home"]);
        }
      }
    });
  }

  rotateloader(){
    this.loader= !this.loader;
    return this.loader;
  }

  login(user): void {
    this.fail = false;
    this.loader=true;
    this._loginser.login(user).subscribe(prog => {
      if (prog.status) {
        //route
        localStorage.uname = prog.username;
        if (prog.admin) {
          localStorage.AUser = true;
          this._router.navigate(["admin/home"]);
        } else this._router.navigate(["user/home"]);
        this.loader=false;
      } else {
        this.fail = true;
        this.loader=false;
      }
    });
  }
}
