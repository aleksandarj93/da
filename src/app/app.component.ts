import { Component, OnInit } from '@angular/core';
import { UserServiceService } from './user-service.service';
import { PackageService } from './package.service'
import { CookieServiceService } from './cookie-service.service';
import { DomainService } from './domain.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserServiceService, PackageService, CookieServiceService, DomainService]
})
export class AppComponent implements OnInit {

  constructor(private cookieService: CookieServiceService) { }

  domain: string = 'UNKNOWN';
  // da se pojavi uid u nav baru!
  uid: string = 'UNKNOWN';

  ngOnInit(): void {
    this.domain = this.cookieService.getDomain();
  }
 
}
