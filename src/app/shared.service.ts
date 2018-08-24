import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }
  domain: string;

//   private subject = new Subject<any>();
 
//     sendDomain(domain: string) {
//         this.subject.next({ text: domain });
//     }
 
//     clearMessage() {
//         this.subject.next();
//     }
 
//     getDomain(): Observable<any> {
//         return this.subject.asObservable();
//     }

  
}
