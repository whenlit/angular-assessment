# AngularAssessment

This is an implementation of a signup form. Everything was kept as vanilla as possible.

Some remarks:
- Because email validation is a main point, and I consider the Angular email validation sufficient for the
 front end (depending on the use case), I added an asynchronous validator that checks whether an email address 
 has already been registered on the server. Try "johndoe@gmail.com" as email, it will complain and present a 
 bogus login link.
- There are no protractor tests; don't worry, I am quite proficient if I do say so myself,
but unfortunately I don't have the time, especially since I would want to mock out the server
and I don't want to add extra dependencies right now. There must be
a good solution for this by now, I suppose, but i didn't find it in a minute of 
Googling.
- Although unit test coverage is now 100%, I do realize that there is not enough testing,
especially of the main component validation. I think I would prefer to do that with an e2e 
testing tool like Protractor (possibly with Cucumber), but see above.
- To do: more elegant user feedback after form submission.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
