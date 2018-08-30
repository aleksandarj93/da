import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DomainService {

    // 130.61.18.71:7809 direktno gadjanje isb
    private _domainBasicUrl = "http://130.61.18.71:7809/ldaprest/domain";
    // private _userBasicUrl = "http://172.20.2.162:7809/ldaprest/domain";
    // private _userBasicUrl = "http://" + window.location.host + "/ldaprest/domain";

  constructor(private _http: HttpClient) { }

  async asyncGetDomain(baseDN: string, searchScope: string, filter: string): Promise<any> {
    var _domainGetUrl = this._domainBasicUrl + "?baseDN=" + baseDN + "&searchScope=" + searchScope + "&filter=" + filter;
    try {
      let response = await this._http.get<any>(_domainGetUrl)
      .toPromise();
      return response;
    } catch (error) {
      
    }
  }

}
