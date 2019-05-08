import { Component, OnInit } from '@angular/core';
import { AppServerAuthService } from '../app-server-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public displayName: string;

  constructor(public authService: AppServerAuthService, private router: Router,) { }

  ngOnInit() {
    this.displayName = this.authService.getDisplayName();
  }

  logout() {
    this.authService.logout();
  }

  login() {
    this.authService.login();
  }

  goHome(){
    this.router.navigate(["/"]);
  }
}