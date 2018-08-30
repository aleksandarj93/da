import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieServiceService } from './cookie-service.service';

@Injectable()
export class UserPageGuard implements CanActivate {

  constructor(private cookieService: CookieServiceService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      var domain = this.cookieService.getDomain();
      var segmentUrl = next.url;

      if (this.checkNSRole()) {
        return true;
      } else if (segmentUrl[1].path === domain) {
        console.log('User-page guard radi samo ako user nije top lvl admin.....')
        return true;
      }
    return false;
  }


  checkNSRole(): boolean {
    var nsrole = this.cookieService.getNSRole();
    if (nsrole === "Top-level Admin Role"){
      return true;
    } else {
      return false;
    }
  }

  
}
