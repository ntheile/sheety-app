import { ChangeDetectorRef, Component } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppServerAuthService } from './core/app-server-auth.service';
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

  name: string;
  isLoggedIn = false;
  loginState = "Login";
  profile: any;
  avatar: string = "https://www.gravatar.com/avatar/?d=identicon";
  loading;
  isMobile = true;
  resizeTimeout;
  

  private _mobileQueryListener: () => void;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, 
    public authService: AppServerAuthService, ) {

    this.mobileQuery = media.matchMedia('(max-width: 1024px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.showProfile();
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

}
