import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
  providedIn: "root"
})
export class TimeinService {
  constructor(private httpClient: HttpClient) {}
  
  saveTime(time) {
    let t:string;
    if (time.minute <10) {
      t= time.hour + ":0" + time.minute + " " + time.meridian;
    }
    else{
      t = time.hour + ":" + time.minute + " " + time.meridian;
    }
    return this.httpClient.post('/api/timein',{time:t});
  }

  getTime(): Observable<{}>{
    return this.httpClient.get<{}>('/api/getTime');
  }
}
