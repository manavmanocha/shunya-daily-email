import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
  providedIn: "root"
})
export class UserdataService {
  constructor(private httpClient: HttpClient) {}

  getUser(user): Observable<{status:boolean,_id: String, username: String}>{
    return this.httpClient.post<{ status:boolean,_id: String, username: String}>('/api/getlogin',user);    
  }
  
  saveTime(time) {
    let t = time.hour + ":" + time.minute + " " + time.meridian;
    console.log("Time in");
    console.log(t);
    return this.httpClient.post('/api/timein',{time:t});
  }
  sendLeaves(leave_start, leave_end) {
    let leave = {
      Lstart: leave_start.day + "-" + leave_start.month + "-" + leave_start.year,
      Lend: leave_end.day + "-" + leave_end.month + "-" + leave_end.year
    };
    console.log("Leave:");
    console.log(leave);
    return this.httpClient.post('/api/sendleaves',{leave:leave});
  }
}
