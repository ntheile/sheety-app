import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-guard';

import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { LoggedOutComponent } from './loggedout/loggedout.component';
import { AppServerAuthService } from './app-server-auth.service';


@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        HomeComponent,
        FooterComponent,
        HeaderComponent,
        ForbiddenComponent,
        LoggedOutComponent,
    ],
    declarations: [
        HomeComponent,
        FooterComponent,
        HeaderComponent,
        ForbiddenComponent,
        LoggedOutComponent,
    ],
    providers: [
        AppServerAuthService,
        {
            provide: APP_INITIALIZER,
            useFactory: startup,
            multi: true,
            deps: [AppServerAuthService]
        },
    ]
})
export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}

export function startup(authService: AppServerAuthService): () => Promise<any> {
    return (): Promise<void> => {
        return authService.getUserInfo();
    };
}
