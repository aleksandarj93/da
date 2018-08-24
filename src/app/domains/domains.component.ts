import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DomainService } from '../domain.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.css']
})
export class DomainsComponent implements OnInit {

  constructor(private _domainService: DomainService, private _sharedService: SharedService) { }


  ngOnInit() {
  }

  sendDomain(value: string) {
    this._sharedService.domain = value;
  }


}
