import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { UserDetailsComponent } from './user-details.component';
import {MatButtonModule, MatCheckboxModule, MatSelectModule, MatInputModule, 
  MatTableModule, MatPaginatorModule, MatCardModule, MatStepperModule, MatExpansionModule,MatTabsModule } from '@angular/material';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserServiceService } from '../user-service.service';
import {RouterTestingModule} from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDetailsComponent ],
      imports: [ BrowserAnimationsModule, RouterTestingModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatCheckboxModule, MatSelectModule, MatInputModule, MatTableModule, 
        MatPaginatorModule, MatCardModule, MatStepperModule, MatExpansionModule, MatTabsModule ],
        providers: [UserServiceService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
