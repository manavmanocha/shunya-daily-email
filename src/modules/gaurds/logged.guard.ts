import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate {
  constructor(
    private _loginser: LoginService,
    private _router: Router
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this._loginser.checklogged().pipe(map((res:any) => {
        if (res.status) {
          if (res.admin) {
            this._router.navigate(["admin/home"]);
            return false;
          } else {
            this._router.navigate(["user/home"]);
            return false;
          }
        }
        else{
          return true;
        }
      }));
  }
}
