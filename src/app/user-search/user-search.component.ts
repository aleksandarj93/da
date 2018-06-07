import { Component, OnInit, ViewChild } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';


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

  category =
    [
      { id: "People", name: "People" }
    ];
    selectedValue = null;
  filter = [
    { id: "uid", attribute: "UID" },
    { id: "givenName", attribute: "First Name"},
    { id: "sn", attribute: "Last Name" },
    { id: "mail", attribute: "Mail" }
  ];
  selectedAttribute = null;

  // za tabelu
  hiddenTable: boolean = true;
  hiddenDetails: boolean = true;
  userDetails: any;

  displayedColumns = ['Full name', 'E-mail', 'Options'];
  dataSource: MatTableDataSource<ldapSearchData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _userService: UserServiceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.onSubmit();
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
        console.log(JSON.stringify(data));
        this.userDetails = data.ldapSearch[0];
      });
  }

  onDelete(uid: string) {
    this._userService.deleteUser(uid).subscribe(
      data => {
        var result = JSON.parse(JSON.stringify(data));
        if(result.resultStatus === 'SUCCESS')
        {
          window.alert("User successfully deleted!");
        
        }
        else if (result.resultStatus === 'FAILURE')
        {
          window.alert("Wrong user uid!");
        }
        else { window.alert("An error has occurred!"); }
        this.userDetails = null;
        this.hiddenDetails = true;
        this.onSubmit();
      }
    )
  }


  onSubmit(){
    if(this.selectedValue !== null) {
      this.baseDN ="ou=" + this.selectedValue.id +","+ "o=domen1.rs,o=isp";
    } else { this.baseDN = "o=domen1.rs,o=isp"; } 

    if(this.selectedAttribute !== null && this.userForm.value.value !== null) {
      this.filterString = "(" + this.selectedAttribute.id + "=" + this.userForm.value.value + ")";
    }
    else { this.filterString = "(uid=*)"; }

    this._userService.getUser(this.baseDN, this.scope, this.filterString)
    .subscribe(
      (data: any) => { 
      if (data !== null) { this.hiddenTable = false; } 

      var getData: ldapSearchData[] = [];
        for (let i = 0; i < data.ldapSearch.length; i++) {
          const element = data.ldapSearch[i];
          getData.push(mapJsonUser(data.ldapSearch[i]))
          
        }

      this.dataSource = new MatTableDataSource(getData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
   
  }
}

function mapJsonUser(obj: any):ldapSearchData
{
  return {
    uid: obj.uid,
    cn: obj.cn,
    sn:obj.cn,
    mail: obj.mail,
  }
}

export interface ldapSearchData {
    uid: string;
    cn: string;
    sn:string;
    mail: string;
}
