import { Component, OnInit } from '@angular/core';
import { UserdataService } from '../services/userdata.service';

@Component({
  selector: 'app-timein',
  templateUrl: './timein.component.html',
  styleUrls: ['./timein.component.css']
})
export class TimeinComponent implements OnInit {
  timenow = new Date();
  time = {
    hour: 9,
    minute: 30,
    meridian: " "
  };
  meridian = true;
  constructor(private _user:UserdataService) { }

  ngOnInit() {
  }
  mer(){
    if (this.time.hour > 12) {
      this.time.meridian="PM";
    }
    else{
      this.time.meridian="AM";
    }
  }

  savetime() {
    this.mer();
    if (this.time.hour > 12) {
      this.time.hour = this.time.hour - 12;
    }
    this._user.saveTime(this.time).subscribe(()=>{
      console.log("Done");
    });
  }
}
