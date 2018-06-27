import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-single-delete-dialog',
  templateUrl: './single-delete-dialog.component.html',
  styleUrls: ['./single-delete-dialog.component.css']
})
export class SingleDeleteDialogComponent {

  uid: string;
  userList: any;
  option;

  constructor(public dialogRef: MatDialogRef<SingleDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {this.uid = data.uid; this.userList = data.userList
    console.log(this.uid); console.log(this.userList) }

 

  onYesClick(): void {
    if(this.uid != null && this.userList == null) {this.option = Option.single } else { this.option = Option.list }
    this.dialogRef.close({option: this.option, decision: true});
  }

  onNoClick(): void {
    this.dialogRef.close({option: this.option, decision: false});
  }



}

enum Option {
  single, // 0 - brise se 1 user
  list // 1 - poslata je lista usera za brisanje
}
