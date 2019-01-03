import { Component, OnInit } from "@angular/core";
import { LeaveService } from "../../services/leave.service";
import {
  NgbDate,
  NgbDateStruct,
  NgbCalendar,
  NgbDateParserFormatter,
  NgbModal
} from "@ng-bootstrap/ng-bootstrap";
import { ManageUserService } from "../../services/manage-user.service";
import { MsgModalComponent } from "../msg-modal/msg-modal.component";

@Component({
  selector: "app-leave-records",
  templateUrl: "./leave-records.component.html",
  styleUrls: ["./leave-records.component.css"]
})
export class LeaveRecordsComponent implements OnInit {
  name=null;
  leaveDates = [];
  allUsernames = [];
  constructor(
    private modalService: NgbModal,
    private manageUserService: ManageUserService,
    private formatter: NgbDateParserFormatter,
    private calendar: NgbCalendar,
    private leaveService: LeaveService
  ) {}

  ngOnInit() {
    this.printnames();
    this.getmyLeaves();
  }

  printnames() {
    this.allUsernames = [];
    this.manageUserService.getUsernames().subscribe(res => {
      res.forEach(item => {
        this.allUsernames.push(item);
      }); 
      if(this.allUsernames.length > 0) {
        this.name = this.allUsernames[0];
      } 
    });
  }

  getmyLeaves() {
    this.leaveService.getLeaveRecord(this.name).subscribe((response:any) => {
      if(response.status)
      this.leaveDates = response.leaves;
      else{
        const modalRef = this.modalService.open(MsgModalComponent);
        modalRef.componentInstance.title = "Leave Application";
        if (response.hasOwnProperty("errObject")) {
          modalRef.componentInstance.msgText = response.errObject.MESSAGE;
        } else {
          modalRef.componentInstance.msgText =
            "Some Error has occured. Please try again later ";
        }
      }
    });
  }

  isMarked(date: NgbDate) {
    let marked = false;
    this.leaveDates.forEach(undate => {
      marked =
        marked ||
        date.equals(undate.Lstart) ||
        date.equals(undate.Lend) ||
        (date.after(undate.Lstart) && date.before(undate.Lend));
    });
    return marked;
  }

  isDisabled(date: NgbDate) {
    return date.after(this.calendar.getToday());
  }
}
