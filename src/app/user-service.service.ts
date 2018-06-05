import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Headers, Http } from '@angular/http';
import { createJsonMode, resultStatus } from './shared/create-json-model';
import { User } from './shared/interfaces';
import 'rxjs/Rx';
import "reflect-metadata";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserServiceService {
  private _userBasicUrl = "http://130.61.78.8:8080/ldaprest/User";

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

  getUser(baseDN: string, searchScope: string, filter: string) {
    var _userPostUrl = this._userBasicUrl + "?baseDN=" + baseDN + "&searchScope=" + searchScope + "&filter=" + filter;

    console.log(_userPostUrl);

    return this._http.get(_userPostUrl).map(
      (response) => { 
        var resJson = JSON.parse(JSON.stringify(response));
        return resJson;
       }
    );
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
