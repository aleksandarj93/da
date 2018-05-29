import { TestBed, async, inject } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';


import { AuthGuard } from './auth.guard';
import { UserServiceService } from './user-service.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, UserServiceService],
      imports: [ RouterTestingModule, BrowserAnimationsModule ]
      
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
