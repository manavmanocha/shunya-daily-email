import { Component, OnInit } from '@angular/core';
import { ManageProfileService } from '../../services/manage-profile.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MsgModalComponent } from '../msg-modal/msg-modal.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  user = {
    username: null,
    oldpassword: null,
    newpassword:null,
    confirmpassword:null
  };
  constructor(private modalService: NgbModal,private _manageProfileService: ManageProfileService ) { }

  ngOnInit() {
    this.user.username=localStorage.getItem('uname');
  }
  
  changePassword(user,changePasswordForm): void {
    this._manageProfileService.changePassword(user).subscribe(prog => {
      const modalRef = this.modalService.open(MsgModalComponent);
      modalRef.componentInstance.title = "Password Update";
      if (prog) {
        this.user.oldpassword= null;
        this.user.newpassword=null;
        this.user.confirmpassword=null;
        modalRef.componentInstance.msgText = "Password successfully updated";
        changePasswordForm.reset();
      } else {
        modalRef.componentInstance.msgText = "Some Error has occured (Maybe old password is incorrect). Please try again later";
      }
    });
  }
}
