import { Component, OnInit } from "@angular/core";
import { ManageProfileService } from "../../services/manage-profile.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MsgModalComponent } from "../msg-modal/msg-modal.component";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"]
})
export class ChangePasswordComponent implements OnInit {
  loader = false;
  rotate = true;
  user = {
    username: null,
    oldpassword: null,
    newpassword: null,
    confirmpassword: null
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
  rotateloader() {
    this.loader = !this.loader;
    return this.loader;
  }
  changePassword(user, changePasswordForm): void {
    this.loader = true;
    this._manageProfileService.changePassword(user).subscribe((res: any) => {
      const modalRef = this.modalService.open(MsgModalComponent);
      modalRef.componentInstance.title = "Password Update";
      if (res.status) {
        this.user.oldpassword = null;
        this.user.newpassword = null;
        this.user.confirmpassword = null;
        modalRef.componentInstance.msgText = "Password successfully updated";
        this.loader = false;
        changePasswordForm.reset();
        setTimeout(() => {
          this.setusername();
        });
      } else {
        if (res.hasOwnProperty("errObject")) {
          modalRef.componentInstance.msgText = res.errObject.MESSAGE;
        } else {
          modalRef.componentInstance.msgText =
            "Some Error has occured. Please try again later ";
        }
        this.loader = false;
      }
    });
  }
}
