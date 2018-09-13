import { Component, OnInit } from '@angular/core';
import { DomainService } from '../services/domain.service';
import { FormControl, Validators } from '@angular/forms';
import { SharedService } from '../services/shared.service';
import { Package } from '../shared/package.model';

@Component({
  selector: 'app-domain-create',
  templateUrl: './domain-create.component.html',
  styleUrls: ['./domain-create.component.css']
})
export class DomainCreateComponent implements OnInit {

  constructor(private _domainService: DomainService, private _sharedService: SharedService) { }

  ngOnInit() {
    this._sharedService.selectedPackages$.subscribe(
      selectedPackage => {
        this.selectedPackages = selectedPackage;
      }
    );
  }
  
  name = new FormControl('', [Validators.required]);
  domainName = new FormControl('', [Validators.required]);
  selectedPackages: Array<Package> = new Array<Package>();


  notEntered() {
    if (this.name.value === '' || this.domainName.value === '') {
      return true;
    }
    return false;
  }
}
