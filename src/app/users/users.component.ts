import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Package } from '../shared/package.model';
import { PackageService } from '../package.service';
import { SharedService } from '../services/shared.service';
import { ChosenDomain } from '../shared/interfaces';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {

  firstFormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
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

  domain: string;
  matcher = new MyErrorStateMatcher();

  // status i poruka 
  onlyStatus: string;
  message: string;
  IsHidden = true;

  constructor(private _userService: UserServiceService, private route: ActivatedRoute,private router: Router, private _packageService: PackageService,
  private sharedService: SharedService) { 
    this.domain = this.route.snapshot.params['domain'];
    var chosenDomain = new ChosenDomain(this.domain, true);
    this.sharedService.changeSelectedDomainParam(chosenDomain);
  }

  async ngOnInit() {
    this.packageStringList = await this._packageService.getPackageStringList(this.domain);
    this.allPackages = this._packageService.getAllPackagesObjs(this.packageStringList);
    this.availablePackages = this._packageService.getAvailablePackagesObjs(this.allPackages);
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
  async onSubmit() {

    var formResult = {};
    var attributes = [];
    var valuesObjClas = [];

    var listObjClass = ["top", "person", "account", "inetuser", "inetOrgPerson", "ipuser", "ipgroup", "inetsubscriber", "userpresenceprofile",
      "organizationalperson", "iplanetpreferences", "nabUser",
      "daventity", "inetLocalMailRecipient", "icscalendaruser", "inetmailUser"];

    listObjClass.forEach(element => {
      valuesObjClas.push({ "value": element });
    });

    attributes.push({ "name": "Objectclass", "values": valuesObjClas });

    var uid = this.firstFormGroup.value.firstName + "_" + this.firstFormGroup.value.lastName;

    attributes.push({ "name": "uid", "values": [{ "value": uid }] });

    attributes.push({ "name": "givenName", "values": [{ "value": this.firstFormGroup.value.firstName }] }); //first name

    attributes.push({ "name": "cn", "values": [{ "value": this.firstFormGroup.value.firstName + " " + this.firstFormGroup.value.lastName }] }); // ime i preizme

    attributes.push({ "name": "sn", "values": [{ "value": this.firstFormGroup.value.lastName }] }); //preizme

    attributes.push({ "name": "inetUserStatus", "values": [{ "value": "active" }] }); // ovo mora da bi se video na pravom DA

    attributes.push({ "name": "userPassword", "values": [{ "value": this.firstFormGroup.value.password }] });

    attributes.push({ "name": "preferredlanguage", "values": [{ "value": this.selectedLanguage }] });

    if (this.selectedPackage != null) {
      attributes.push({ "name": "inetCos", "values": [{ "value": this.selectedPackage.name }] });

      // za E-mail
      attributes.push({ "name": "mail", "values": [{ "value": String(this.firstFormGroup.value.firstName).toLowerCase()  + "." 
      + String(this.firstFormGroup.value.lastName).toLowerCase()  + this.domain }] });
      
      attributes.push({"name": "mailUserStatus", "values": [{ "value": "active" }] });
    }

    formResult = { "dn": "uid=" + uid + ",ou=People,o="+ this.domain +",o=isp", "attributes": attributes };
    console.log("stara lista:   " + this.packageStringList)

    let addResult = await this._userService.addUser(formResult);
    this.onlyStatus = addResult.resultStatus
    this.message = addResult.resultStatus + ": " + addResult.userDN;
    this.IsHidden = false;

    let res;
    if (this.onlyStatus == 'SUCCESS' && this.selectedPackage != null) {
      this.packageStringList = this._packageService.updatePackageListString(this.onlyStatus, this.selectedPackage, this.allPackages, "create");
      res = await this._packageService.modifySunAvailableServices(this.packageStringList);
    }
    setTimeout(() => {
      this.router.navigate(['user-search', this.domain]);
    }, 1000);

  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
