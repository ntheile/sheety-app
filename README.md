# DOW-CDMC `ng-template`

Welcome to the CDMC Angular Template! This template consists of an Angular-CLI (Angular 5) project and a .NET Core 2.0 backend. There is a version that runs on .NET Core and a version that runs on full framework.

## Benefits of using the template

- Implements entire authentication flow, using cookie auth to authenticate to the Azure endpoint.
- Contains `@cdmc/logging` package, which automatically logs user and performance telemetry to Application Insights.
- Contains integrated Dow custom color template for Angular Material. [Notes](#using-the-dow-ui-template)
- Includes the Karma/Jasmine unit testing framework out of the box!

## Template Notes

### Using the Dow UI Template

The Dow Angular Material template consists of the following files:

```none
src
  ├─ app                                        * Folder contains Angular app files
  |
  ├─ assets                                     * Folder contains Dow branding images
  |  ├─ dow-logo.png                            * Default Dow logo
  |  ├─ dow-logo-white.png                      * Dow logo for dark backgrounds
  |  └─ ...
  |
  └─ styles
     ├─ dow-theme                               * Folder contains custom color themes and components for Dow
     |  ├─ custom-components                    * Folder contains Dow stylings for components
     |  |  ├─ _document.body.theme.scss         * Styling for body
     |  |  └─ _toolbar.component.theme.scss     * Styling for toolbar
     |  |
     |  ├─ dow-color-palette.scss               * Contains Dow's custom color palette
     |  └─ dow-custom-component-themes.scss     * Lists files in custom-components folder
     |
     ├─ styles.css                              * CSS styling for overall application
     ├─ theme.scss                              * Overwrites Angular Material styling with Dow styling
     └─ ...
```

The template will be applied over your html by default. Look at `showcase.component.html` to see the template in use.

## Detailed Instructions

### Update appsettings

In `appsettings.*json`:

1. Set `Application_Id` and `Client_Secret`.
   > These parameters are like the username and password of your application, which it presents to the authentication endpoint (Azure) when requesting an access token. Your application must be registered in Azure to set these parameters. In Azure, find your application under App Registrations, then go to All settings.
   - Get the `Application_Id` by continuing on to Properties in Azure. Copy the Application ID into the `appsettings.json` file.
   - Get the `Client_Secret` by continuing on to Keys in Azure, copy the password key. In Visual Studio, right click on the project name in Solution Explorer, select Manage User Secrets. Copy the following into the `secrets.json` file that opens:

   ```json
   {
       "Environment": {
           "Client_Secret": "your-client-secret-from-Azure"
       }
   }
   ```

1. Set Redirect Uri(s).
   > The `Redirect_Uri` is the page that the authentication endpoint (Azure) returns the user's browser to after signin. The `Post_Logout_Redirect_Uri` is the page the user's browser is directed to after signing out from the authentication endpoint.
   - Set `Redirect_Uri` to be the base uri of the application, e.g. `https://localhost:44315/`. Make sure to add the uri to your application's list of accepted redirect uris in Azure.
   - Set `Post_Logout_Redirect_Uri` to be a route in your application that is displayed on logout, e.g. `https://localhost:44315/logout`.
   - In Startup.cs, include the `Post_Logout_Redirect_Uri` route name in the AnonymousRoutes array (this ensures no errors will appear when the user is signed out and on that page). 

1. Set `Api_Resource_Uri`.
   > The `Api_Resource_Uri` is the ID of a protected API that your application wants to access. Your application requests an access token from the authentication endpoint (Azure) to access the API. In Azure, find your application under App Registrations, then go to All settings.
   - Get the `Api_Resource_Uri` by continuing on to Properties in Azure. Copy the `App ID URI` from Azure into appsettings.json.

1. Set `Api_Uri`.
   > The `Api_Uri` is the uri your application uses to call the actual API.

1. Set Application Insights Id.
   > This ID links your application to an instance of Application Insights in Azure. Ask DevOps to create an App Insights for your project if it's not already created.
   - Copy the id from Azure portal >> your application insights instance >> Properties >> Instrumentation Key. Copy into `Application_Insights_Id` in appsettings.json.

----

## Run the Application

You can run the application either from Visual Studios or from the command line. We recommend using Visual Studio to run, because Visual Studio stipulates in `launchSettings.json` that the browser launches in a port that Azure recognizes during login.

### From Visual Studio

- Open project. Press play (hit f5) -- application may take a minute before launching in browser for the first time due to downloading packages and dependencies.

### From Powershell

- Run `dotnet restore` at the project root.
- CD into `ClientApp\` and run npm install.
- Set your environment variable by running:
  ```powershell
  # Powershell
  $Env:ASPNETCORE_ENVIRONMENT = "Development"
  ```
- At the project root folder, run `dotnet run`
  > You may need to add the port the browser launches on to Azure as a recognized uri.

### Notes on Full Framework Version

- There is another branch named target-fw-462 that has the full framework version of the project. You will need to install this dev pack to run it: https://www.microsoft.com/en-us/download/details.aspx?id=53321

----

## Debugging

### `Cannot GET /` error

Delete the node_modules folder within ClientApp, then run `npm install` from the ClientApp folder.

----

## Code scaffolding

Run `ng generate component component-name` to generate a new component.
> You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Testing and Testing Guidelines

Reading the [official documentation](https://angular.io/guide/testing) on unit testing with Angular is highly encouraged.

### Tools Used

1. [TypeScript](https://www.typescriptlang.org/docs/tutorial.html)
1. [Jasmine: A unit-testing framework](https://jasmine.github.io/)
1. [Karma: A unit test runner](https://karma-runner.github.io/1.0/index.html)
1. [PhantomJS: A headless browser](http://phantomjs.org/)
1. [Angular](https://angular.io/docs/ts/latest/)

Jasmine test files are identified by `*.spec.ts` file endings.
The Karma test runner is configured to execute any tests found in .spec files.

Its reccomended to keep `.spec` files in the same folder as the application source files that they test.

### What to Test

Most Applications can be split into a Data Access layer, a Business Logic Layer, and a Presentation Layer.

1. Code that interacts with an external API
   - Angular Data/API Services
   - Data Mapping/Manipulation Services
   - Error Handling Services

1. Code that is shared across application components
   - General utility functions
   - Shared Angular Services
   - Shared Angular Directives/Pipes

1. UI/View Components
   - Angular Component Logic
   - Form Save/Cancel UI states
   - Custom Form/Input validators
   - Route Parameter Handling

### Unit-Testing with Jasmine

Jasmine has two main building blocks

1. Suites : indicated by 'describe'
1. Specs  : indicated by 'it'

Suites describe what behavior is being tested.
Specs perform assertions that test for expected conditions.

```typescript
describe("A describe function marks the start of a test suite", function() {
  var a;

  it("A it funcion marks so is a spec", function() {
    a = true;

    expect(a).toBe(true);
  });
});
```

### Writing Unit Tests with Jasmine and Angular

In general, writing unit-tests becomes more involved as you move from Data Access Layer -> Presentation Layer.

Tests involving Angular Components require more help from Angular Testing utilities, whereas lower level services do not.

The more dependencies the code under test has, the more difficult it is to write unit tests around it.

Leveraging Angular's Dependency Injection to inject mock/fake services when testing is critical.

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Contribute

[Consider contributing to the ng-template & generator](https://github.com/ChicagoDMC/generator-ng/wiki/Contributing-to-CDMC-generator)