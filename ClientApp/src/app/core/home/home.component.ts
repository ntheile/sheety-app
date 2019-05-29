import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router, UrlHandlingStrategy } from "@angular/router";
import * as d3 from "d3-collection";
import * as _ from "lodash";
import { Environment } from "../../../environments/environment";
import { DataService } from "../../../services/data.service";
import { FacetComponent } from "../../facet/facet.component";
import { SearchOptions } from "./../../../data/interfaces";
declare let require: any;

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
    public app_id: string;
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

    @ViewChild(FacetComponent) facets;

    constructor(
        public dataService: DataService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        public http: HttpClient
    ) {
        this.app_id = Environment.Application_Id;
        this.reducer = require('./../../../data/' + this.dataService.getReducerUrl());
        this.transformer = require('./../../../data/' + this.dataService.getTransformUrl());
    }

    ngOnInit() {
        this.routeParams = this.activeRoute.snapshot.params;
    }

    ngAfterViewInit() {
        
        if (Environment.storageDriver === "sample") {
            // @todo figure out sample routing
            // this.routingService.configureDynamicRoutes(this.dataService.getConfig());
        }
        
        this.gererateHierarchialDataFromRoute(this.routeParams);
    }

    async gererateHierarchialDataFromRoute(routeParams) {
        
        this.hierarchyDepth = Object.keys(routeParams).length;
        this.dataService.hierarchyDepth.next(this.hierarchyDepth);
        this.hierarchy = await this.dataService.getHierarchy();
        


        this.data = await this.dataService.getData();

        for (let i = 0; i < this.hierarchyDepth; i++) {
            this.currentKey = this.currentKey + ".child"
        }
        this.currentKey = eval(this.currentKey + ".name");
        
        this.dataService.currentKey.next(this.currentKey);

        let nodeEval = "this.hierarchy";
        if (!(this.hierarchyDepth === 0 || this.hierarchyDepth === 1)) {
            for (let i = 1; i < this.hierarchyDepth; i++) {
                nodeEval = nodeEval + ".child";
            }
        }

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
            transform: this.transformer.transform,
            reducer: this.reducer.reduce
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

        // if (this.shouldFacet) {
        //     setTimeout(async () => {
        //         await this.facets.getFacets();
        //     }, 500);
        // }

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

    public go() {
        this.router.navigate(["/home/market"]);
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
