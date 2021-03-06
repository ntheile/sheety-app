import { Component, OnInit, Inject } from '@angular/core';
import { AppServerAuthService } from '../app-server-auth.service';
import { Router } from '@angular/router';
import { DataService } from './../../../services/data.service';
import { AuthProvider } from '../../../drivers/AuthProvider';
import { DomSanitizer } from '@angular/platform-browser';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SpinnerState } from '../../spinner/spinner.state';
import { ToggleShow, ToggleHide } from '../../spinner/spinner.actions';
declare let window: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public displayName;
  public avatar;
  @Select(SpinnerState) loading: Observable<boolean>;

  constructor(
    public authService: AppServerAuthService, 
    private router: Router,
    public dataService: DataService,
    @Inject('AuthProvider') public authProvider: AuthProvider,
    public domSanitizer: DomSanitizer,
    private store: Store,
    ) { }

  ngOnInit() {
    this.init();
  }

  async init(){
    this.Loading();
    this.displayName = await this.authService.getDisplayName();
    this.avatar = "./../../../assets/placeuser.png";
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

  Loading() {
    this.store.dispatch(new ToggleShow("spinner"));
  }

  NotLoading() {
    this.store.dispatch(new ToggleHide("spinner"));
  }

}