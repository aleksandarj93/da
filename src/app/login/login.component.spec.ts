import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatButtonModule, MatCheckboxModule, MatSelectModule, MatInputModule, 
  MatTableModule, MatPaginatorModule, MatCardModule, MatStepperModule, MatExpansionModule,MatTabsModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { LoginComponent } from './login.component';
import { UserServiceService } from '../user-service.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ BrowserAnimationsModule, RouterTestingModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatCheckboxModule, MatSelectModule, MatInputModule, MatTableModule, 
        MatPaginatorModule, MatCardModule, MatStepperModule, MatExpansionModule, MatTabsModule ],
        providers: [UserServiceService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
