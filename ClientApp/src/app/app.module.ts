import { MediaMatcher } from "@angular/cdk/layout";
import { HttpClientModule } from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppInsightsService, ApplicationInsightsModule } from "@markpieszak/ng-application-insights";
import { Environment } from "../environments/environment";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";

import { AuthGuardService } from "./core/auth-guard";
import { SharedModule } from "./shared/shared.module";
import "hammerjs";
import { SidenavService } from "./sidenav.service";

import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { SpinnerState, SpinnerState2 } from './spinner/spinner.state';
import { SheetyappState } from "./sheetyapp/sheetyapp.state";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    ApplicationInsightsModule.forRoot({
      instrumentationKey: Environment.Application_Insights_Id,
    }),
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    BrowserAnimationsModule,
    HttpClientModule,    
    CoreModule,
    SharedModule,
    AppRoutingModule,
    NgxsModule.forRoot([
      SpinnerState,
      SpinnerState2,
      SheetyappState
    ]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
  ],
  providers: [
    AppInsightsService,
    AuthGuardService,
    MediaMatcher,
    SidenavService,
    {provide: 'StorageProvider', useClass: Environment.StorageProvider},
    {provide: 'AuthProvider', useClass: Environment.AuthProvider},
    {provide: 'ModelProvider', useClass: Environment.ModelProvider}
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
