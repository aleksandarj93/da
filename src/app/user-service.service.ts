import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import "reflect-metadata";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class UserServiceService {
  // 130.61.18.71:7809 direktno gadjanje isb
  private _userBasicUrl = "http://130.61.18.71:7809/ldaprest/User";
  // private _userBasicUrl = "http://172.20.2.162:7809/ldaprest/User";
  // private _userBasicUrl = "http://" + window.location.host + "/ldaprest/User";
  
  constructor(private _http: HttpClient) { }

  async addUser(user): Promise<any> {
    try {
      let response = await this._http.post(this._userBasicUrl, user)
      .toPromise();
      return response;
    } catch (error) {
      
    }
  }
 
  getUser(baseDN: string, searchScope: string, filter: string): Observable<any> {
    var _userGetUrl = this._userBasicUrl + "?baseDN=" + baseDN + "&searchScope=" + searchScope + "&filter=" + filter;
    return this._http.get<any>(_userGetUrl);
  }

  async asyncGetUser(baseDN: string, searchScope: string, filter: string): Promise<any> {
    var _userGetUrl = this._userBasicUrl + "?baseDN=" + baseDN + "&searchScope=" + searchScope + "&filter=" + filter;
    try {
      let response = await this._http.get<any>(_userGetUrl)
      .toPromise();
      return response;
    } catch (error) {
      
    }
  }

  async deleteUser(uid: string): Promise<any> {
    var _userDeleteUrl = this._userBasicUrl + "?dn=uid=" + uid + ",ou=People,o=domen1.rs,o=isp";
    try {
      let response = await this._http.delete(_userDeleteUrl)
      .toPromise();
      return response;
    } catch (error) {
      
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise<void>(resolve =>
      setTimeout(resolve, ms));
  }

  async getMailDomain(): Promise<any> {
    var _mailDomainGetUrl = this._userBasicUrl + "?baseDN=o=domen1.rs,o=isp&searchScope=SUB&filter=(objectclass=maildomain)";
    try {
      let response = await this._http.get<any>(_mailDomainGetUrl)
      .toPromise();
      return response;
    } catch (error) {
    }
  }

  async modifySunAvailableServices(object): Promise<any> {
    try {
      let response = await this._http.put(this._userBasicUrl, object)
      .toPromise();
      return response;
    } catch (error) {
      
    }
  }

  async modifyUser(object): Promise<any> {
    try {
      let response = await this._http.put(this._userBasicUrl, object)
      .toPromise();
      return response;
    } catch (error) {
      
    }
  }
}
