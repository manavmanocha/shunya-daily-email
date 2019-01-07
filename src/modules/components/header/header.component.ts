import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";
import { LoginService } from "../../services/login.service";

@Component({
  selector: "header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  constructor(private _loginser: LoginService, private _router: Router) {}

  ngOnInit() {}

  checklogged() {
      if (this._router.url != '/login') {return true;}
      else{return false;}
  }

  logout() {
    this._loginser.logout().subscribe(res => {
      if (res) {
        localStorage.removeItem("uname");
        localStorage.removeItem("AUser")
        this._router.navigate([""]);
      }
    });
  }
}
