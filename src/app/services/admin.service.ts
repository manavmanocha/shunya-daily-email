import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private httpClient: HttpClient) { }

  createUser(user): Observable<boolean> {
    return this.httpClient.post<boolean>('/api/createuser',{user:user});
  }

  removeUsers(users): Observable<Array<{}>> 
  {
    let names=[];
    users.forEach(element => {
      names.push(element.name);
    });
    return this.httpClient.post<Array<{}>>('/api/removeusers',{users:names});


  }
  getUsernames():Observable<Array<String>>{
    return this.httpClient.get<Array<String>>('/api/getusername');
  }

}
