import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ManageProfileService {
  constructor(private httpClient: HttpClient) {}
  changePassword(user) {
    return this.httpClient.post("/api/changepassword", { userchange: user });
  }
  changeUsername(user) {
    return this.httpClient.post("/api/changeusername", { userchange: user });
  }
  forgotpassword(email) {
    return this.httpClient.post("/api/forgotPassword", { email: email });
  }
}
