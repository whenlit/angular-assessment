import {ComponentFixture, TestBed} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {of} from 'rxjs';
import {User} from './users/user.model';
import {UsersService} from './users/users.service';
import {UserValidationService} from './users/user-validation.service';
import {ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

const user = {firstName: 'fn', lastName: 'ln', email: 'valid@example.com'} as User;

class UsersServiceStub {
  addUser = jasmine.createSpy().and.returnValue(of(user));
  getUsers = jasmine.createSpy();
}

describe('AppComponent', () => {
  let usersService: UsersService;
  let userValidationService: UserValidationService;

  let fixture: ComponentFixture<AppComponent>;
  let element: DebugElement;
  let app: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        AppComponent
      ],
      providers: [
        {provide: UsersService, useClass: UsersServiceStub},
        UserValidationService
      ]
    }).compileComponents();

    usersService = TestBed.inject(UsersService);

    userValidationService = TestBed.inject(UserValidationService);
    spyOn(userValidationService, 'existingEmailAddress');
    spyOn(userValidationService, 'cannotContain');

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    app = fixture.componentInstance;
    element = fixture.debugElement;
  });

  it ('can submit the form', () => {
    app.signupForm.setValue({...user, password: 'validPASSWORD'});

    element.query(By.css('form')).triggerEventHandler('submit', null);

    expect(usersService.addUser).toHaveBeenCalledWith(user);
    expect(app.result).toEqual({title: 'Yay!', user});
  });

  it ('will not submit the form if it is not valid, which should not happen ever', () => {
    app.signupForm.setValue({...user, password: 'invalidpassword'});

    element.query(By.css('form')).triggerEventHandler('submit', null);

    expect(usersService.addUser).not.toHaveBeenCalled();
  });
});
