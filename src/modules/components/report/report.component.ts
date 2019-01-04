import { ManageUserService } from "./../../services/manage-user.service";
import { ReportService } from "./../../services/report.service";
import { Component, OnInit } from "@angular/core";
import { NgbModal, NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { ReportModalComponent } from "../report-modal/report-modal.component";

@Component({
  selector: "report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.css"]
})
export class ReportComponent implements OnInit {
  view = {
    user: null,
    type: null,
    month: null,
    year: null
  };
  allUsernames = [];
  viewoption = ["Monthly", "Yearly"];
  allmonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  years = [];
  months = [];
  constructor(
    private modalService: NgbModal,
    private parser: NgbDateParserFormatter,
    private manageUserService: ManageUserService,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.printnames();
    let currentYear = new Date().getFullYear();
    let Year = 2018;
    while (Year <= currentYear) {
      this.years.push(Year);
      Year++;
    }
    let Month = new Date().getMonth();
    let i = 0;
    let yearSuffix = currentYear;
    while (i < 12) {
      this.months.push(this.allmonths[Month] + " " + yearSuffix);
      Month--;
      if (Month < 0) {
        Month = 11;
        yearSuffix--;
        if (yearSuffix < 2017) {
          break;
        }
      }
      i++;
    }
  }
  printnames() {
    this.allUsernames = [];
    this.manageUserService.getUsernames().subscribe(res => {
      res.forEach(item => {
        this.allUsernames.push({ name: item, selected: false });
      });
      if(this.allUsernames.length > 0) {
        this.view.user = this.allUsernames[0];
      } 
        
    });
  }
  viewReport(): void {
    this.reportService.viewUser(this.view).subscribe(res => {
      const modalRef = this.modalService.open(ReportModalComponent);
      modalRef.componentInstance.title = this.view.type + " Report";
      modalRef.componentInstance.inputdata = res;
      console.log(res);
    });
  }
}
