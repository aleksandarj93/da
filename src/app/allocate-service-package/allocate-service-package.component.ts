import { Component, OnInit, ViewChild } from '@angular/core';
import { DomainService } from '../services/domain.service';
import { Package } from '../shared/package.model';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-allocate-service-package',
  templateUrl: './allocate-service-package.component.html',
  styleUrls: ['./allocate-service-package.component.css']
})
export class AllocateServicePackageComponent implements OnInit {

  constructor(private _domainService: DomainService, private _sharedService: SharedService) { 
    
  }

  displayedColumns = ['select', 'Name', 'Allocated'];
  dataSource: MatTableDataSource<Package>;
  selection = new SelectionModel<Package>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  allPackages: Array<Package> = new Array<Package>();

  async ngOnInit() {
    this.getAllPackages();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
      this._sharedService.changeSelectedPackage(this.selection.selected);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  updatelist(row) {
    this.selection.toggle(row);
    this._sharedService.changeSelectedPackage(this.selection.selected);
  }

  async getAllPackages() {
    var mailCalandaruser = await this._domainService.asyncGetMailCalendarUser();
    var mailUser = await this._domainService.asyncGetMailUser();

    for (let i = 0; i < mailCalandaruser.ldapSearch.length; i++) {
      const element = mailCalandaruser.ldapSearch[i];
      let p = new Package();
      p.name = element.cn;
      this.allPackages.push(p);
    }

    for (let i = 0; i < mailUser.ldapSearch.length; i++) {
      const element = mailUser.ldapSearch[i];
      let p = new Package();
      p.name = element.cn;
      this.allPackages.push(p);
    }

    this.dataSource = new MatTableDataSource(this.allPackages);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'Name': return item.name;
      }
    };
    this.dataSource.sort = this.sort;

  }


}
