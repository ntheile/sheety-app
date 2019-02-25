import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppServerAuthService } from '../app-server-auth.service';



@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
})
export class ForbiddenComponent {

  constructor(private authService: AppServerAuthService) {
  }

  login() {
   this.authService.login();
  }
}
