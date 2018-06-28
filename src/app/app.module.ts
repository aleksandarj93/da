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


import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { RouterModule,Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { UserDetailsComponent } from './user-details/user-details.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SingleDeleteDialogComponent } from './dialogs/single-delete-dialog/single-delete-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserSearchComponent,
    LoginComponent,
    UserDetailsComponent,
    NavBarComponent,
    SingleDeleteDialogComponent
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
        path: '', 
        component:UserSearchComponent
      },
      {
        path:'users',
        component:UsersComponent
        // canActivate: [AuthGuard]
      },
      {
        path:'user-search',
        component:UserSearchComponent
        // canActivate: [AuthGuard]
      }
      // {
      //   path: 'login', 
      //   component:LoginComponent
      // }
      // {
      //   path: 'user-details/:uid', component: UserDetailsComponent
      // }
    ])
  ],
  providers: [AuthGuard, AuthService],
  bootstrap: [AppComponent],
  entryComponents: [SingleDeleteDialogComponent]
})
export class AppModule { }
