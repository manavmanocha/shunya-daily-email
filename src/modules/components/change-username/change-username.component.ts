import { Component, OnInit } from "@angular/core";
import { MsgModalComponent } from "../msg-modal/msg-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ManageProfileService } from "../../services/manage-profile.service";

@Component({
  selector: "app-change-username",
  templateUrl: "./change-username.component.html",
  styleUrls: ["./change-username.component.css"]
})
export class ChangeUsernameComponent implements OnInit {
  user = {
    username: null,
    password: null,
    newusername: null
  };

  constructor(
    private modalService: NgbModal,
    private _manageProfileService: ManageProfileService
  ) {}

  ngOnInit() {
    this.setusername();
  }

  setusername() {
    this.user.username = localStorage.getItem("uname");
  }

  changeUsername(user, changeUsernameForm): void {
    this._manageProfileService.changeUsername(user).subscribe(prog => {
      const modalRef = this.modalService.open(MsgModalComponent);
      modalRef.componentInstance.title = "Username Update";
      if (prog) {
        localStorage.setItem("uname", user.newusername);
        modalRef.componentInstance.msgText = "Username successfully updated";
        changeUsernameForm.reset();
        this.user.password = null;
        this.user.newusername = null;
      } else {
        modalRef.componentInstance.msgText =
          "Some Error has occured (Maybe password is incorrect). Please try again later";
      }
      this.setusername();
    });
  }
}
