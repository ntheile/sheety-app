import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppServerAuthService } from '../app-server-auth.service';

@Component({
    selector: 'app-loggedout',
    templateUrl: './loggedout.component.html',
})
export class LoggedOutComponent {

    constructor(private authService: AppServerAuthService) { }

    login() {
        this.authService.login();
    }
}
