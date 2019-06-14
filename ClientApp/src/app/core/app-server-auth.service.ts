import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from '@angular/core';
import { UserClaims } from './user-claims.model';
declare let blockstack: any;

/**
 * Local App Server Proxy Authentication.
 * Assumes that hosting app server will function as a both the token issuer endpoint and identity provider
 * Assumes Login/Logout are at Account/Login and Account/Logout
 *
 * @export
 * @class AppServerAuthService
 */
@Injectable()
export class AppServerAuthService {
  public currentUser: UserClaims | undefined;
  public name = "none";
  private baseUrl: string;
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Checks policies to determine if user is online
   *
   * @returns {boolean}
   * @memberof AdalAuthService
   */
  public isLoggedIn(): boolean {
    return this.currentUser != null;
  }

  public logout(): void {
    const logoutUrl = `${this.baseUrl}/Account/Logout`;
    this.currentUser = null;
    window.location.href = logoutUrl;
  }

  /**
   * Gets a display-friendly name for the signed in user
   * @return {string} Display friendly name of current user
   */
  public getDisplayName(): string {
    return blockstack.loadUserData().username;
    return "none";
    if (
      this.currentUser &&
      this.currentUser.given_name &&
      this.currentUser.surname
    ) {
      return this.currentUser.given_name.concat(" ", this.currentUser.surname);
    } else {
      return this.currentUser.name;
    }
  }

  setDisplayName(name){
    this.name = name;
    return this.name;
  }


  /**
   * Retrieves a valid access token from the active session policy
   * 
   * @returns {Promise<string>} 
   * @memberof AppServerAuthService
   */
  public getAccessToken(): Promise<string> {
    return Promise.resolve(null);
  }



  /**
   * Maps raw list of claims in a new UserClaims object
   *
   * @private
   * @returns {UserClaims}
   * @memberof AppServerAuthService
   */
  private getUserClaims(rawClaims: {}): UserClaims {
    const claimObj = {};
    Object.keys(rawClaims).forEach(key => {
      const obj = rawClaims[key];
      claimObj[this.getFriendlyClaimType(obj.type)] = obj.value;
    });

    const claims = new UserClaims({
      name: claimObj["name"],
      given_name: claimObj["givenname"],
      surname: claimObj["surname"],
      emails: claimObj["emails"] || claimObj["unique_name"],
      streetAddress: claimObj["streetAddress"],
      city: claimObj["city"],
      postalCode: claimObj["postalCode"],
      state: claimObj["state"],
      country: claimObj["country"],
      jobTitle: claimObj["jobTitle"],
      oid: claimObj["oid"] || claimObj["objectidentifier"],
      newUser: claimObj["newUser"],
      email:
        claimObj["email"] ||
        claimObj["unique_name"] ||
        claimObj["emailaddress"] ||
        claimObj["xemail"],
      preferred_username:
        claimObj["preferred_username"] || claimObj["unique_name"],
      in_corp: claimObj["in_corp"] || false
    });

    return claims;
  }

  /**
   * Returns the meaningful part of the claimType.
   * 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress' would become emailaddress
   * 
   * @private
   * @param {string} fullClaimType 
   * @returns 
   * @memberof AppServerAuthService
   */
  private getFriendlyClaimType(fullClaimType: string) {
    return fullClaimType.substr(fullClaimType.lastIndexOf('/') + 1).toLowerCase();
  }


  /**
   * converts list of claims into an object of claimType:value pairs
   * 
   * @private
   * @param {any[]} claims 
   * @returns 
   * @memberof AppServerAuthService
   */
  private parseRawClaims(claims: any[]) {
    const claimObj = {};
    let selectedClaims = [];
    selectedClaims = claims.map((c) => ({ type: this.getFriendlyClaimType(c.type), value: c.value }));
    selectedClaims.map(c => claimObj[c.type] = c.value);
    return claimObj;
  }

  /**
   * Logs in the user by redirecting to the local Account/Login endpoint.
   * 
   * @memberof AppServerAuthService
   */
  public login() {
    const loginUrl = `${this.baseUrl}/Account/Login`;
    window.location.href = loginUrl;
  }

  /**
   * Gets the currently logged in user's information found at the local userinfo endpoint.
   * 
   * @returns 
   * @memberof AppServerAuthService
   */
  public getUserInfo() {
    const userInfoUrl = `api/userinfo`;
    return this.http
      .get(userInfoUrl)
      .toPromise()
      .then(
        roles => {
          const userClaims: UserClaims = this.getUserClaims(roles);
          this.currentUser = userClaims;
        },
        (error) => {
          this.currentUser = null;

          if (error.status === 403) {
            this.currentUser = new UserClaims({
              name: "Unauthorized User"
            });
          }

          if (error.status === 0) {
            this.login();
          }
        }
      )
      .catch((error: Response) => {
        this.currentUser = null;
      });
      
  }
}