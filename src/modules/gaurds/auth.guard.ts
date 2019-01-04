import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private _loginser: LoginService,
    private _router: Router
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      return this._loginser.checklogged().pipe(map((res:any) => {
        if (res.status) {
          if (res.admin && (state.url).includes('/admin/')) {
            return true;
         }else if(!res.admin && (state.url).includes('/user/')) {
            return true;
          } else {
            this._router.navigate([""]);
            return false;
          }
        }
        else{
          this._router.navigate([""]);
          return false;
        }
      }));
  }
}
