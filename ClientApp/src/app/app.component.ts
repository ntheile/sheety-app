import { ChangeDetectorRef, Component, ViewChild, Inject } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppServerAuthService } from './core/app-server-auth.service';
import { Environment } from '../environments/environment';
import { FacetComponent } from './facet/facet.component';
import { DataService } from '../services/data.service';
import { MatSidenav } from '@angular/material';
import { SidenavService } from './sidenav.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RoutingService } from '../services/routing.service';
import { AuthProvider } from '../drivers/AuthProvider';
import { Observable } from 'rxjs';
import { Store, Select } from '@ngxs/store';
import { SpinnerState } from './spinner/spinner.state';
import { ToggleShow, ToggleHide } from './spinner/spinner.actions';
declare let window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  mobileQuery: MediaQueryList;
  win = window;
  name: string;
  isLoggedIn = false;
  loginState = "Login";
  profile: any;
  avatar: string = "./../assets/placeuser.png";
  
  isMobile = true;
  resizeTimeout;
  Environment = Environment;
  filterPropsAry;
  shouldFacet = true;
  @ViewChild(FacetComponent) facets;
  @ViewChild('sidenav') public sidenav: MatSidenav; 
  @Select(SpinnerState) loading: Observable<boolean>;


  private _mobileQueryListener: () => void;
  constructor(
      changeDetectorRef: ChangeDetectorRef, 
      media: MediaMatcher, 
      public authService: AppServerAuthService, 
      public dataService: DataService,
      private sidenavService: SidenavService,
      private router: Router,
      public routingService: RoutingService,
      private activeRoute: ActivatedRoute,
      @Inject('AuthProvider') private authProvider: AuthProvider,
      private store: Store,
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 1024px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.showProfile();
    this.init();
  }

  ngOnInit(){
    this.sidenavService.setSidenav(this.sidenav);
    this.Hide("spinner");
  }

  Show(target) {
    this.store.dispatch(new ToggleShow(target));
  }

  Hide(target) {
    this.store.dispatch(new ToggleHide(target));
  }

  async init(){
    this.Show('spinner');
    this.checkDeepLink();
    let routeParams = this.activeRoute.snapshot.params;
    await this.gererateHierarchialDataFromRoute(routeParams);
    this.Hide('spinner');
  }

  checkDeepLink(){
    if (location.pathname.includes('/search/') ){
      localStorage.setItem('isDeepLink', location.pathname);
    }
  }

  async showProfile() {

    let userInfo = await this.authProvider.getUserInfo();

    if (this.authProvider.isLoggedIn) {
      this.name = userInfo.name;
    } else {
        this.login();
    }

  }

  login() {
    let origin = window.location.origin;
    let manifest = origin;
    this.authProvider.login({origin: origin, manifest: manifest});
  }

  async filter() {

    // For
    // const filterPropsAry = [
    //     {
    //         "@context": "https://schema.org/",
    //         "@type": "productvalue",
    //         "name": "Product Line",
    //         "value": "Water",
    //         "type": "string",
    //     },
    // ];

    this.filterPropsAry = this.facets.getSelectedFilters();
    let filtered = await this.dataService.filter(this.dataService.currentDataCache, this.filterPropsAry);

    if (window.innerWidth	<= 1024) {
      this.sidenav.close();
    }

  }

  async gererateHierarchialDataFromRoute(routeParams) {
        
    let hierarchyDepth = Object.keys(routeParams).length;
    this.dataService.hierarchyDepth.next(hierarchyDepth);
    let hierarchy = await this.dataService.getHierarchy();
    let data = await this.dataService.getData();
    let currentKey = "hierarchy";

    for (let i = 0; i < hierarchyDepth; i++) {
        currentKey = currentKey + ".child"
    }
    try{
      currentKey = eval(currentKey + ".name");
    } catch(e){
      console.log('no hierarchy.name data');
      return;
    }
    
    this.dataService.currentKey.next(currentKey);

    let nodeEval = "this.hierarchy";
    if (!(hierarchyDepth === 0 || hierarchyDepth === 1)) {
        for (let i = 1; i < hierarchyDepth; i++) {
            nodeEval = nodeEval + ".child";
        }
    }

   
    await this.routingService.configureDynamicRoutes(this.router.config);

  }

}
