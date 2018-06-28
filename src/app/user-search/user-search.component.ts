import { Component, OnInit, ViewChild } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SingleDeleteDialogComponent } from '../dialogs/single-delete-dialog/single-delete-dialog.component';


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
  hiddenTable: boolean = true;
  hiddenDetails: boolean = true;
  userDetails: any;

  displayedColumns = ['select', 'Full name', 'E-mail', 'Options'];
  dataSource: MatTableDataSource<ldapSearchData>;
  selection = new SelectionModel<ldapSearchData>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _userService: UserServiceService, public dialog: MatDialog) { }

  ngOnInit() {
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
    this.hiddenDetails = false;
    // this.router.navigate(['user-details', uid]);
    const filter = "(uid=" + uid + ")";
    this._userService.getUser("o=domen1.rs,o=isp", "SUB", filter).subscribe(
      data => {
        this.userDetails = data.ldapSearch[0];
      });
  }

  DeleteSingleUser(uid: string) {
    this._userService.deleteUser(uid).subscribe(
      data => {
        var result = JSON.parse(JSON.stringify(data));
        if (result.resultStatus === 'SUCCESS') {
          window.alert("User successfully deleted!");
        }
        else if (result.resultStatus === 'FAILURE') {
          window.alert("Wrong user uid!");
        }
        else { window.alert("An error has occurred!"); }
        this.userDetails = null;
        this.hiddenDetails = true;
        this.selection.clear();
        this.onSubmit();
      }
    )
  }
  DeleteListOfUsers() {
    var sDeleted: Array<string> = new Array<string>();
    var fDeleted: Array<string> = new Array<string>();

    this.selection.selected.forEach(element => {
      this._userService.deleteUser(element.uid).subscribe(
        data => { 
          var result = JSON.parse(JSON.stringify(data));
          if (result.resultStatus === 'SUCCESS') {
            sDeleted.push(element.cn);
          } else {
            fDeleted.push(element.cn);
          }
        }
      )
    });
    setTimeout(()=>
  { 
    window.alert("Uspesno obrisani korisnici!");
    this.userDetails = null;
    this.hiddenDetails = true;
    this.selection.clear();
    this.onSubmit();
  }, 2000)

  }

  onDeleteListOfUsers() {
    if(this.selection.selected.length == 1) {
      this.openDelUserDialog(this.selection.selected[0].uid, null);
    }
    else {
      this.openDelUserDialog(null, this.selection.selected);
    }

  }
  openDelUserDialog(uid?: string, userList?: Array<ldapSearchData>): void {
    let dialogRef = this.dialog.open(SingleDeleteDialogComponent, {
      data: { uid: uid, userList: userList }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.decision) { 
         console.log(result);
         if(result.option == 0) { this.DeleteSingleUser(uid) }
         else { this.DeleteListOfUsers() } 
         
      }
      else { 
        console.log(result) 
      }
    });
  }

  onSubmit() {
    this.baseDN = "ou=" + this.category + "," + "o=domen1.rs,o=isp";

    if (this.selectedAttribute !== null && this.userForm.value.value !== null) {
      this.filterString = "(" + this.selectedAttribute + "=" + this.userForm.value.value + ")";
    }
    else { this.filterString = "(uid=*)"; }

    this._userService.getUser(this.baseDN, this.scope, this.filterString)
      .subscribe(
        (data: any) => {
          if (data !== null) { this.hiddenTable = false; }

          var getData: ldapSearchData[] = [];
          for (let i = 0; i < data.ldapSearch.length; i++) {
            getData.push(mapJsonUser(data.ldapSearch[i]))
          }
          this.dataSource = new MatTableDataSource(getData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
  }



  checkDeleteEnable(): boolean {
    if (this.selection.isEmpty()) {
      return true;
    } 
    return false;
  }
  onNotifyClose(hideDetails: boolean): void {
    this.hiddenDetails = hideDetails;
  }

}

function mapJsonUser(obj: any): ldapSearchData {
  return {
    uid: obj.uid,
    cn: obj.cn,
    sn: obj.cn,
    mail: obj.mail,
  }
}
export interface ldapSearchData {
  uid: string;
  cn: string;
  sn: string;
  mail: string;
}

