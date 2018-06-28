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

  getPackages() {
    var stringlist = Array<string>();
    this._userService.getMailDomain().subscribe(data => {
      stringlist = data.ldapSearch[0].sunAvailableServices;
      this.packageStringList = data.ldapSearch[0].sunAvailableServices;
    });
    setTimeout(() => {
      this.allPackages = this.extractAllPackages(stringlist);
      this.allPackages.forEach(element => {
        if(element.status) {
          this.availablePackages.push(element);
        }
      });
    }, 2000);
    
  }

  extractAllPackages(stringPackageList: Array<string>): Array<Package> {
    var packages: Array<Package> = new Array<Package>();
    stringPackageList.forEach(element => {
      var list: Array<string> = element.split(':');
      var status: boolean = false;
      if (Number(list[1]) > Number(list[2]))  {
        status = true;
      }
      var p = new Package(list[0], Number(list[1]), Number(list[2]), status);
      packages.push(p);
    });
    return packages;
  }

  notEntered() {
    if (this.firstFormGroup.value.firstName == '' || this.firstFormGroup.value.lastName == '' || this.firstFormGroup.value.password == '') {
      return true;
    }
    return false;
  }

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
      this.router.navigate(['user-search']);
    }, 1000);
    
  }



  updatePackageListString() {
    if (this.onlyStatus == 'SUCCESS') {
      // kad je user kreiran uspesno, za izabarani pakt update used +1, i update all package sa izabranim, sve pretvoriti u string
      
    }
  }

  modifySunAvailableServices() {
     var object = {};
     var modifications = [];
     var values = [];

     this.packageStringList.forEach(element => {
       values.push({"value": element});
     });

     modifications.push({"type": "replace", "name": "sunAvailableServices", "values": values });
     object = { "dn": "o=domen1.rs,o=isp", "modifications": modifications  };



  }

}


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
