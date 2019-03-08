import { HttpClientModule } from '@angular/common/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MediaMatcher } from '@angular/cdk/layout';
import { ApplicationInsightsModule, AppInsightsService } from '@markpieszak/ng-application-insights';
import { Environment } from '../environments/environment';

import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AuthGuardService } from './core/auth-guard';
import { SharedModule } from './shared/shared.module';


import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ApplicationInsightsModule.forRoot({
      instrumentationKey: Environment.Application_Insights_Id
    }),
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    HttpClientModule,    
    CoreModule,
    SharedModule,
    AppRoutingModule,
  ],
  providers: [
    AppInsightsService,
    AuthGuardService,
    MediaMatcher
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
