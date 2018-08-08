import { Component } from '@angular/core';
import { UserServiceService } from './user-service.service';
import { PackageService } from './package.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserServiceService, PackageService]
})
export class AppComponent {

  // logout() {
  //   sessionStorage.removeItem('dn');
  //   window.alert("You have successfully logged out!");
  // }

  isSessionExist() {
      return true;
  }
  
}
