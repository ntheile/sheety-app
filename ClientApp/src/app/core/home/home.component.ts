import { Component } from '@angular/core';

import { Environment } from '../../../environments/environment';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
})
export class HomeComponent {
    public app_id: string;

    constructor() {
        this.app_id = Environment.Application_Id;
    }
}
