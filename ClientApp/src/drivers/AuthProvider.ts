export interface AuthProvider {
    login(): any;
    redirectToSignIn(origin, manifest, arrayScopes): any;
}