import { Component, OnInit } from '@angular/core';
import { UserServiceService } from './services/user-service.service';
import { PackageService } from './services/package.service'
import { CookieServiceService } from './services/cookie-service.service';
import { DomainService } from './services/domain.service';
import { Router } from '@angular/router';
import { SharedService } from './services/shared.service';


const SMALL_WIDTH_BREAKPOINT = 720;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserServiceService, PackageService, CookieServiceService, DomainService]
})
export class AppComponent implements OnInit {
  // parametri za logiku navigacije
  domain: any;
  isChosen: boolean;
  nsRole: any;

  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);
 
  constructor(private cookieService: CookieServiceService, private router: Router, private sharedService: SharedService) { 
    // ako se ne menja side nav u odnosu na velicinu (dodati i zonu)
    // this.mediaMatcher.addListener(mql => this.mediaMatcher = mql);
  }

  ngOnInit(): void {
    this.sharedService.selectedDomainChanged$.subscribe(
      selectedDomainParam => {
      this.domain = selectedDomainParam.domainParam;
      this.isChosen = selectedDomainParam.isChosen;
      }
    );
    this.nsRole = this.cookieService.getNSRole();

  }

  isScreenSmall(): boolean {
    return this.mediaMatcher.matches;
  }

 
}
