import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { resultStatus } from '../shared/create-json-model';
import { FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { Router } from '@angular/router';
import { Package } from '../shared/package.model';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {

    firstFormGroup = new FormGroup({
      firstName: new FormControl('', [ Validators.required ]),
      lastName: new FormControl('', [ Validators.required ]),
      password: new FormControl('', [ Validators.required ])
    });

    secondFormGroup = new FormGroup({
      mailQuota: new FormControl(),
      mailMsgQuota: new FormControl()
    });

  languages =
  [
    { id: "en", name: "English" },
    { id: "de", name: "German" },
    { id: "es", name: "Spanish" },
    { id: "fr", name: "French" },
    { id: "ja", name: "Japanese" },
    { id: "ko", name: "Korean" },
    { id: "zh-CN", name: "Simplified Chinese" },
    { id: "zh-TW", name: "Traditional Chinese" }
  ];
  selectedLanguage = "en";

  // paketi
  packageStringList = Array<string>(); // lista paketa u string obliku, kako servis vraca
  allPackages: Array<Package> = new Array<Package>(); // svi paketi kao objekti
  availablePackages: Array<Package> = new Array<Package>(); // paketi koji mogu biti dodeljeni pri kreiranju
  selectedPackage: Package = null; // izabrani paket
  
  matcher = new MyErrorStateMatcher();

  // status i poruka 
  onlyStatus: string;
  message: string;
  IsHidden= true;

  constructor(private _userService: UserServiceService, private router: Router) { }

  ngOnInit() {
    this.getPackages();
  }

  // Metoda koja poziva servis getMailDomain() da bi dobila pakete u obliku niza stringova,
  // zatim poziva metodu extractAllPackages() i popunjava globalne promenljive allPackages, i availablePackages
  // paket se svrstava u availablePackages ako mu je status prethodno postavljan na true.
  getPackages() {
    var stringlist = Array<string>();
    this._userService.getMailDomain().subscribe(data => {
      stringlist = data.ldapSearch[0].sunAvailableServices;
      this.packageStringList = data.ldapSearch[0].sunAvailableServices;
    });
    setTimeout(() => {
      this.allPackages = Package.extractAllPackages(stringlist);
      this.allPackages.forEach(element => {
        if(element.status) {
          this.availablePackages.push(element);
        }
      });
    }, 2000);
  }


  // Metoda koja proverava da li su obavezni parametri popunjeni i omogucava korisniku da klikne dugme Create
  notEntered() {
    if (this.firstFormGroup.value.firstName == '' || this.firstFormGroup.value.lastName == '' || this.firstFormGroup.value.password == '') {
      return true;
    }
    return false;
  }

  // Metoda se izvrsava klikom na dugme Create. Uzima sa forme sve unete informacije i pozvia servis addUser(user)
  // ako je user uspesno kreiran i neki paket odabran poziva se metoda za update-ovanje iskoriscenih paketa
  // modifySunAvailableServices().
  onSubmit() {

    var formResult = {};
    var attributes = [];
    var valuesObjClas = [];

    var listObjClass = ["top", "person", "account", "inetuser", "inetOrgPerson", "ipuser", "ipgroup","inetsubscriber", "userpresenceprofile",
     "organizationalperson", "iplanetpreferences", "nabUser",
    "daventity", "inetLocalMailRecipient", "icscalendaruser", "inetmailUser"];

    listObjClass.forEach(element => {
      valuesObjClas.push({"value": element});
    });

    attributes.push({"name": "Objectclass", "values": valuesObjClas});

    var uid = this.firstFormGroup.value.firstName + "_" + this.firstFormGroup.value.lastName;
    
    attributes.push({"name": "uid", "values": [{ "value": uid }]});

    attributes.push({"name": "givenName", "values": [{"value": this.firstFormGroup.value.firstName}]}); //first name

    attributes.push({"name": "cn", "values": [{"value": this.firstFormGroup.value.firstName + " " + this.firstFormGroup.value.lastName}]});

    attributes.push({"name": "sn", "values": [{"value": this.firstFormGroup.value.lastName}]});

    // attributes.push({"name": "inetUserStatus", "values": [{"value": "active"}]});

    attributes.push({"name": "userPassword", "values": [{"value": this.firstFormGroup.value.password}]});

    attributes.push({"name": "preferredlanguage", "values": [{"value": this.selectedLanguage}]});

    if(this.selectedPackage != null) {
      attributes.push({"name": "inetCos", "values": [{"value": this.selectedPackage.name}]});

      // za E-mail
      attributes.push({"name": "mail", "values": [{"value": this.firstFormGroup.value.firstName + "." + this.firstFormGroup.value.lastName + "@domen1.rs"}]});
    }

    formResult = {"dn": "uid=" + uid + ",ou=People,o=domen1.rs,o=isp", "attributes": attributes};
    console.log("stara lista:   " + this.packageStringList)
    this._userService.addUser(formResult)
    .subscribe(
      (data: resultStatus) => { 
        this.onlyStatus = data.resultStatus
        this.message = data.resultStatus + ": " +data.message;
        this.IsHidden = false;
      },
      (error: Error) => {  console.log(error) }
    );
    setTimeout(() => {
      if (this.onlyStatus == 'SUCCESS' && this.selectedPackage != null) {
        this.modifySunAvailableServices();
      }
    }, 1500);

    setTimeout(() => {
      this.router.navigate(['user-search']);
    }, 2000);
    
  }
// Ako je user kreiran i dodeljen mu je paket, za izabrani paket dodaje se + 1 za used atribut
// i poziva se metoda convertPackagesToStringList().
  updatePackageListString() {
    if (this.onlyStatus == 'SUCCESS' && this.selectedPackage != null) {
      this.allPackages.forEach(element => {
        if(element.name == this.selectedPackage.name) {
          element.used = element.used + 1;
        }
      });
      this.packageStringList =  Package.convertPackagesToStringList(this.allPackages);
      console.log("NOVA lista:   " + this.packageStringList)
    }
  }

  // Poziva se metoda updatePackageListString(), i konstruise se objekat koji se salje servisu modifySunAvailableServices().
  modifySunAvailableServices() {
     this.updatePackageListString();

     var object = {};
     var modifications = [];
     var values = [];

     this.packageStringList.forEach(element => {
       values.push({"value": element});
     });

     modifications.push({"type": "replace", "name": "sunAvailableServices", "values": values });
     object = { "dn": "o=domen1.rs,o=isp", "modifications": modifications  };
     console.log("modifySunAvailableServices   object      "+object);
      this._userService.modifySunAvailableServices(object).subscribe(
        data => { console.log(JSON.stringify(data)) } 
      );

  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
