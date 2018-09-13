import { Component, OnInit } from '@angular/core';
import { DomainService } from '../services/domain.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-domain-create',
  templateUrl: './domain-create.component.html',
  styleUrls: ['./domain-create.component.css']
})
export class DomainCreateComponent implements OnInit {

  constructor(private _domainService: DomainService) { }

  ngOnInit() {
  }
  
  name = new FormControl('', [Validators.required]);
  domainName = new FormControl('', [Validators.required]);


  notEntered() {
    if (this.name.value === '' || this.domainName.value === '') {
      return true;
    }
    return false;
  }
}
