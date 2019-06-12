import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppServerAuthService } from './core/app-server-auth.service';
import { Environment } from '../environments/environment';
import { FacetComponent } from './facet/facet.component';
import { DataService } from '../services/data.service';
import { MatSidenav } from '@angular/material';
import { SidenavService } from './sidenav.service';
declare let blockstack: any;
declare let window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  mobileQuery: MediaQueryList;
  win = window;
  name: string;
  isLoggedIn = false;
  loginState = "Login";
  profile: any;
  avatar: string = "https://www.gravatar.com/avatar/?d=identicon";
  loading;
  isMobile = true;
  resizeTimeout;
  Environment = Environment;
  filterPropsAry;
  shouldFacet = true;
  @ViewChild(FacetComponent) facets;
  @ViewChild('sidenav') public sidenav: MatSidenav; 

  

  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher, 
    public authService: AppServerAuthService, 
    public dataService: DataService,
    private sidenavService: SidenavService
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 1024px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.showProfile();
  }

  ngOnInit(){
    this.sidenavService.setSidenav(this.sidenav);
    
  }


  async showProfile() {

    if (blockstack.isUserSignedIn()) {

      let profile = blockstack.loadUserData();
      this.name = profile.username;
      this.isLoggedIn = true;
      try {
        this.avatar = profile.profile.image[0].contentUrl;
      } catch (e) { console.log('no profile pic') }

      this.loginState = "[Logout]";
      

      // get rid of ?authResponse=ey to prevent routing bugs
      setTimeout( ()=>{
        try{
          let authParam =  window.location.href.includes('authResponse');
          if(authParam){
            let newUrl = window.location.href.replace("/?authResponse=" + blockstack.loadUserData().authResponseToken , '');
            history.pushState({}, null, newUrl);
          }
        } catch(e){}
      }, 2500 )

      this.name = this.authService.getDisplayName();
    } else if (blockstack.isSignInPending()) {

    
      blockstack.handlePendingSignIn().then(function (userData) {
        window.location = window.location.origin
      });
    }
    else {
        this.login();
    }

  }

  login() {
    let origin = window.location.origin;
    let manifest = origin;
    blockstack.redirectToSignIn(origin, manifest + '/manifest.json', ['store_write', 'publish_data', 'email'])
  }

  async filter() {

    // For
    // const filterPropsAry = [
    //     {
    //         "@context": "https://schema.org/",
    //         "@type": "productvalue",
    //         "name": "Product Line",
    //         "value": "Water",
    //         "type": "string",
    //     },
    // ];

    this.filterPropsAry = this.facets.getSelectedFilters();
    let filtered = await this.dataService.filter(this.dataService.currentDataCache, this.filterPropsAry);

    if (window.innerWidth	<= 1024) {
      this.sidenav.close();
    }

}

}
