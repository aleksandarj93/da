import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ChosenDomain } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private selectedDomainParamSource = new Subject<ChosenDomain | null>();
  
  selectedDomainChanged$ =  this.selectedDomainParamSource.asObservable();

  constructor() { }

 changeSelectedDomainParam(value: ChosenDomain | null) {
  this.selectedDomainParamSource.next(value);
 }

}
