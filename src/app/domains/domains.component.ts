import { Component, OnInit, ViewChild } from '@angular/core';
import { DomainService } from '../domain.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.css']
})
export class DomainsComponent implements OnInit {
  baseDN: string = "o=isp"; 
  scope: string = 'SUB';
  filterString: string = "(sunpreferreddomain=*)";
  isLoadingResults = true;

  displayedColumns = ['select', 'Name', 'Domain name', 'Domain status', 'Number of users'];
  dataSource: MatTableDataSource<ldapSearchDomainData>;
  selection = new SelectionModel<ldapSearchDomainData>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _domainService: DomainService, public dialog: MatDialog) { }

  async ngOnInit() {
    this.getDomainData();
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

  async getDomainData() {
    this.isLoadingResults = true;

    var res = await this._domainService.asyncGetDomain(this.baseDN, this.scope, this.filterString);
    var getData: ldapSearchDomainData[] = [];
    for (const iterator of res.ldapSearch) {
      getData.push(mapJsonDomain(iterator));
    }
    this.dataSource = new MatTableDataSource(getData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'Name': return item.o;
        case 'Number of users': return item.sunNumUsers;
      }
    };
    this.dataSource.sort = this.sort;
    this.isLoadingResults = false;

  }

}

function mapJsonDomain(obj: any): ldapSearchDomainData {
  return {
    o: obj.o,
    sunPreferredDomain: obj.sunPreferredDomain,
    inetDomainStatus: obj.inetDomainStatus,
    sunNumUsers: obj.sunNumUsers,
  }
}
export interface ldapSearchDomainData {
  o: string; // name
  sunPreferredDomain: string; // domain name
  inetDomainStatus: string; // status
  sunNumUsers: string; // number of users

}
