import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DomainService } from '../domain.service';

@Component({
  selector: 'app-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.css']
})
export class DomainsComponent implements OnInit {

  constructor(private _domainService: DomainService) { }
  ngOnInit() {
  }

}
