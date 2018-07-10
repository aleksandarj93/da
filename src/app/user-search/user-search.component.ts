import { Component, OnInit, ViewChild } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SingleDeleteDialogComponent } from '../dialogs/single-delete-dialog/single-delete-dialog.component';
import { Package } from '../shared/package.model';
import { PackageService } from '../package.service';


@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent implements OnInit {
  baseDN: string = ""; // u zavisnosti ko je ulogovan!!
  scope: string = 'SUB';
  filterString: string = "";

  userForm = new FormGroup({
    value: new FormControl()
  });

  category = "People";

  filter = [
    { id: "uid", attribute: "UID" },
    { id: "mail", attribute: "Mail" }
  ];
  selectedAttribute = null;

  // za tabelu
  hiddenDetails: boolean = true;
  userDetailsUID: any;
  isLoadingResults = true;

  displayedColumns = ['select', 'Full name', 'E-mail', 'Options'];
  dataSource: MatTableDataSource<ldapSearchData>;
  selection = new SelectionModel<ldapSearchData>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // paketi
  packageStringList = Array<string>(); // lista paketa u string obliku, kako servis vraca
  allPackages: Array<Package> = new Array<Package>(); // svi paketi kao objekti
  selectedPackage: Package = undefined; // izabrani paket

  constructor(private _userService: UserServiceService, public dialog: MatDialog, private _packageService: PackageService) { }

  async ngOnInit() {
    this.packageStringList = await this._packageService.getPackageStringList();
    this.allPackages = this._packageService.getAllPackagesObjs(this.packageStringList);
    this.onSubmit();
    
  }



  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  onDetails(uid: string) {
    this.userDetailsUID = uid;
    this.hiddenDetails = false;
  }


  async DeleteSingleUser(userDel: ldapSearchData) {
    let delResult = await this._userService.deleteUser(userDel.uid);
    if (delResult.resultStatus === 'SUCCESS') {
      if (userDel.inetCos != undefined && userDel.inetCos != null) {
        let selectedPackage = this._packageService.findSelectedPackage(userDel.inetCos, this.allPackages);
        this.packageStringList = this._packageService.updatePackageListString(delResult.resultStatus, selectedPackage, this.allPackages, "delete");
        let res;
        res = await this._packageService.modifySunAvailableServices(this.packageStringList);
      }
      window.alert("User successfully deleted!");
    }
    else if (delResult.resultStatus === 'FAILURE') {
      window.alert("Wrong user uid!");
    }
    else { window.alert("An error has occurred!"); }
    this.userDetailsUID = null;
    this.hiddenDetails = true;
    this.selection.clear();
    this.onSubmit();
  }

  async DeleteListOfUsers() {
    this.isLoadingResults = true;
    var sDeleted: Array<string> = new Array<string>();
    var fDeleted: Array<string> = new Array<string>();

    for (const element of this.selection.selected) {
      let delResult = await this._userService.deleteUser(element.uid);

      if (delResult.resultStatus === 'SUCCESS') {
        sDeleted.push(element.cn);
        if (element.inetCos != undefined && element.inetCos != null) {
          let selectedPackage = this._packageService.findSelectedPackage(element.inetCos, this.allPackages);
          this.packageStringList = this._packageService.updatePackageListString(delResult.resultStatus, selectedPackage, this.allPackages, "delete");
          let res;
          res = await this._packageService.modifySunAvailableServices(this.packageStringList);
        }

      } else {
        fDeleted.push(element.cn);
      }
    }

    console.log(sDeleted);
    console.log(fDeleted);
    var SalertString = "Uspesno obrisani korisnici: ";
    for (const iterator of sDeleted) {
      SalertString += iterator + ", ";
    }
    var FalertString = "Neuspesno obrisani korisnici: ";
    for (const iterator of fDeleted) {
      FalertString += iterator + ", ";
    }

    this.isLoadingResults = false;
    window.alert(SalertString + "\n" + FalertString);
    this.userDetailsUID = null;
    this.hiddenDetails = true;
    this.selection.clear();
    this.onSubmit();
  }

  onDeleteButton() {
    if (this.selection.selected.length == 1) {
      this.openDelUserDialog(this.selection.selected[0], null);
    }
    else {
      this.openDelUserDialog(null, this.selection.selected);
    }

  }
  openDelUserDialog(userDel?: ldapSearchData, userList?: Array<ldapSearchData>): void {
    let dialogRef = this.dialog.open(SingleDeleteDialogComponent, {
      data: { userDel: userDel, userList: userList }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.decision) {
        console.log(result);
        if (result.option == 0) { this.DeleteSingleUser(userDel) }
        else { this.DeleteListOfUsers() }

      }
      else {
        console.log(result)
      }
    });
  }

  async onSubmit() {
    this.isLoadingResults = true;
    this.baseDN = "ou=" + this.category + "," + "o=domen1.rs,o=isp";

    if (this.selectedAttribute !== null && this.userForm.value.value !== null) {
      this.filterString = "(" + this.selectedAttribute + "=" + this.userForm.value.value + ")";
    }
    else { this.filterString = "(uid=*)"; }

    var res = await this._userService.asyncGetUser(this.baseDN, this.scope, this.filterString);
    var getData: ldapSearchData[] = [];
    for (const iterator of res.ldapSearch) {
      getData.push(mapJsonUser(iterator));
    }
    this.dataSource = new MatTableDataSource(getData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'Full name': return item.cn;
        case 'E-mail': return item.mail;
      }
    };
    this.dataSource.sort = this.sort;
    this.isLoadingResults = false;
  }

  checkDeleteEnable(): boolean {
    if (this.selection.isEmpty()) {
      return true;
    }
    return false;
  }
  onNotifyClose(hideDetails: boolean): void {
    this.hiddenDetails = hideDetails;
    this.selection.clear();
    this.onSubmit();
  }
}

function mapJsonUser(obj: any): ldapSearchData {
  return {
    uid: obj.uid,
    cn: obj.cn,
    sn: obj.sn,
    mail: obj.mail,
    inetCos: obj.inetCOS,
  }
}
export interface ldapSearchData {
  uid: string;
  cn: string;
  sn: string;
  mail: string;
  inetCos: string;
}

