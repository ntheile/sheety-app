import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { AuthGuardService } from '../core/auth-guard';
import { TodoComponent } from './todo.component';
import { TodoService } from './todo.service';


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                pathMatch: 'full',
                component: TodoComponent,
                canActivate: [AuthGuardService]
            }
        ])
    ],
    declarations: [
        TodoComponent
    ],
    exports: [],
    providers: [
        TodoService
    ]
})

export class TodoModule { }
