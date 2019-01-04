import { Observable } from "rxjs/internal/Observable";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ManageLeaveService {
  constructor(private httpClient: HttpClient) {}

  getPendingLeaves(): Observable<Array<{}>> {
    return this.httpClient.get<Array<{}>>("/api/pendingLeaves");
  }

  getApprovedLeaves(): Observable<Array<{}>> {
    return this.httpClient.get<Array<{}>>("/api/approvedLeaves");
  }

  approveTheLeave(leave_app): Observable<boolean> {
    return this.httpClient.post<boolean>("/api/approveTheLeave", {
      leave: leave_app
    });
  }

  unapproveTheLeave(leave_app): Observable<boolean> {
    return this.httpClient.post<boolean>("/api/unapproveTheLeave", {
      leave: leave_app
    });
  }

  rejectTheLeave(leave_app): Observable<boolean> {
    return this.httpClient.post<boolean>("/api/rejectTheLeave", {
      leave: leave_app
    });
  }
}
