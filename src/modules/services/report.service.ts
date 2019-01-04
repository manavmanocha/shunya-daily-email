import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
  providedIn: "root"
})
export class ReportService {
  constructor(private httpClient: HttpClient) {}
  
  viewUser(view): Observable<Array<{}>> {
    if (view.type == "Monthly") {
      let month= view.month.split(" ");
      view.month=month[0];
      view.year=month[1];
      return this.httpClient.post<Array<{}>>("/api/viewMonthly", {
        view: view
      });
    }
    if (view.type == "Yearly") {
      return this.httpClient.post<Array<{}>>("/api/viewYearly", { view: view });
    }
  }
}
