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
import { ThingContainerComponent } from './../thing/thing-container.component';
import { ThingListComponent } from './../thing/thing-list/thing-list.component';
import { ThingItemComponent } from './../thing/thing-item/thing-item.component';
import { ThingPropertiesComponent } from './../thing/thing-properties/thing-properties.component';
import { ThingCategoryComponent } from './../thing/thing-category/thing-category.component';


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
        ThingContainerComponent,
        ThingListComponent,
        ThingItemComponent,
        ThingPropertiesComponent,
        ThingCategoryComponent
    ],
    declarations: [
        HomeComponent,
        FooterComponent,
        HeaderComponent,
        ForbiddenComponent,
        LoggedOutComponent,
        FacetComponent,
        ThingContainerComponent,
        ThingListComponent,
        ThingItemComponent,
        ThingPropertiesComponent,
        ThingCategoryComponent
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
