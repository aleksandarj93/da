import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ChosenDomain } from '../shared/interfaces';
import { Package } from '../shared/package.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  
  
  constructor() { }
  private selectedDomainParamSource = new Subject<ChosenDomain | null>();
  selectedDomainChanged$ =  this.selectedDomainParamSource.asObservable();

 changeSelectedDomainParam(value: ChosenDomain | null) {
  this.selectedDomainParamSource.next(value);
 }


 private selectedPackagesSource = new Subject<Array<Package> | null>();
 selectedPackages$ = this.selectedPackagesSource.asObservable();

 changeSelectedPackage(value: Array<Package> | null) {
   this.selectedPackagesSource.next(value);
 }

}
