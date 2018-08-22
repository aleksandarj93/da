import { Component, OnInit } from '@angular/core';
import { UserServiceService } from './user-service.service';
import { PackageService } from './package.service'
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserServiceService, PackageService]
})
export class AppComponent implements OnInit {

  domain: string = 'UNKNOWN';
  uid: string = 'UNKNOWN';

  ngOnInit(): void {
    this.domain = this.getDomain();
  }
 
  constructor(private cookieService: CookieService) { }

  extractDomainValue(value: string): string {
    var splitList = value.split('=');
    var domain = splitList[3].split(',').shift();
    this.uid = splitList[1].split(',').shift();
    console.log(domain)
    return domain;
  }

  getDomain(): string {
    // staviti komentar kad se postavlja na server
    this.cookieService.set( 'OAM_USER_DN', 'uid=bogdan_bogdanovic,ou=People,o=domen1.rs,o=isp' );
    
    var cookieValue = this.cookieService.get('OAM_USER_DN');
    return this.extractDomainValue(cookieValue);
  }
 
  isSessionExist() {
      return true;
  }
  
}
