import { Component, OnInit } from '@angular/core';
import { UserServiceService } from './user-service.service';
import { PackageService } from './package.service'
import { CookieServiceService } from './cookie-service.service';
import { DomainService } from './domain.service';
import { SharedService } from './shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserServiceService, PackageService, CookieServiceService, DomainService]
})
export class AppComponent implements OnInit {
  // domain: any; 
  get domain(): string {
    return this._sharedService.domain;
   }
   set domain(value: string) {
    this._sharedService.domain = value;
   }

   
  constructor(private cookieService: CookieServiceService, private _sharedService: SharedService) { 
  }

  // domain: string = 'UNKNOWN';
  // da se pojavi uid u nav baru!
  uid: string = 'UNKNOWN';

  ngOnInit(): void {
    // this.domain = this.cookieService.getDomain();
  }
 
}
