import { Injectable } from "@angular/core";
import { AuthProvider } from '../AuthProvider';
declare let blockstack: any;

@Injectable()
export class BlockstackAuthProvider implements AuthProvider {
    
    login() {
        throw new Error("Method not implemented.");
    }    
    
    redirectToSignIn(origin: any, manifest: any, arrayScopes: any) {
        throw new Error("Method not implemented.");
    }


}