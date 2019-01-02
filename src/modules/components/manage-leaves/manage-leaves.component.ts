import { Component, OnInit } from "@angular/core";
import { ManageLeaveService } from "../../services/manage-leave.service";
import { MsgModalComponent } from "../msg-modal/msg-modal.component";
import { NgbModal, NgbPanelChangeEvent } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "manage-leaves",
  templateUrl: "./manage-leaves.component.html",
  styleUrls: ["./manage-leaves.component.css"]
})
export class ManageLeavesComponent implements OnInit {
  pending_leaves = [];
  approved_leaves = [];
  constructor(
    private manageLeaveService: ManageLeaveService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {}

  public beforeChange($event: NgbPanelChangeEvent) {
    if ($event.panelId === "applied") {
      this.getPendingLeaves();
    }
    if ($event.panelId === "approved") {
      this.getApprovedLeaves();
    }
  }

  getPendingLeaves() {
    this.pending_leaves = [];
    this.manageLeaveService.getPendingLeaves().subscribe(res => {
      res.forEach((item: any) => {
        Object.entries(item.dates).forEach(([key, value]) => {
          let leaveitem = { id: "", name: "", dates: {} };
          leaveitem.id = key;
          leaveitem.name = item.name;
          leaveitem.dates = value;
          this.pending_leaves.push(leaveitem);
        });
      });
    });
  }

  getApprovedLeaves() {
    this.approved_leaves = [];
    this.manageLeaveService.getApprovedLeaves().subscribe(res => {
      res.forEach((item: any) => {
        Object.entries(item.dates).forEach(([key, value]) => {
          let leaveitem = { id: "", name: "", dates: {} };
          leaveitem.id = key;
          leaveitem.name = item.name;
          leaveitem.dates = value;
          this.approved_leaves.push(leaveitem);
        });
      });
    });
  }

  approveTheLeave(leave_app) {
    this.manageLeaveService.approveTheLeave(leave_app).subscribe(res => {
      const modalRef = this.modalService.open(MsgModalComponent);
      modalRef.componentInstance.title = "Leave Management";
      if (res) {
        this.getPendingLeaves();
        modalRef.componentInstance.msgText = "Approved Successfully";
      } else {
        modalRef.componentInstance.msgText =
          "Some Error has occured. Please try again later";
      }
    });
  }

  unapproveTheLeave(leave_app) {
    this.manageLeaveService.unapproveTheLeave(leave_app).subscribe(res => {
      const modalRef = this.modalService.open(MsgModalComponent);
      modalRef.componentInstance.title = "Leave Management";
      if (res) {
        this.getApprovedLeaves();
        modalRef.componentInstance.msgText = "Unapproved Successfully";
      } else {
        modalRef.componentInstance.msgText =
          "Some Error has occured. Please try again later";
      }
    });
  }

  rejectTheLeave(leave_app) {
    this.manageLeaveService.rejectTheLeave(leave_app).subscribe(res => {
      const modalRef = this.modalService.open(MsgModalComponent);
      modalRef.componentInstance.title = "Leave Management";
      if (res) {
        this.getPendingLeaves();
        modalRef.componentInstance.msgText = "Rejected Successfully";
      } else {
        modalRef.componentInstance.msgText =
          "Some Error has occured. Please try again later";
      }
    });
  }
}
