import { Component, OnInit } from '@angular/core';
import { UserServiceService } from './user-service.service';
import { PackageService } from './package.service'
import { CookieServiceService } from './cookie-service.service';
import { DomainService } from './services/domain.service';
import { Router } from '@angular/router';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserServiceService, PackageService, CookieServiceService, DomainService]
})
export class AppComponent implements OnInit {
  domain: any;
  isChosen: boolean;
  nsRole: any;
 
  
   
  constructor(private cookieService: CookieServiceService, private router: Router, private sharedService: SharedService) { 
  }

  // domain: string = 'UNKNOWN';
  // da se pojavi uid u nav baru!
  uid: string = 'UNKNOWN';

  ngOnInit(): void {
    this.sharedService.selectedDomainChanged$.subscribe(
      selectedDomainParam => {
      this.domain = selectedDomainParam.domainParam;
      this.isChosen = selectedDomainParam.isChosen;
      }
    );
    this.nsRole = this.cookieService.getNSRole();

  }

  goUserSearch() {
    this.router.navigate(['/user-search', this.domain]);
  }
 
}
