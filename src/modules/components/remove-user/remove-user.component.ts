import { ManageUserService } from "./../../services/manage-user.service";
import { Component, OnInit } from "@angular/core";
import { MsgModalComponent } from "../msg-modal/msg-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "remove-user",
  templateUrl: "./remove-user.component.html",
  styleUrls: ["./remove-user.component.css"]
})
export class RemoveUserComponent implements OnInit {
  removeResultString = "";
  allUsernames = [];

  constructor(private modalService: NgbModal,private managaeUserService: ManageUserService) {}

  ngOnInit() {
    this.printnames();
  }

  printnames() {
    this.allUsernames = [];
    this.managaeUserService.getUsernames().subscribe(res => {
      res.forEach(item => {
        this.allUsernames.push({ name: item, selected: false });
      });
    });
  }
  checkboxSelected(i) {
    this.allUsernames[i].selected = !this.allUsernames[i].selected;
  }

  remove(): void {
    this.removeResultString = "";
    this.managaeUserService
      .removeUsers(this.allUsernames.filter(user => user.selected == true))
      .subscribe(result => {
        result.forEach(item => {
          this.removeResultString +=
            "" +
            Object.keys(item) +
            " is " +
            (Object.values(item) ? "" : "not ") +
            "removed.<br>";
        });
        const modalRef = this.modalService.open(MsgModalComponent);
        modalRef.componentInstance.title = "User Removal";
      if (result) {
        modalRef.componentInstance.msgText = this.removeResultString;
        this.printnames();
      } else {
        modalRef.componentInstance.msgText = "Some Error has occured. Please try again later";
      }
      });
  }
}
