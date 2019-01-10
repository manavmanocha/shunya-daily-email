import { Component, OnInit } from "@angular/core";
import { LeaveService } from "../../services/leave.service";
import { MsgModalComponent } from "../msg-modal/msg-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "leave-status",
  templateUrl: "./leave-status.component.html",
  styleUrls: ["./leave-status.component.css"]
})
export class LeaveStatusComponent implements OnInit {
  unavailableDates = [];

  constructor(
    private modalService: NgbModal,
    private leaveService: LeaveService
  ) {}

  ngOnInit() {
    this.getmyLeaves();
  }

  getmyLeaves() {
    this.unavailableDates = [];
    this.leaveService.getLeaves().subscribe((response: any) => {
      if (response.status) {
        this.unavailableDates;
        response.leaves.forEach((item: any) => {
          new Date() < new Date(item.Lend.year, item.Lend.month, item.Lend.day)
            ? this.unavailableDates.push(item)
            : "";
        });
      } else {
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
  cancelMyLeave(leave_app: any) {
    this.leaveService
      .cancelLeaves(leave_app.type, leave_app.id)
      .subscribe((res: any) => {
        const modalRef = this.modalService.open(MsgModalComponent);
        modalRef.componentInstance.title = "Leave Application";
        if (res.status) {
          modalRef.componentInstance.msgText = "Cancelled Successfully";
          this.getmyLeaves();
        } else {
          if (res.hasOwnProperty("errObject")) {
            modalRef.componentInstance.msgText = res.errObject.MESSAGE;
          } else {
            modalRef.componentInstance.msgText =
              "Some Error has occured. Please try again later ";
          }
        }
      });
  }
}
