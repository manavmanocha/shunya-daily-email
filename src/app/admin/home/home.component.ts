import { Component, OnInit } from "@angular/core";
import { AdminService } from "../../services/admin.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  cfail = false;
  csuccess = false;
  rfail = false;
  rsuccess = false;
  activenav = "createUser";
  removeResultString="";
  user = {
    username: null,
    email: null
  };
  allUsernames = [];
  constructor(private _adminser: AdminService) {}

  ngOnInit() {
    this.printnames();
  }

  printnames(){
    this.allUsernames = [];
    this._adminser.getUsernames().subscribe(res => {
      res.forEach((item) => {
        this.allUsernames.push({ name: item, selected: false });
      });
      console.log(this.allUsernames);
    });
  }


  create(user): void {
    this.cfail = false;
    this.csuccess = false;
    this._adminser.createUser(user).subscribe(prog => {
      if (prog) {
        this.csuccess = true;
        this.printnames();
      } else {
        this.cfail = true;
      }
    });
    
  }

  remove(): void {
    this.rfail = false;
    this._adminser.removeUsers(this.allUsernames.filter(user => user.selected == true))
    .subscribe(result => {
      result.forEach((item) => {
        this.removeResultString+=""+Object.keys(item)+" is "+(Object.values(item)?"":"not ")+"removed<br>";
      });
       this.printnames();
       this.rsuccess=true;     
     });
  }

}
