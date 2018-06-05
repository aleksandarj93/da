import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CDK_DESCRIBEDBY_HOST_ATTRIBUTE } from '@angular/cdk/a11y';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = new FormControl();
  password = new FormControl();

  bindDN: string;
  hide = true;
  constructor(private Auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  userLogin() {

    if (this.username.value != null && this.password.value != null) {
    this.Auth.getCheckUser(this.username.value, this.password.value).subscribe(data => {
      var result = JSON.parse(JSON.stringify(data));
      if(result.resultStatus === 'SUCCESS')
      {
        
        this.router.navigate(['user-search']);
        // this.Auth.setLoggedIn(true);
        this.bindDN = result.bindDN;
        sessionStorage.setItem('dn',result.bindDN);
      
      }
      else if (result.resultStatus === 'FAILURE')
      {
        window.alert("Wrong credentials!");
      }
      else { window.alert("An error has occurred!"); }
    })
  }
  else { window.alert("You need to enter Login ID and password!") }
  }

  // uid: string = "";
  // domen: string = "";
  // @Output() forNav: EventEmitter<> 

  // forNav() {
  //   if (sessionStorage.getItem('dn') != null) {

  //   var dn = sessionStorage.getItem('dn');
  //   var stringArray: Array<string> = dn.split(',');
  //   this.uid = stringArray[0].substring(3);
  //   this.domen = stringArray[2].substring(1);
  //   }

    

}
