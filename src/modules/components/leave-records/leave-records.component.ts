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
        this.allUsernames.push({ name: item, selected: false });
      });
    });
  }

  getmyLeaves() {
    this.leaveService.getLeaveRecord(this.name).subscribe(leaves => {
      this.leaveDates = leaves;
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
