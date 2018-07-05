import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UserServiceService } from '../user-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { UserModifyDialogComponent } from '../dialogs/user-modify-dialog/user-modify-dialog.component';
import { Package } from '../shared/package.model';
import { PackageService } from '../package.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit, OnChanges {

  // userInformation = new FormGroup({
  //   uid: new FormControl(),
  //   firstName: new FormControl(),
  //   lastName: new FormControl(),
  //   inetUserStatus: new FormControl()
  // });
  @Output() notifyClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _user;
  private oldUser: any;

  get user(): any {
    return this._user;
  }

  @Input()
  set user(val: any) {
    this._user = val;
  }
  
  // oldUser: any;
  // newUser: any;

   // paketi
   packageStringList = Array<string>(); // lista paketa u string obliku, kako servis vraca
   allPackages: Array<Package> = new Array<Package>(); // svi paketi kao objekti
   availablePackages: Array<Package> = new Array<Package>(); // paketi koji mogu biti dodeljeni pri kreiranju
   oldSelectedPackage: Package = null; // stari izabrani paket
   newSelectedPackage: Package = null; // novi izabrani paket



  constructor(private _userService: UserServiceService, public dialog: MatDialog, private _packageService: PackageService) {
   }

  ngOnChanges() {
    console.log("ngOnChanges")
    if(this._user != undefined && this.allPackages.length != 0) {
      console.log(JSON.stringify(this._user))
      this.oldUser = this._user;
      if (this._user.inetCOS != undefined) {
        this.oldSelectedPackage = this._packageService.findSelectedPackage(this._user.inetCOS, this.allPackages);
        this.newSelectedPackage = this.oldSelectedPackage;
      }
      
    }
  }

  async ngOnInit() {
    this.packageStringList = await this._packageService.getPackageStringList();
    this.allPackages = this._packageService.getAllPackagesObjs(this.packageStringList);
    this.availablePackages = this._packageService.getAvailablePackagesObjs(this.allPackages);
    console.log("ngOnInit");
    
    this.ngOnChanges();
 
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
    if(this.oldSelectedPackage == undefined || this.oldSelectedPackage == null) {
      if (this.newSelectedPackage != undefined && this.newSelectedPackage != null) {
        this.packageStringList = this._packageService.updatePackageListString("SUCCESS", this.newSelectedPackage, this.allPackages, "create");
        let res = await this._packageService.modifySunAvailableServices(this.packageStringList);
      }
    }
    else {
      if (this.newSelectedPackage != undefined && this.newSelectedPackage != null && this.newSelectedPackage.name != this.oldSelectedPackage.name) {
        this.packageStringList = this._packageService.updatePackageListString("SUCCESS", this.newSelectedPackage, this.allPackages, "create");
        this.packageStringList = this._packageService.updatePackageListString("SUCCESS", this.oldSelectedPackage, this.allPackages, "delete");
        let res = await this._packageService.modifySunAvailableServices(this.packageStringList);
      }
    }

    console.log(JSON.stringify(this.oldSelectedPackage))
    console.log(JSON.stringify(this.newSelectedPackage))
    console.log(JSON.stringify(this._user))
    console.log(JSON.stringify(this.oldUser))
    if(JSON.stringify(this._user).toLowerCase() == JSON.stringify(this.oldUser).toLowerCase()) {
      console.log("true")
    }
    else console.log("false")
    
  }

}
