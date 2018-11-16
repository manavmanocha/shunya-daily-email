import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserdataService } from '../../services/userdata.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  fail=false;
  user= {
    username: null,
    password: null
  }
  constructor(private _ser:UserdataService, private _router: Router) { }

  ngOnInit() {
  }
  
  login(user):void{
    this.fail=false;
    this._ser.getUser(user).subscribe(
      prog =>{
        if(prog.status){
          //route
          localStorage.uname=prog.username;
          this._router.navigate(['home']);
          
        }
        else{
          this.fail=true;
        }
      }
    );
  }
}
