import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import "reflect-metadata";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CdkTableModule} from '@angular/cdk/table';
import {MatButtonModule,MatSidenavModule, MatSelectModule, MatInputModule, MatListModule, MatMenuModule, MatDialogModule, MatButtonToggleModule, MatProgressSpinnerModule,
  MatTableModule, MatPaginatorModule, MatCardModule, MatStepperModule, MatExpansionModule, MatToolbarModule, MatIconModule, MatCheckboxModule, MatSortModule } from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import { AuthGuard } from './auth.guard';


import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { RouterModule,Routes } from '@angular/router';
import { UserDetailsComponent } from './user-details/user-details.component';
import { SingleDeleteDialogComponent } from './dialogs/single-delete-dialog/single-delete-dialog.component';
import { UserModifyDialogComponent } from './dialogs/user-modify-dialog/user-modify-dialog.component';
import { DomainsComponent } from './domains/domains.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserSearchComponent,
    UserDetailsComponent,
    SingleDeleteDialogComponent,
    UserModifyDialogComponent,
    DomainsComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    CdkTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatCardModule,
    MatStepperModule,
    MatExpansionModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    RouterModule.forRoot([
      {
        path: '', pathMatch: 'full',  redirectTo: 'domains'
        // component:UserSearchComponent
      },
      {
        path: 'domains',
        component:DomainsComponent,
        canActivate: [AuthGuard]
      },
      {
        path:'users',
        component:UsersComponent
      },
      {
        path:'user-search/:id',
        component:UserSearchComponent
        // canActivate: [AuthGuard]
      }
    ]),
    
  ],
  providers: [AuthGuard, CookieService ],
  bootstrap: [AppComponent],
  entryComponents: [SingleDeleteDialogComponent, UserModifyDialogComponent]
})
export class AppModule { }
