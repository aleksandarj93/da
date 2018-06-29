import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UserServiceService } from '../user-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { UserModifyDialogComponent } from '../dialogs/user-modify-dialog/user-modify-dialog.component';
import { Package } from '../shared/package.model';

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


  @Input() user: any;
  @Output() notifyClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  oldUser: any;

   // paketi
   packageStringList = Array<string>(); // lista paketa u string obliku, kako servis vraca
   allPackages: Array<Package> = new Array<Package>(); // svi paketi kao objekti
   availablePackages: Array<Package> = new Array<Package>(); // paketi koji mogu biti dodeljeni pri kreiranju
   oldSelectedPackage: Package = null; // stari izabrani paket
   newSelectedPackage: Package = null; // novi izabrani paket



  constructor(private _userService: UserServiceService, public dialog: MatDialog) {
    this.getPackages();
   }

  ngOnChanges() {
    this.oldUser = this.user;
    console.log(JSON.stringify(this.user));
    

  }

  ngOnInit() {
    this.oldSelectedPackage = new Package();
    this.oldSelectedPackage.name = this.user.inetCOS;
    console.log(this.user.inetCOS)
  }


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

  onModify() {
    // pozovi servis za modify user i za modify package.
    console.log(JSON.stringify(this.user))
  }

}
