import { Component, OnInit } from "@angular/core";
import { LeaveService } from "../../services/leave.service";
import {
  NgbDate,
  NgbDateStruct,
  NgbCalendar,
  NgbDateParserFormatter,
  NgbModal
} from "@ng-bootstrap/ng-bootstrap";
import { MsgModalComponent } from "../msg-modal/msg-modal.component";

@Component({
  selector: "apply-leave",
  templateUrl: "./apply-leave.component.html",
  styleUrls: ["./apply-leave.component.css"]
})
export class ApplyLeaveComponent implements OnInit {
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  unavailableDates = [];

  constructor(
    private modalService: NgbModal,
    private formatter: NgbDateParserFormatter,
    private calendar: NgbCalendar,
    private leaveService: LeaveService
  ) {}

  ngOnInit() {
    this.getmyLeaves();
  }

  getmyLeaves() {
    this.leaveService.getLeaves().subscribe(leaves => {
      this.unavailableDates = leaves;
      console.log(leaves);
      //add validation today disable then select next
      this.fromDate = this.calendar.getToday();
      this.toDate = this.calendar.getToday();
    });
  }

  onDateSelection(date: NgbDate) {
    if (!this.isDisabled(date)) {
      if (!this.fromDate && !this.toDate) {
        this.fromDate = date;
      } else if (
        this.fromDate &&
        !this.toDate &&
        date.after(this.fromDate) &&
        !this.rangeisDisabled(date)
      ) {
        this.toDate = date;
      } else {
        this.toDate = null;
        this.fromDate = date;
      }
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate) &&
      !this.rangeisDisabled(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      date.equals(this.toDate) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  rangeisDisabled(todate: NgbDate) {
    let disabled = false;
    let date = this.fromDate;
    while (!date.equals(todate)) {
      date = this.calendar.getNext(date, "d", 1);
      this.unavailableDates.forEach(undate => {
        disabled =
          disabled ||
          date.equals(undate.Lstart) ||
          date.equals(undate.Lend) ||
          (date.after(undate.Lstart) && date.before(undate.Lend));
      });
      if (disabled) {
        return disabled;
      }
    }
  }

  isDisabled(date: NgbDate) {
    let disabled = false;
    this.unavailableDates.forEach(undate => {
      disabled =
        disabled ||
        date.equals(undate.Lstart) ||
        date.equals(undate.Lend) ||
        (date.after(undate.Lstart) && date.before(undate.Lend));
    });
    return disabled || date.before(this.calendar.getToday());
  }
  
  sendleaves() {
    this.leaveService.sendLeaves(this.fromDate, this.toDate).subscribe((res) => {
      const modalRef = this.modalService.open(MsgModalComponent);
      modalRef.componentInstance.title = "Leave Application";
      if (res) {
        modalRef.componentInstance.msgText = "Applied Successfully";
      } else {
        modalRef.componentInstance.msgText = "Some Error has occured";
      }
      this.getmyLeaves();
    });
  }
}
