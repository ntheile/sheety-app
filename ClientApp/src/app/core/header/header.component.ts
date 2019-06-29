import { Component, OnInit, Inject } from '@angular/core';
import { AppServerAuthService } from '../app-server-auth.service';
import { Router } from '@angular/router';
import { DataService } from './../../../services/data.service';
import { AuthProvider } from '../../../drivers/AuthProvider';
import { DomSanitizer } from '@angular/platform-browser';
declare let window: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public displayName;
  public avatar;

  constructor(
    public authService: AppServerAuthService, 
    private router: Router,
    public dataService: DataService,
    @Inject('AuthProvider') public authProvider: AuthProvider,
    public domSanitizer: DomSanitizer,
    ) { }

  ngOnInit() {
    this.init();
  }

  async init(){
    this.displayName = await this.authService.getDisplayName();
    this.avatar = this.domSanitizer.bypassSecurityTrustUrl("https://www.gravatar.com/avatar/00000000000000000000000000000000?d=retro&f=y");
    try{
      let imageAva = window.userSession.loadUserData().profile.image[0].contentUrl;
      this.avatar = this.domSanitizer.bypassSecurityTrustUrl(imageAva);
    } catch(e){ console.log('error getting avatar') }
  }

  logout() {
    //this.authService.logout();
    this.authProvider.logout(null);
  }

  login() {
    //this.authService.login();
    this.authProvider.getUserInfo();
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