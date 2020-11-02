import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {TestBed} from '@angular/core/testing';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {UsersService} from './users.service';
import {User} from './user.model';

describe('UsersService', () => {
  let service: UsersService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let allUsers: User[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    allUsers = [
      {firstName: 'pietje', lastName: 'puk', email: 'pietje@example.com'},
      {firstName: 'jantje', lastName: 'beton', email: 'jantje@example.com'},
      {firstName: 'hansje', lastName: 'brinker', email: 'hansje@example.com'}
    ];

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UsersService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('getting data', () => {

    it('can fetch all users', () => {
      service.getUsers().subscribe(
        users => expect(users).toEqual(allUsers),
        fail
      );

      const req = httpTestingController.expectOne(service.usersUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(allUsers);
    });

    it ('can fetch all users with a specified email address', () => {
      service.getUsersByEmailAddress('hansje@example.com').subscribe(
        users => expect(users).toEqual([allUsers[2]]),
        fail
      );

      const req = httpTestingController.expectOne(service.usersUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(allUsers);
    });
  });

  describe('adding a new user', () => {
    it ('can add a new user', () => {
      const pietje = allUsers[0];
      service.addUser(pietje).subscribe(
        user => expect(user).toEqual(pietje),
        fail
      );

      const req = httpTestingController.expectOne(service.usersUrl);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(pietje);

      const expectedResponse = new HttpResponse({ status: 200, body: '' });
      req.event(expectedResponse);
    });

    it ('will rethrow an error', () => {
      const pietje = allUsers[0];
      service.addUser(pietje).subscribe(
        fail,
        error => expect(error).toEqual('Error in UsersService: <h1>An error occurred</h1>')
      );

      const req = httpTestingController.expectOne(service.usersUrl);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(pietje);

      req.flush('<h1>An error occurred</h1>', { status: 400, statusText: 'Bad request' });
    });
  });
});
