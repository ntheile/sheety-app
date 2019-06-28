import { Injectable, Inject } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild,
    NavigationExtras,
    CanLoad, Route
} from '@angular/router';
import { AppServerAuthService } from '../core/app-server-auth.service';
import { AuthProvider } from '../../drivers/AuthProvider';



@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild, CanLoad {

    constructor (
        private authService: AppServerAuthService, 
        private router: Router,
        @Inject('AuthProvider') private authProvider: AuthProvider,
    ) {

    }

    // Permits the asynchronous loading of a given url
    async canLoad (route: Route): Promise<boolean> {
        const url = `/${ route.path }`;
        return await this.checkLogin(url);
    }

    // Assuming module/component loaded, checks if route can be activated
    async canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

        const url: string = state.url;
        return await this.checkLogin(url);
    }

    async canActivateChild (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return await this.canActivate(route, state);
    }

    //asynchronously checks if user is logged on and authenticated
    async checkLogin (url: string): Promise<boolean> {
        
        return await this.authProvider.isLoggedIn;
        
        
        //Allow user to go to logout page if not logged in.
        //Redirect to home page if logged in and trying to access 'logout'
        // const isLoggedOn = this.authService.isLoggedIn();
        // if (url === '/loggedout' && isLoggedOn) {
        //     this.router.navigate(['/']);
        //     return Promise.resolve(false);
        // } else if (url === '/loggedout' && !isLoggedOn) {
        //     return Promise.resolve(true);
        // }

        // if (!isLoggedOn) {
        //     this.authService.login();
        //     return Promise.resolve(false);
        // }
        // return Promise.resolve(true);
    }
}
