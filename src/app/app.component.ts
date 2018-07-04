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

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }
  
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
  }

  // logout() {
  //   sessionStorage.removeItem('dn');
  //   window.alert("You have successfully logged out!");
  // }

  isSessionExist() {
      return true;
  }



  
}
