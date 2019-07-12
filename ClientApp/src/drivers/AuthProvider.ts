export interface AuthProvider {
    login({}:any): any; // redirectToSignIn(origin, manifest, arrayScopes): any;
    logout({}:any):any;
    getUserInfo(): any;
    isLoggedIn: boolean;
    backupGroupMemberships():any;
    fetchGroupMembershipBackup(): any;
    setGroupMembership(groupKey): any;
}