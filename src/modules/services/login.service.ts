import { Observable } from "rxjs/internal/Observable";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class LoginService {
  constructor(private httpClient: HttpClient) {}

  login(user): Observable<{status:boolean,_id: String, username: String, admin:boolean}>{
    return this.httpClient.post<{ status:boolean,_id: String, username: String, admin:boolean}>('/api/login',user);    
  }
  checklogged(): Observable<boolean>{
    return this.httpClient.get<boolean>('/api/checklogged');    
  }

  logout(): Observable<boolean>{
    return this.httpClient.get<boolean>('/api/logout');    
  }
}