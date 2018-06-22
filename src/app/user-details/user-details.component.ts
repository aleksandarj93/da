import { Component, OnInit, Input, EventEmitter, Output, AfterContentInit, DoCheck } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UserServiceService } from '../user-service.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  @Input() user: any;
  @Output() notifyClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  // userInformation = new FormGroup({
  //   uid: new FormControl(),
  //   firstName: new FormControl(),
  //   lastName: new FormControl(),
  //   inetUserStatus: new FormControl()

  // });

  constructor(private _userService: UserServiceService, public dialog: MatDialog) { }

  ngOnInit() {
  }

  onClose() {
    this.notifyClose.emit(true);
  }

  onModify() {
    console.log(JSON.stringify(this.user))
  }

}
