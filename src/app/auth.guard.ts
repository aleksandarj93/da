import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieServiceService } from './cookie-service.service';
import { SharedService } from './services/shared.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private cookieService: CookieServiceService, private router: Router) { }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkNSRole();
  }

  checkNSRole(): boolean {
    var nsrole = this.cookieService.getNSRole();
    if (nsrole === "Top-level Admin Role"){
      return true;
    } else {
      var domain = this.cookieService.getDomain()
      this.router.navigate(['/user-search', domain]);
      return false;
    }
  }

}
