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
      

      

      // let profileData = await this.blockStackService.getProfileData();

      // if (!profileData) {
      //   this.profileModal(this.email);
      // }
      // else {
      //   let myProfile = JSON.parse(profileData);
      //   if (!myProfile.email) {
      //     this.profileModal(this.email);
      //   }
      //   else {
      //     // this.name = myProfile.email;
      //     this.name = blockstack.loadUserData().username;
      //     this.loadCachedNewDocWhenLoggedIn();
      //   }
      // }

      //}
      // this.loading.dismiss();

      // get rid of ?authResponse=ey to prevent routing bugs
      setTimeout( ()=>{
        try{
          let authParam =  window.location.href.includes('authResponse');
          if(authParam){
            let newUrl = window.location.href.replace("/?authResponse=" + blockstack.loadUserData().authResponseToken , '');
            history.pushState({}, null, newUrl);
          }
        } catch(e){}
      }, 1500 )


    } else if (blockstack.isSignInPending()) {

      // this.cacheNewDocIfNotLoggedIn();

      blockstack.handlePendingSignIn().then(function (userData) {
        window.location = window.location.origin
        this.documentsGetList();
        //this.loading.dismiss();
      });
    }
    else {

      //this.loading.dismiss();
      // this.cacheNewDocIfNotLoggedIn();


      if (navigator.userAgent.toLocaleLowerCase().includes('electron') === true) {
        localStorage.setItem('signUp', 'true');
        //this.loginElectron();      
        //return;
      }

      if (localStorage.getItem('signUp') !== 'true' && location.hostname !== "localhost") {
        window.location.href = "signup.html";
      }
      else {
        localStorage.setItem('signUp', 'true');
        this.login();
      }


    }

    // @todo Optimize this;
    // this.blockStackService.saveAppPublicKey();

  }

  login() {
    let origin = window.location.origin;
    let manifest = origin;
    blockstack.redirectToSignIn(origin, manifest + '/manifest.json', ['store_write', 'publish_data', 'email'])
  }

}
