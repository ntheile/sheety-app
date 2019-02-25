export class UserClaims {
  public name?: string = ''; // display name--this will default to 'unknown' if claim exists but wasnt provided by user.
  public given_name?: string = ''; // first name
  public surname?: string = ''; // last name
  public emails?: Array<string> = [''];
  public streetAddress?: string = '';
  public city?: string = '';
  public postalCode?: string = '';
  public state?: string = '';
  public country?: string = '';
  public jobTitle?: string = ''; // used for company in our case
  public oid?: string = ''; // Object identifier (ID) of the user object in Azure AD.
  public newUser?: boolean = false; // if the user just signed up
  public email?: string = '';
  public preferred_username: string = '';
  public in_corp: boolean = false;

  constructor(initObj?: Partial<UserClaims>) {
    if (initObj) {
      Object.keys(initObj).forEach(key => !initObj[key] && delete initObj[key]);
      Object.assign(this, initObj);
    }
  }
}
