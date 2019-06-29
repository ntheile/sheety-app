import { Injectable } from "@angular/core";
import { AuthProvider } from '../AuthProvider';
import { userInfo } from "os";
// declare let blockstack: any;
import { UserSession, AppConfig, nextMonth } from 'blockstack';
import { User, getConfig, configure, UserGroup } from 'radiks';
import { Environment } from "../../environments/environment";
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY } from "@angular/cdk/overlay/typings/overlay-directives";
declare let window: any;

interface BlockStackLoginParams {
  origin: any,
  manifest: any,
  arrayScopes?: any
}
interface UserInfo {
  name: any;
}

@Injectable()
export class BlockstackAuthProvider implements AuthProvider {

  private user;
  private name;
  isLoggedIn = false;;
  private avatar;
  private loginState;
  private userInfo: UserInfo;
  params;
  groups;
  

  constructor() {
    this.userInfo = { name: null };
    window.userSession = null;
  }

  login(params: BlockStackLoginParams) {
    params.arrayScopes = ['store_write', 'publish_data', 'email'];
    this.params = params;
    
    let authRequest = window.userSession.makeAuthRequest(
      window.userSession.generateAndStoreTransitKey(),
      params.origin,
      params.manifest + '/manifest.json',
      params.arrayScopes,
      params.origin,
      nextMonth().getTime(),
      {
        solicitGaiaHubUrl: true
      }
    );
    window.userSession.redirectToSignInWithAuthRequest(authRequest);
    // window.userSession.redirectToSignIn(params.origin, params.manifest + '/manifest.json', params.arrayScopes)
  }

  logout() {
    window.userSession.signUserOut();
    alert('You have been logged out. Please close the current tab');
  }

  async getUserInfo() {
    await this.checkLoginStatus();
    return this.userInfo;
  }

  async checkLoginStatus() {

    window.userSession = new UserSession({
      appConfig: new AppConfig(['store_write', 'publish_data', 'email'])
    });

    if (window.userSession.isUserSignedIn()) {
      this.configureRadiks();
      let profile = window.userSession.loadUserData();
      this.name = profile.username;
      this.userInfo.name = this.name;
      try {
        this.avatar = profile.profile.image[0].contentUrl;
      } catch (e) { console.log('no profile pic') }

      this.loginState = "[Logout]";
      // await User.createWithCurrentUser();
      await this.getMyGroups(window.userSession);
    } else if (window.userSession.isSignInPending()) {
      await window.userSession.handlePendingSignIn();
      this.configureRadiks();
      await User.createWithCurrentUser();
      await this.getMyGroups(window.userSession);
      setTimeout( ()=>{
        window.location.reload();
      }, 500 );
    } else {
      console.log('unexpected error');
    }
  }


  async getMyGroups(userSession) {
    try{
      this.groups = await UserGroup.myGroups();
    } catch(e){console.log('cannot get groups')}
    this.removeAuthResp();
    this.isLoggedIn = true;
  }

  configureRadiks() {
    configure({
      apiServer: Environment.RadiksUrl,
      userSession: window.userSession
    });
  }

  removeAuthResp() {
    // get rid of ?authResponse=ey to prevent routing bugs
    let authParam = window.location.href.includes('authResponse');
    if (authParam) {
      const urlParams = new URLSearchParams(window.location.search);
      const myAuthRepsonse = urlParams.get('authResponse');
      let newUrl = window.location.href.replace("/?authResponse=" + myAuthRepsonse, '');
      history.pushState({}, null, newUrl);
    }
  }


}
