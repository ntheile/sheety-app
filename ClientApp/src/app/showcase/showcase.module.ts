import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { AuthGuardService } from '../core/auth-guard';
import { ShowcaseComponent } from './showcase.component';


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                pathMatch: 'full',
                component: ShowcaseComponent,
                canActivate: [AuthGuardService]
            }
        ])
    ],
    declarations: [
        ShowcaseComponent
    ],
    exports: [],
    providers: []
})

export class ShowcaseModule { }
