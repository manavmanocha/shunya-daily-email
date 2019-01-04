import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
  providedIn: "root"
})
export class LeaveService {
  constructor(private httpClient: HttpClient) {}
  
  sendLeaves(leave_start, leave_end) {
    if(!leave_end){leave_end=leave_start;}
    let leave = {
      Lstart: leave_start,
      Lend: leave_end
    };
    return this.httpClient.post('/api/sendleaves',{leave:leave});
  }

  getLeaveRecord(user): Observable<Array<{}>>{
    return this.httpClient.post<Array<{}>>('/api/getLeaveRecord',{user:user});
  }

  getLeaves(): Observable<Array<{}>>{
    return this.httpClient.get<Array<{}>>('/api/getLeaves');    
  }

  cancelLeaves(type,id): Observable<boolean>{
    let user=localStorage.getItem("uname");
    let cancel={
      name:user,
      type:type,
      id:id
    }
    return this.httpClient.post<boolean>('/api/cancelLeaves',{cancel:cancel});    
  }

}
