import { Injectable } from "@angular/core";
import { AuthProvider } from '../AuthProvider';
import { userInfo } from "os";
declare let blockstack: any;
declare let window: any;
interface BlockStackLoginParams{
    origin: any, 
    manifest: any, 
    arrayScopes?: any
}
interface UserInfo{
    name:any;
}

@Injectable()
export class BlockstackAuthProvider implements AuthProvider {
    
    private user;
    private name;
    private isLoggedIn;
    private avatar;
    private loginState;
    private userInfo: UserInfo;

    constructor(){
        this.userInfo = {name: null};
    }

    login(params: BlockStackLoginParams) {
        params.arrayScopes = ['store_write', 'publish_data', 'email'];
        blockstack.redirectToSignIn(params.origin, params.manifest + '/manifest.json', params.arrayScopes );
    }    
    
    logout() {
        throw new Error("Method not implemented.");
    }

    getUserInfo(){
        this.checkLoginStatus();
        return this.userInfo;
    }

    checkLoginStatus(){
        if (blockstack.isUserSignedIn()) {

            let profile = blockstack.loadUserData();
            this.name = profile.username;
            this.userInfo.name = this.name;
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
      
            // this.name = this.authService.getDisplayName();
          } else if (blockstack.isSignInPending()) {
      
            blockstack.handlePendingSignIn().then(function (userData) {
              window.location = window.location.origin
            });
          }
    }

}
