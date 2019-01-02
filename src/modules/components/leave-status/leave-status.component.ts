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
    this.leaveService.getLeaves().subscribe(leaves => {
      this.unavailableDates = leaves;
    });
  }
  cancelMyLeave(leave_app: any) {
    this.leaveService
      .cancelLeaves(leave_app.type, leave_app.id)
      .subscribe(res => {
        const modalRef = this.modalService.open(MsgModalComponent);
        modalRef.componentInstance.title = "Leave Application";
        if (res) {
          modalRef.componentInstance.msgText = "Cancelled Successfully";
          this.getmyLeaves();
        } else {
          modalRef.componentInstance.msgText = "Some Error has occured";
        }
      });
  }
}
