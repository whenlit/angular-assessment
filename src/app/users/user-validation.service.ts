import {Injectable} from '@angular/core';
import {AsyncValidatorFn, AbstractControl, ValidationErrors, ValidatorFn, FormGroup} from '@angular/forms';
import {UsersService} from './users.service';
import {User} from './user.model';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserValidationService {
  static ERROR_EMAIL_EXISTS = 'emailExists';
  static ERROR_CANNOT_CONTAIN = 'cannotContain';

  constructor(private usersService: UsersService) {}

  /**
   * Async validator that determines whether an email address already exists according
   * to the UsersService.
   */
  existingEmailAddress(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      this.usersService.getUsersByEmailAddress(control.value).pipe(
        map((users: User[]) => users.length > 0 ? {[UserValidationService.ERROR_EMAIL_EXISTS]: true} : null)
      );
  }

  /**
   * Validator that determines if a control value (say, password) contains the values
   * of certain other controls (say, username)
   * @param controlName The name of the control to be checked
   * @param forbiddenControlNames The names of the controls whose values should not be in the main control value
   * @returns a ValidationError entry {cannotContain: true} as well as entries for the field names:
   * {'cannotContain-fieldName': true}, or null.
   */
  cannotContain(controlName: string, ...forbiddenControlNames: string[]): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const controls = (formGroup as FormGroup).controls;

      if (!controls[controlName].value) {
        return null;
      }

      const errors = forbiddenControlNames.filter(
        forbiddenControlName =>
          controls[forbiddenControlName].value && controls[controlName].value.includes(controls[forbiddenControlName].value)
      ).map(
        forbiddenControlName => `${UserValidationService.ERROR_CANNOT_CONTAIN}-${forbiddenControlName}`
      );

      return errors.length > 0
        ? errors.reduce((names, name) => ({...names, [name]: true}), {[UserValidationService.ERROR_CANNOT_CONTAIN]: true})
        : null;
    };
  }
}

