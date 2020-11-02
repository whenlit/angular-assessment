import {Component, OnDestroy} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserValidationService} from './users/user-validation.service';
import {UsersService} from './users/users.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {User} from './users/user.model';

@Component({
  selector: 'aa-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  private destroy$ = new Subject();

  signupForm: FormGroup;
  result: {title: string, user: User} | null = null;

  constructor(private userValidationService: UserValidationService, private usersService: UsersService) {
    this.signupForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ], this.userValidationService.existingEmailAddress()),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[A-Z]/)
      ]),
    }, {
      validators: userValidationService.cannotContain('password', 'firstName', 'lastName')
    });
  }

  get firstNameControl(): AbstractControl {
    return this.signupForm.get('firstName') as AbstractControl;
  }

  get lastNameControl(): AbstractControl {
    return this.signupForm.get('lastName') as AbstractControl;
  }

  get emailControl(): AbstractControl {
    return this.signupForm.get('email') as AbstractControl;
  }

  get passwordControl(): AbstractControl {
    return this.signupForm.get('password') as AbstractControl;
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.usersService.addUser({
        firstName: this.firstNameControl.value,
        lastName: this.lastNameControl.value,
        email: this.emailControl.value
      }).pipe(
        takeUntil(this.destroy$)
      ).subscribe((user) => {
        this.userAdded(user);
      });
    }
  }

  userAdded(user: User): void {
    this.result = {
      title: 'Yay!',
      user
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
