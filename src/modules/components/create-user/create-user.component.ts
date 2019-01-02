import { ManageUserService } from './../../services/manage-user.service';
import { Component, OnInit } from "@angular/core";
import { MsgModalComponent } from '../msg-modal/msg-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "create-user",
  templateUrl: "./create-user.component.html",
  styleUrls: ["./create-user.component.css"]
})
export class CreateUserComponent implements OnInit {
  user = {
    username: null,
    email: null
  };
  constructor(private modalService: NgbModal,private _manageUserService: ManageUserService) {}

  ngOnInit() {}
  create(user,createForm): void {
    this._manageUserService.createUser(user).subscribe(prog => {
      const modalRef = this.modalService.open(MsgModalComponent);
      modalRef.componentInstance.title = "User Creation";
      if (prog) {
        this.user.username="";
        this.user.email="";
        modalRef.componentInstance.msgText = "User successfully created";
        createForm.reset();
      } else {
        modalRef.componentInstance.msgText = "Some Error has occured (Maybe username and Email exists). Please try again later";
      }
    });
  }
}
