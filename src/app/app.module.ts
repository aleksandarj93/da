import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import "reflect-metadata";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CdkTableModule} from '@angular/cdk/table';
import {MatButtonModule, MatCheckboxModule, MatSelectModule, MatInputModule, MatTableModule, MatPaginatorModule, } from '@angular/material';
import { AuthGuard } from './auth.guard';


import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { RouterModule,Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserSearchComponent,
    LoginComponent
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
    CdkTableModule,
    MatPaginatorModule,
    RouterModule.forRoot([
      {
        path: '', 
        component:LoginComponent
      },
      {
        path:'users',
        component:UsersComponent,
        canActivate: [AuthGuard]
      },
      {
        path:'user-search',
        component:UserSearchComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'login', 
        component:LoginComponent
      }
    ])
  ],
  providers: [AuthGuard, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
