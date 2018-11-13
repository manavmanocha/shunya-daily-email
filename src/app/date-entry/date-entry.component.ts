import { Component, OnInit } from "@angular/core";
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { UserdataService } from "../services/userdata.service";

@Component({
  selector: "app-date-entry",
  templateUrl: "./date-entry.component.html",
  styleUrls: ["./date-entry.component.css"]
})
export class DateEntryComponent implements OnInit {
  constructor(private calendar: NgbCalendar,private _user:UserdataService ) {}

  timenow = new Date();
  time = {
    hour: 9,
    minute: 30,
    meridian: " "
  };
  meridian = true;
  leave_start:NgbDateStruct;
  leave_end:NgbDateStruct;
  
  ngOnInit() {
    this.leave_start = this.calendar.getToday();
    this.leave_end = this.calendar.getToday();
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
    this._user.saveTime(this.time);
  }
  sendleaves(){
    this._user.sendLeaves(this.leave_start,this.leave_end);
  }
}
