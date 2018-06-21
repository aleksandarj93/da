import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient) { }

  // private _userBasicUrl = "http://" + window.location.host + "/ldaprest";
  private _userBasicUrl = " http://130.61.78.8:8080/ldaprest/ldaprest";


  getCheckUser(username: string, password: string) {
    var authUrl =  this._userBasicUrl + "/authentication?bindDN=uid=" + username + ",ou=People,o=domen1.rs,o=isp&password=" + password;
    return this._http.get(authUrl);
  }
}
