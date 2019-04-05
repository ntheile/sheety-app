import { CommonModule } from "@angular/common";
import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from "@angular/core";
import { throwIfAlreadyLoaded } from "./module-import-guard";

import { SharedModule } from "../shared/shared.module";
import { FacetComponent } from "./../facet/facet.component";
import { AppServerAuthService } from "./app-server-auth.service";
import { FooterComponent } from "./footer/footer.component";
import { ForbiddenComponent } from "./forbidden/forbidden.component";
import { HeaderComponent } from "./header/header.component";
import { HomeComponent } from "./home/home.component";
import { LoggedOutComponent } from "./loggedout/loggedout.component";

@NgModule({
    imports: [
        SharedModule,
    ],
    exports: [
        HomeComponent,
        FooterComponent,
        HeaderComponent,
        ForbiddenComponent,
        LoggedOutComponent,
        FacetComponent,
    ],
    declarations: [
        HomeComponent,
        FooterComponent,
        HeaderComponent,
        ForbiddenComponent,
        LoggedOutComponent,
        FacetComponent,
    ],
    providers: [
        AppServerAuthService,
        {
            provide: APP_INITIALIZER,
            useFactory: startup,
            multi: true,
            deps: [AppServerAuthService],
        },
    ],
})
export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, "CoreModule");
    }
}

export function startup(authService: AppServerAuthService): () => Promise<any> {
    return (): Promise<void> => {
        return authService.getUserInfo();
    };
}
