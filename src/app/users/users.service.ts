import {Injectable} from '@angular/core';
import {User} from './user.model';
import {Observable, ObservableInput, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';

const postOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  usersUrl = environment.usersUrl;

  private static handleError(error: HttpErrorResponse): ObservableInput<never> {
    return throwError(`Error in UsersService: ${error.error}`);
  }

  constructor(private http: HttpClient) {}

  addUser(user: User): Observable<User> {
    return this.http.post<JSON>(this.usersUrl, user, postOptions).pipe(
      catchError(UsersService.handleError),
      map<JSON, User>(() => user)
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  getUsersByEmailAddress(emailAddress: string): Observable<User[]> {
    return this.getUsers().pipe(
      map((users: User[]) => users.filter(
        user => user.email === emailAddress)
      )
    );
  }
}
