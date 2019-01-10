import { Component, Input, ViewChild, OnInit, Renderer2, ElementRef  } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatSort, MatPaginator, MatTableDataSource } from "@angular/material";
import { NgxLineChartModule } from "./../../../libs/my-ngx-line-chart";

export interface EntryElement {
  date: string;
  timein: string;
}
@Component({
  selector: "report-modal",
  templateUrl: "./report-modal.component.html",
  styleUrls: ["./report-modal.component.css"]
})
export class ReportModalComponent implements OnInit {
  @Input() title;
  @Input() inputdata: EntryElement[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ["date", "timein"];
  dataSource = new MatTableDataSource();
  myDataSets = [];
  valuesforanalytics = [];
  analytics = {
    usualrange: "00:00 - 00:00",
    lates: 0
  };
  chartStyles = {
    xAxis: {
      labels: {
        color: "#8C8C8E",
        fontSize: 18,
        angle: 20
      }
    }
  };
  showGridLines = "true";
  yScaleMin = 0;
  yScaleMax = 2359;
  constructor(public activeModal: NgbActiveModal,
    private renderer : Renderer2,
    private elRef: ElementRef
  ) {}

  ngOnInit() {
    const modalDialog = this.renderer.parentNode(this.renderer.parentNode(this.elRef.nativeElement));
    console.log(modalDialog);
    setTimeout(()=>{this.renderer.addClass(modalDialog, 'report-dialog');});
    let chartdata = [];
    let ana = [];
    this.inputdata.forEach(function(item, index) {
      let timein = [];
      timein = item.timein.split(new RegExp("s?[: ]s?"));
      if (timein[2] == "PM" && timein[0] < 12) {
        timein[0] = +timein[0] + 12;
      }
      if (timein[2] == "AM" && timein[0] == 12) {
        timein[0] = +timein[0] - 12;
      }
      chartdata.push({
        x: index,
        y: +(timein[0] + timein[1])
      });

      ana.push(+(timein[0] + timein[1]));
    });
    this.valuesforanalytics = ana;
    this.myDataSets = [
      {
        name: "Timein",
        points: chartdata
      }
    ];
    this.tabchange({ nextId: "tabForm" });
  }

  tabchange(event) {
    if (event.nextId == "tabForm") {
      this.dataSource.data = this.inputdata;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.applyFilter("");
      }, 1000);
    }
    if (event.nextId == "analyticForm") {
      this.calculateAnalytics();
    }
  }
  formatXAxisValue(value: number) {
    return this.inputdata[value].date;
  }
  formatYAxisValue(value: number) {
    let timeStr = "" + value;
    let H = timeStr.slice(0, -2);
    let h: any = +H % 12 || 12;
    h = h < 10 ? "0" + h : h;
    let ampm = +H < 12 ? " AM" : " PM";
    let m = timeStr.slice(-2);
    m = +m == 0 && h == 0 ? "0" + m : m;
    let ts = h + ":" + m + ampm;
    return ts;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  print(){
    window.print();
  }

  frequencyArray(arr) {
    console.log("Array");
    console.log(arr);
    let n = arr.length;
    let startHour = Math.trunc(arr[0] / 100);
    let finishHour = Math.trunc(arr[n - 1] / 100) + 1;
    let index = 0;
    let freqArr = [];
    for (let H = startHour; H <= finishHour; H++) {
      freqArr.push(0);
      while (arr[index] < H * 100 + 30) {
        if (index < n) {
          index++;
          freqArr[2 * (H - startHour)] += 1;
        } else break;
      }
      freqArr.push(0);
      while (arr[index] < (H + 1) * 100) {
        if (index < n) {
          index++;
          freqArr[2 * (H - startHour) + 1] += 1;
        } else break;
      }
    }
    return freqArr;
  }
  maxFreq(freqArr) {
    let max = 0;
    let maxindex = 0;
    for (let i = 0; i < freqArr.length - 2; i++) {
      let sum = freqArr[i] + freqArr[i + 1];
      if (sum > max) {
        max = sum;
        maxindex = i;
      }
    }
    return maxindex;
  }

  calculateAnalytics() {
    let count = this.valuesforanalytics.length;
    this.valuesforanalytics.sort((a, b) => a - b);
    let freq = this.frequencyArray(this.valuesforanalytics);
    console.log(freq);
    let maxIndex = this.maxFreq(freq);
    console.log(maxIndex);
    let hourtostart = Math.trunc(this.valuesforanalytics[0] / 100);
    let timetomax;
    let hourtomax = hourtostart + Math.trunc(maxIndex / 2);
    if (maxIndex % 2 != 0) {
      timetomax = hourtomax * 100 + 30;
    }
    if (maxIndex % 2 == 0) {
      timetomax = hourtomax * 100;
    }
    this.analytics.usualrange =
      this.formatYAxisValue(timetomax) +
      "-" +
      this.formatYAxisValue((timetomax + 100) % 2400);
    let foundFirstLate = false,
      latechecker = 0;
    while (!foundFirstLate && latechecker < count) {
      if (this.valuesforanalytics[latechecker] <= 930) {
        latechecker++;
      } else {
        foundFirstLate = true;
      }
    }
    this.analytics.lates = count - latechecker;
  }
}
