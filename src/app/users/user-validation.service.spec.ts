import {TestBed} from '@angular/core/testing';

import {UserValidationService} from './user-validation.service';
import {UsersService} from './users.service';
import {Observable, of} from 'rxjs';
import {User} from './user.model';
import {AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

class UsersServiceStub {
  getUsersByEmailAddress(emailAddress: string): Observable<User[]> {
    if (emailAddress === 'existing@example.com') {
      return of([
        {firstName: 'Existing', lastName: 'Address', email: 'existing@example.com'}
      ]);
    }
    return of([]);
  }
}

describe('UserValidationService', () => {
  let service: UserValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: UsersService, useClass: UsersServiceStub},
        UserValidationService
      ]
    });

    service = TestBed.inject(UserValidationService);
  });

  describe('existingEmailAddress validator', () => {
    let validator: AsyncValidatorFn;
    let emailControl: FormControl;

    beforeEach(() => {
      validator = service.existingEmailAddress();
      emailControl = new FormControl();
    });

    it ('returns no errors when the email address is empty', () => {
      return (validator(emailControl) as Observable<ValidationErrors | null>).subscribe(
        errors => expect(errors).toBe(null),
        fail
      );
    });

    it ('returns an error when a user with the specified email address is found in the UsersService', () => {
      emailControl.setValue('existing@example.com');

      return (validator(emailControl) as Observable<ValidationErrors | null>).subscribe(
        errors => expect(errors).toEqual({emailExists: true}),
        fail
      );
    });

    it ('returns false when a user with the specified email address is not found in the UsersService', () => {
      emailControl.setValue('not.existing@example.com');

      return (validator(emailControl) as Observable<ValidationErrors | null>).subscribe(
        errors => expect(errors).toBe(null),
        fail
      );
    });
  });

  describe('cannotContain validator', () => {
    let validator: ValidatorFn;
    let main: FormControl;
    let sub1: FormControl;
    let sub2: FormControl;
    let formGroup: FormGroup;

    beforeEach(() => {
      validator = service.cannotContain('main', 'sub1', 'sub2');

      main = new FormControl();
      sub1 = new FormControl();
      sub2 = new FormControl();

      formGroup = new FormGroup({
        main,
        sub1,
        sub2
      });
    });

    it('is happy when everything is empty', () => {
      expect(validator(formGroup)).toBe(null);
    });

    it('is happy when no illegal stuff is found in the main control', () => {
      main.setValue('abcdef');
      expect(validator(formGroup)).toBe(null);
    });

    it('reports the sub1 control when the main control contains its value', () => {
      main.setValue('abcdef');
      sub1.setValue('cde');
      expect(validator(formGroup)).toEqual({cannotContain: true, 'cannotContain-sub1': true});
    });

    it('reports the sub2 control when the main control contains its value', () => {
      main.setValue('abcdef');
      sub2.setValue('abc');
      expect(validator(formGroup)).toEqual({cannotContain: true, 'cannotContain-sub2': true});
    });

    it('reports both controls when the main control contains both values', () => {
      main.setValue('abcdef');
      sub1.setValue('cde');
      sub2.setValue('abc');
      expect(validator(formGroup)).toEqual({cannotContain: true, 'cannotContain-sub1': true, 'cannotContain-sub2': true});
    });
  });
});
