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
  ],
  providers: [
    AppInsightsService,
    AuthGuardService,
    MediaMatcher,
    SidenavService,
    {provide: 'StorageProvider', useClass: Environment.StorageProvider}
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
