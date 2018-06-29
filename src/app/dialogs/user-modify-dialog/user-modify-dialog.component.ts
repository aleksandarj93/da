import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-user-modify-dialog',
  templateUrl: './user-modify-dialog.component.html',
  styleUrls: ['./user-modify-dialog.component.css']
})
export class UserModifyDialogComponent {

  constructor(public dialogRef: MatDialogRef<UserModifyDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
