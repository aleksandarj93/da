import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private cookieService: CookieService) { }

  extractNSRoleValue(value: string): string {
    var splitList = value.split('=');
    var nsrole = splitList[1].split(',').shift();
    console.log(nsrole)
    return nsrole;
  }

  getNSRole(): string {
    // staviti komentar kad se postavlja na server
    this.cookieService.set( 'OAM_USER_ADMIN', 'cn=Top-level Admin Role,o=mts.rs,o=isp' );
    
    var cookieValue = this.cookieService.get('OAM_USER_ADMIN');
    return this.extractNSRoleValue(cookieValue);
  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    var nsrole = this.getNSRole();
    var validator = false;
    if (nsrole === "Top-level Admin Role"){
      validator = true;
    }
    return validator;
  }


}
