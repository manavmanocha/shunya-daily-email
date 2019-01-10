import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
  providedIn: "root"
})
export class ReportService {
  constructor(private httpClient: HttpClient) {}
  
  viewUser(view): Observable<Array<{}>> {
    let viewobj=Object.assign({}, view);
    if (viewobj.type == "Monthly") {
      let month= viewobj.month.split(" ");
      viewobj.month=month[0];
      viewobj.year=month[1];
      return this.httpClient.post<Array<{}>>("/api/viewMonthly", {
        view: viewobj
      });
    }
    if (viewobj.type == "Yearly") {
      return this.httpClient.post<Array<{}>>("/api/viewYearly", { view: viewobj });
    }
  }
}
