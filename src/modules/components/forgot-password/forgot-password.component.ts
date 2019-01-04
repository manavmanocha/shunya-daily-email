import { Component, OnInit } from '@angular/core';
import { MsgModalComponent } from '../msg-modal/msg-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageProfileService } from '../../services/manage-profile.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  loader=false;
  rotate=true;
  emailid=null;
  constructor(private modalService: NgbModal,private manageProfileService:ManageProfileService) { }

  ngOnInit() {
  }
  
  rotateloader(){
    this.loader= !this.loader;
    return this.loader;
  }
  sendmail() {
    this.loader=true;
    this.manageProfileService.forgotpassword(this.emailid).subscribe((res:any) => {
      const modalRef = this.modalService.open(MsgModalComponent);
      modalRef.componentInstance.title = "Forgot Password";
      if (res.status) {
        modalRef.componentInstance.msgText = "Mail sent";
        this.loader=false;
      } else {
        if (res.hasOwnProperty("errObject")) {
          modalRef.componentInstance.msgText = res.errObject.MESSAGE;
        } else {
          modalRef.componentInstance.msgText =
            "Some Error has occured. Please try again later ";
        }
        this.loader=false;
      }
    });
  }
}
