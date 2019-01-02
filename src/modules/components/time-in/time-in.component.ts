import { Component, OnInit } from "@angular/core";
import { TimeinService } from "../../services/timein.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MsgModalComponent } from "../msg-modal/msg-modal.component";

@Component({
  selector: "timein",
  templateUrl: "./time-in.component.html",
  styleUrls: ["./time-in.component.css"]
})
export class TimeinComponent implements OnInit {
  loader = false;
  rotate = true;
  timenow = new Date();
  todayentry = null;
  time = {
    hour: 9,
    minute: 30,
    meridian: " "
  };
  meridian = true;
  constructor(
    private modalService: NgbModal,
    private timeService: TimeinService
  ) {}

  ngOnInit() {
    this.getTime();
  }

  getTime() {
    this.timeService.getTime().subscribe((res: any) => {
      if (res.type == "Response" && res.status) {
        this.todayentry = res.time;
      } else {
        if (res.hasOwnProperty("value") && res.value == "Id not found") {
          const modalRef = this.modalService.open(MsgModalComponent);
          modalRef.componentInstance.title = "Time in";
          modalRef.componentInstance.msgText =
            "Sorry, your session is lost. Please re-login in system and try again";
        }
        console.log(res);
      }
    });
  }

  setMeridian() {
    if (this.time.hour >= 12) {
      this.time.meridian = "PM";
    } else {
      this.time.meridian = "AM";
    }
  }

  rotateloader() {
    this.loader = !this.loader;
    return this.loader;
  }
  savetime() {
    this.setMeridian();
    if (this.time.hour > 12) {
      this.time.hour = this.time.hour - 12;
    }
    this.loader = true;
    this.timeService.saveTime(this.time).subscribe((res: any) => {
      const modalRef = this.modalService.open(MsgModalComponent);
      modalRef.componentInstance.title = "Time in";
      if (res.type == "Response" && res.status) {
        this.todayentry =
          this.time.hour + ":" + this.time.minute + " " + this.time.meridian;
        modalRef.componentInstance.msgText = "Saved Successfully";
        this.loader = false;
      } else {
        if (res.hasOwnProperty("value") && res.value == "Id not found") {
          modalRef.componentInstance.msgText =
            "Sorry, your session is lost. Please re-login in system and try again";
        } else {
          modalRef.componentInstance.msgText =
            "Some Error has occured. Please try again later ";
        }
        this.loader = false;
        console.log(res);
      }
    });
  }
}
