import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router, UrlHandlingStrategy } from "@angular/router";
import * as d3 from "d3-collection";
import * as _ from "lodash";
import { Environment } from "../../../environments/environment";
import { DataService } from "../../../services/data.service";
import { FacetComponent } from "../../facet/facet.component";
import { SearchOptions } from "./../../../data/interfaces";
import { RoutingService } from "../../../services/routing.service";
import { SidenavService } from "../../sidenav.service";
import { initChangeDetectorIfExisting } from "@angular/core/src/render3/instructions";
import { checkAndUpdatePureExpressionInline } from "@angular/core/src/view/pure_expression";
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation, fadeInExpandOnEnterAnimation, fadeOutCollapseOnLeaveAnimation, bounceInOnEnterAnimation } from 'angular-animations';
import { UtilsService } from "../../../services/utils.service";
import { Observable } from "rxjs";
import { SpinnerState } from "../../spinner/spinner.state";
import { Select, Store } from "@ngxs/store";
import { ToggleHide, ToggleShow } from "../../spinner/spinner.actions";
import {MatSnackBar} from '@angular/material/snack-bar';

declare let require: any;
declare let window: any;
declare let $: any;
@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.scss'],
    animations: [
        fadeInOnEnterAnimation(),
        fadeOutOnLeaveAnimation(),
        fadeInExpandOnEnterAnimation(),
        fadeOutCollapseOnLeaveAnimation(),
        bounceInOnEnterAnimation()
    ]
})
export class HomeComponent implements OnInit, AfterViewInit {
    hierarchy;
    routeParams;
    hierarchyDepth = 1;
    currentNodeData;
    data;
    searchOpts: any = { hi: "world" };
    shouldFacet = false;
    currentKey = "this.hierarchy";
    Environment = Environment;
    public d3 = d3;
    filterPropsAry;
    breadcrumbs = [];
    ignoreProps = Environment.config.ignoreProps;
    reducer;
    transformer;
    win = Window;
    isMobile = false;

    @ViewChild(FacetComponent) facets;
    @Select(SpinnerState) loading: Observable<boolean>;


    constructor(
        public store: Store,
        public dataService: DataService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        public http: HttpClient,
        public routingService: RoutingService,
        public sidenav: SidenavService,
        public utils: UtilsService,
        public cd: ChangeDetectorRef,
        private _snackBar: MatSnackBar
    ) {
        
    }

    ngOnInit() {
        this.init();
    }

    async init(){
       
        this.store.dispatch( new ToggleShow('spinner') );
        await this.getSheetyData();
       
        this.routeParams = this.activeRoute.snapshot.params;
        await this.gererateHierarchialDataFromRoute(this.routeParams);
       
        this.reducer = await this.dataService.getReducer();
        this.transformer = await this.dataService.getTransformer();
        
      
        let data = await this.getData();
        console.log('[Home.Component] Data', data);
        // this.checkDeepLink();
        this.store.dispatch( new ToggleHide('spinner') );
    }

    ngAfterViewInit() {
        if (Environment.storageDriver === "sample") {
            // @todo figure out sample routing
            // this.routingService.configureDynamicRoutes(this.dataService.getConfig());
        }
        if (window.innerWidth >= 1024){
            this.sidenav.open();
        }

        if (window.innerWidth < 1024){
            this.isMobile = true;
        }  
    }

    checkDeepLink() {
        let isDeepLink = localStorage.getItem('isDeepLink');
        if (isDeepLink){
            if (isDeepLink != 'false'){
                localStorage.setItem('isDeepLink', 'false');
                this.router.navigate([isDeepLink]);
            }
        }
    }

    async getSheetyData(){
         // get app id from uri
         let appId = this.utils.getAppIdFromUrl()
         // get data based on appID
         console.log('appID', appId);
        let sheetyApp = await this.dataService.getSheetyAppModel(appId);
        let sheetyAppData = await this.getSheetyAppDataModel();
        console.log('[SheetyAppData] =>', sheetyAppData );
        if (!sheetyAppData){
          let snackBarRef = this._snackBar.open("no data found", "close", { duration: 5000 });
          this.router.navigate(['/apps']);
        }
        this.store.dispatch(new ToggleHide("spinner"));

    }

    async getSheetyAppDataModel(){
        let data = await this.dataService.getSheetyAppDataModel(this.dataService.currentSheetyAppModel._id);
        console.log('getSheetyAppDataModel: ', data);
        return data;
    }
   
    async gererateHierarchialDataFromRoute(routeParams) {
        
        this.hierarchyDepth = Object.keys(routeParams).length;
        this.dataService.hierarchyDepth.next(this.hierarchyDepth);
        this.hierarchy = await this.dataService.getHierarchy();
        this.data = await this.dataService.getData();

        for (let i = 0; i < this.hierarchyDepth; i++) {
            this.currentKey = this.currentKey + ".child"
        }
        try{
            this.currentKey = eval(this.currentKey + ".name");
        } catch(e) {
            let snackBarRef = this._snackBar.open('No Excel data found. Please go back to the "My App" page, click EDIT and upload data', "close", { duration: 5000 });
        }
        
        
        this.dataService.currentKey.next(this.currentKey);

        let nodeEval = "this.hierarchy";
        if (!(this.hierarchyDepth === 0 || this.hierarchyDepth === 1)) {
            for (let i = 1; i < this.hierarchyDepth; i++) {
                nodeEval = nodeEval + ".child";
            }
        }

        await this.routingService.configureDynamicRoutes(this.router.config);      
    }

    async getData(){
        const searchData = this.dataService.routeLookup[this.hierarchyDepth];

        let searchTerm = null;
        if (!(_.isEmpty(this.routeParams))) {
            searchTerm = this.routeParams[Object.keys(this.routeParams)[Object.keys(this.routeParams).length - 1]]; // last obj
        }

        this.dataService.routeParams.next(this.routeParams);
        this.breadcrumbs = this.generateBreadcrumbs(this.routeParams);
        this.dataService.stopDepth = 0;
        const searchOptions: SearchOptions = {
            data: this.data,
            keys: searchData.keys,
            headerKey: searchData.headerKey,
            showOnly: searchData.showOnly,
            searchTerm,
            omitFields: searchData.omitFields,
            depth: this.hierarchyDepth,
            routeParms: this.routeParams,
            nextSearchOptions: null,
            transform: this.transformer,
            reducer: this.reducer
        };
        this.searchOpts = _.cloneDeep(searchOptions);
        this.searchOpts.data = this.data.length;
        this.dataService.searchOpts.next(this.searchOpts);
        let currentData = await this.dataService.search(searchOptions);
        this.dataService.currentData.next(currentData);

        try {
            if ((currentData[0].properties.length > 0)) {
                this.shouldFacet = true;
            }
        } catch (e) { }

        this.dataService.shouldFacet.next(this.shouldFacet);

        return currentData;
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

    }


    generateBreadcrumbs(routeParams) {
        let breadcrumbs = [{
            label: 'home',
            href: '/search'
        }];
        for (let i = 0; i < Object.keys(routeParams).length; i++) {
            let label = routeParams[Object.keys(routeParams)[i]];
            let breadcrumbBuilder = "/search/";
            if (i == 0) {
                breadcrumbBuilder = breadcrumbBuilder + label
            } else {
                for (let ii = 0; ii <= i; ii++) {
                    breadcrumbBuilder = breadcrumbBuilder + routeParams[Object.keys(routeParams)[ii]] + "/";
                }
            }
            breadcrumbs.push({
                label: label,
                href: breadcrumbBuilder
            });
        }
        return breadcrumbs;
    }


}
