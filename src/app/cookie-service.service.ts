import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookieServiceService {

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

  extractDomainValue(value: string): string {
    var splitList = value.split('=');
    var domain = splitList[3].split(',').shift();
    console.log(domain)
    return domain;
  }

  getDomain(): string {
    // staviti komentar kad se postavlja na server
    this.cookieService.set( 'OAM_USER_DN', 'uid=bogdan_bogdanovic,ou=People,o=domen1.rs,o=isp' );
    
    var cookieValue = this.cookieService.get('OAM_USER_DN');
    return this.extractDomainValue(cookieValue);
  }
}
