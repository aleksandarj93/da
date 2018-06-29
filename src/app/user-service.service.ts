import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { resultStatus } from './shared/create-json-model';
import 'rxjs/Rx';
import "reflect-metadata";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class UserServiceService {
  // private _userBasicUrl = "http://130.61.78.8:8081/ldaprest/User";
  // private _userBasicUrl = "http://172.20.2.162:7809/ldaprest/User";
  private _userBasicUrl = "http://" + window.location.host + "/ldaprest/User";
  

  result: resultStatus;


  constructor(private _http: HttpClient) { }

  addUser(user) {
    // const headers = new Headers({'Content-Type': 'application/json'});
    const head = {'Content-Type': 'application/json'};

    return this._http.post(this._userBasicUrl, user, {headers: head}).map(
      (response) => {
        var resJson = JSON.parse(JSON.stringify(response));
        this.parseMessageResponse(resJson);
        return this.result; 
      }
    );
  }
 
  getUser(baseDN: string, searchScope: string, filter: string): Observable<any> {
    var _userGetUrl = this._userBasicUrl + "?baseDN=" + baseDN + "&searchScope=" + searchScope + "&filter=" + filter;
    return this._http.get<any>(_userGetUrl );
  }

  deleteUser(uid: string) {
    var _userDeleteUrl = this._userBasicUrl + "?dn=uid=" + uid + ",ou=People,o=domen1.rs,o=isp";
    return this._http.delete(_userDeleteUrl).map(
      (response) => {
        var resJson = JSON.parse(JSON.stringify(response));
        this.parseMessageResponse(resJson);
        return this.result; 
      }
    )
  }

  getMailDomain(): Observable<any> {
    var _mailDomainGetUrl = this._userBasicUrl + "?baseDN=o=domen1.rs,o=isp&searchScope=SUB&filter=(objectclass=maildomain)";
    return this._http.get<any>(_mailDomainGetUrl);
  }

  modifySunAvailableServices(object) {
    return this._http.put(this._userBasicUrl, object);
  }

  parseMessageResponse(obj: any) {
    if (obj.resultStatus === 'SUCCESS') {
      this.result = new resultStatus(obj.resultStatus, obj.userDN);
    }
    else
    {
      this.result = new resultStatus(obj.resultStatus, obj.message);
    }
    return this.result;
  }
}
