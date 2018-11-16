import { Component, OnInit } from '@angular/core';
import { UserdataService } from '../services/userdata.service';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css']
})
export class LeaveComponent implements OnInit {

  constructor(private calendar: NgbCalendar,private _user:UserdataService) { }
  

  
  leave_start:NgbDateStruct;
  leave_end:NgbDateStruct;
  ngOnInit() {
    this.leave_start = this.calendar.getToday();
    this.leave_end = this.calendar.getToday();
  }

  
  sendleaves(){
    this._user.sendLeaves(this.leave_start,this.leave_end).subscribe(()=>{
      console.log("Done");
    });
  }
}
