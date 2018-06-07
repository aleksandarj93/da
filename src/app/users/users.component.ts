import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { resultStatus } from '../shared/create-json-model';
import { FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';


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

  packages =
  [
    { 
      id: "neptune", 
      name: "neptune",
      attributes: {"mailMsgMaxBlocks": 800, "mailQuota": -2, "mailMsgQuota": 6000, "mailAllowedServiceAccess": "+imap:ALL$+imaps:ALL$+pop:ALL$+pops:ALL$+smtp:ALL$+http:ALL"}
    },
    {
      id: "mars", 
      name: "mars",
      attributes: {"mailMsgMaxBlocks": 700, "mailQuota": 5242288, "mailMsgQuota": 3000, "mailAllowedServiceAccess": "+pop:ALL$+imap:ALL$+smtp:ALL$+http:ALL"}
    },
    {
      id: "earth", 
      name: "earth",
      attributes: {"mailMsgMaxBlocks": 300, "mailQuota": 6291456, "mailMsgQuota": 2000, "mailAllowedServiceAccess": "+pop:ALL$+imap:ALL$+smtp:ALL$+http:ALL"}
    }

  ];
  selectedPackage = null;
  
  matcher = new MyErrorStateMatcher();

  onlyStatus: string;
  message: string;
  IsHidden= true;
  

  constructor(private _userService: UserServiceService) { }

  ngOnInit() {
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

    var listObjClass = ["top", "person", "account", "inetuser", "inetOrgPerson", "ipuser", "organizationalperson", "iplanetpreferences", 
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

    attributes.push({"name": "inetUserStatus", "values": [{"value": "active"}]});

    attributes.push({"name": "userPassword", "values": [{"value": this.firstFormGroup.value.password}]});

    attributes.push({"name": "preferredlanguage", "values": [{"value": this.selectedLanguage}]});

    if(this.selectedPackage != null) {
      attributes.push({"name": "inetCos", "values": [{"value": this.selectedPackage}]});

      // za E-mail
      attributes.push({"name": "mail", "values": [{"value": this.firstFormGroup.value.firstName + "." + this.firstFormGroup.value.lastName + "@domen1.rs"}]});
      attributes.push({"name": "mailUserStatus", "values": [{"value": "active"}]});

      attributes.push({"name": "mailHost", "values": [{"value": "ucs7.sun.saga.rs"}]});

      // cekiran local inbox
      attributes.push({"name": "mailDeliveryOption", "values": [{"value": "mailbox"}]});
      

      // dodati atribute sa vrednostima iz paketa
      this.packages.forEach(element => { 
        if (element.id == this.selectedPackage) {
          if (this.secondFormGroup.value.mailQuota != null) { attributes.push({"name": "mailQuota", "values": [{"value": this.secondFormGroup.value.mailQuota}]}); }
          else { attributes.push({"name": "mailQuota", "values": [{"value": element.attributes.mailQuota}]}); }
          
          if(this.secondFormGroup.value.mailMsgQuota != null) { attributes.push({"name": "mailMsgQuota", "values": [{"value": this.secondFormGroup.value.mailMsgQuota}]}); }
          else { attributes.push({"name": "mailMsgQuota", "values": [{"value": element.attributes.mailMsgQuota}]}); }

          attributes.push({"name": "mailMsgMaxBlocks", "values": [{"value": element.attributes.mailMsgMaxBlocks}]});
          attributes.push({"name": "mailAllowedServiceAccess", "values": [{"value": element.attributes.mailAllowedServiceAccess}]});
        }
      });

      // za Kalendar
      attributes.push({"name": "icsTimezone", "values": [{"value": "Europe/Paris"}]});
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
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
