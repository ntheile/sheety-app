import { Injectable } from "@angular/core";
import { AuthProvider } from '../AuthProvider';
import { userInfo } from "os";
// declare let blockstack: any;
import { UserSession, AppConfig } from 'blockstack';
import { User, getConfig, configure } from 'radiks';
import { Environment } from "../../environments/environment";
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
  private isLoggedIn;
  private avatar;
  private loginState;
  private userInfo: UserInfo;
  userSession;
  params;

  constructor() {
    this.userInfo = { name: null };
  }

  login(params: BlockStackLoginParams) {
    params.arrayScopes = ['store_write', 'publish_data', 'email'];
    this.params = params;

    this.userSession.redirectToSignIn(params.origin, params.manifest + '/manifest.json', params.arrayScopes)
  }

  logout() {
    throw new Error("Method not implemented.");
  }

  async getUserInfo() {
    await this.checkLoginStatus();
    return this.userInfo;
  }

  async checkLoginStatus() {


    this.userSession = new UserSession({
      appConfig: new AppConfig(['store_write', 'publish_data', 'email'])
    });


    if (this.userSession.isUserSignedIn()) {

      let profile = this.userSession.loadUserData();
      this.name = profile.username;
      this.userInfo.name = this.name;
      this.isLoggedIn = true;
      try {
        this.avatar = profile.profile.image[0].contentUrl;
      } catch (e) { console.log('no profile pic') }

      this.loginState = "[Logout]";


      // get rid of ?authResponse=ey to prevent routing bugs
      setTimeout(() => {
        try {
          let authParam = window.location.href.includes('authResponse');
          if (authParam) {
            let newUrl = window.location.href.replace("/?authResponse=" + this.userSession.loadUserData().authResponseToken, '');
            history.pushState({}, null, newUrl);
          }
        } catch (e) { }
      }, 2500)

      

    } else if (this.userSession.isSignInPending()) {
      
      await this.userSession.handlePendingSignIn();

      configure({
        apiServer: Environment.RadiksUrl,
        userSession: this.userSession
      });
      await User.createWithCurrentUser();
      window.location = window.location.origin
    }
  }


}
