import { Component, OnInit } from '@angular/core';
import { AppServerAuthService } from '../app-server-auth.service';
import { Router } from '@angular/router';
import { DataService } from './../../../services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public displayName: string;

  constructor(
    public authService: AppServerAuthService, 
    private router: Router,
    public dataService: DataService
    ) { }

  ngOnInit() {
    this.displayName = this.authService.getDisplayName();
  }

  logout() {
    this.authService.logout();
  }

  login() {
    this.authService.login();
  }

  go(route){
    this.router.navigate([route]);
  }

  getApiUrl(){
    return this.dataService.getDataUrl();
  }

  goApi(){
    location.replace(this.getApiUrl());
  }
}