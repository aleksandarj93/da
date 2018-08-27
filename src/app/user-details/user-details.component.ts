import { Component, OnInit, Input, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UserServiceService } from '../user-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { UserModifyDialogComponent } from '../dialogs/user-modify-dialog/user-modify-dialog.component';
import { Package } from '../shared/package.model';
import { PackageService } from '../package.service';
import { BuildJSObjects } from '../shared/buildJSObjects';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit, OnChanges, OnDestroy {

  // userInformation = new FormGroup({
  //   uid: new FormControl(),
  //   firstName: new FormControl(),
  //   lastName: new FormControl(),
  //   inetUserStatus: new FormControl()
  // });
  @Output() notifyClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() uad: any;
  
  oldUser: any = {};
  newUser: any = {};

   // paketi
   packageStringList = Array<string>(); // lista paketa u string obliku, kako servis vraca
   allPackages: Array<Package> = new Array<Package>(); // svi paketi kao objekti
   availablePackages: Array<Package> = new Array<Package>(); // paketi koji mogu biti dodeljeni pri kreiranju
   oldSelectedPackage: Package = null; // stari izabrani paket
   newSelectedPackage: Package = null; // novi izabrani paket

  isLoadingResults = false;

  constructor(private _userService: UserServiceService, public dialog: MatDialog, private _packageService: PackageService) {
   }

  async ngOnChanges() {
    console.log("ngOnChanges")

    const filter = "(uid=" + this.uad.uid + ")";
      let res = await this._userService.asyncGetUser("o="+ this.uad.domain +",o=isp", "SUB", filter);
      this.oldUser = res.ldapSearch[0];
      let newObject = Object.assign({}, this.oldUser); // mora ovako da se ne referencira na isti objekat
      this.newUser = newObject;

      this.packageStringList = await this._packageService.getPackageStringList(this.uad.domain);
      this.allPackages = this._packageService.getAllPackagesObjs(this.packageStringList);
      this.availablePackages = this._packageService.getAvailablePackagesObjs(this.allPackages);

    if(this.oldUser != undefined && this.allPackages.length != 0) {
        this.oldSelectedPackage = this._packageService.findSelectedPackage(this.oldUser.inetCOS, this.allPackages);
        this.newSelectedPackage = this.oldSelectedPackage;
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log("ngOnDestroy");
  }

  onClose() {
    this.notifyClose.emit(true);
  }

  openModifyUserDialog(): void {
    let dialogRef = this.dialog.open(UserModifyDialogComponent, {
      data: {  }
    });
    dialogRef.afterClosed().subscribe(result => {
         if(result) { this.onModify() }
         else {  console.log( result) } 
    });
  }


  async onModify() {
    this.isLoadingResults = true;
    console.log(this.oldSelectedPackage)
    console.log(this.newSelectedPackage)
    if(JSON.stringify(this.oldUser).toLowerCase() != JSON.stringify(this.newUser).toLowerCase() || this.newSelectedPackage != this.oldSelectedPackage) {

      if (this.newSelectedPackage != undefined) {
          this.newUser.inetCOS = this.newSelectedPackage.name;
          this.newUser.mail = String(this.newUser.givenName).toLowerCase() + "." + String(this.newUser.sn).toLowerCase() + "@domen1.rs";
      }

    console.log(this.oldUser)
    console.log(this.newUser)
    
    this.newUser.cn = this.newUser.givenName + " " + this.newUser.sn;
    if (this.oldUser.mail != undefined) {
      this.newUser.mail = String(this.newUser.givenName).toLowerCase() + "." + String(this.newUser.sn).toLowerCase() + "@domen1.rs";
      // razmisli za mail
    }
    

    var object = BuildJSObjects.createUserModifyObject(this.oldUser,this.newUser);
    var userResponse = await this._userService.modifyUser(object);

    if(this.oldSelectedPackage == undefined || this.oldSelectedPackage == null) {
      if (this.newSelectedPackage != undefined && this.newSelectedPackage != null) {
        this.packageStringList = this._packageService.updatePackageListString("SUCCESS", this.newSelectedPackage, this.allPackages, "create");
        var packageResponse = await this._packageService.modifySunAvailableServices(this.packageStringList);
      }
    }
    else {
      if (this.newSelectedPackage != undefined && this.newSelectedPackage != null && this.newSelectedPackage.name != this.oldSelectedPackage.name) {
        this.packageStringList = this._packageService.updatePackageListString("SUCCESS", this.newSelectedPackage, this.allPackages, "create");
        this.packageStringList = this._packageService.updatePackageListString("SUCCESS", this.oldSelectedPackage, this.allPackages, "delete");
        var packageResponse = await this._packageService.modifySunAvailableServices(this.packageStringList);
      }
    }

    if (userResponse.resultStatus == "SUCCESS" && (packageResponse == undefined || packageResponse.resultStatus == "SUCCESS" )) {
      window.alert("Korisnik je uspesno izmenjen!")
      this.onClose();
    }
    else { 
      window.alert("Doslo je do greske!")
    }
  }
  else { window.alert("Niste nista izmenili"); }
  this.isLoadingResults = false;
}

}
