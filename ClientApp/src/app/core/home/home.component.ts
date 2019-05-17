import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router, UrlHandlingStrategy } from "@angular/router";
import * as d3 from "d3-collection";
import * as _ from "lodash";
import { Environment } from "../../../environments/environment";
import { DataService } from "../../../services/data.service";
import { FacetComponent } from "../../facet/facet.component";
import { SearchOptions } from "./../../../data/interfaces";
// @todo make this dynamic
import * as reducer from './../../../data/samples/products-emeai-flat/reducer.js'; 
import * as transformer from './../../../data/samples/products-emeai-flat/transformer.js';
// import * as reducer from './../../../data/samples/products-plastics-nested/reducer.js'; 
// import * as transformer from './../../../data/samples/products-plastics-nested/transformer.js';
// import * as reducer from './../../../data/samples/cars/reducer.js'; 
// import * as transformer from './../../../data/samples/cars/transformer.js';
// import * as reducer from './../../../data/samples/cars-nested/reducer.js'; 
// import * as transformer from './../../../data/samples/cars-nested/transformer.js';


@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit  {
    public app_id: string;
    hierarchy;
    routeParams;
    hierarchyDepth = 1;
    currentNodeData;
    currentData;
    data;
    searchOpts: any = {hi: "world"};
    shouldFacet = false;
    currentKey = "this.hierarchy";
    Environment = Environment;
    public d3 = d3;
    filterPropsAry;
    breadcrumbs = [];
    ignoreProps = Environment.config.ignoreProps;
    
    @ViewChild(FacetComponent) facets;
    
    constructor(
        public dataService: DataService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        public http: HttpClient,
    ) {
        this.app_id = Environment.Application_Id;
    }

    ngOnInit() {
        this.routeParams = this.activeRoute.snapshot.params;
    }

    ngAfterViewInit(){
        this.gererateHierarchialDataFromRoute(this.routeParams);
    }

    async gererateHierarchialDataFromRoute(routeParams) {
       
        this.hierarchyDepth = Object.keys(routeParams).length;
        this.hierarchy = await this.dataService.getHierarchy();
        this.data = await this.dataService.getData();

        for (let i = 0; i < this.hierarchyDepth; i++){
            this.currentKey = this.currentKey + ".child"
        }
        this.currentKey = eval(this.currentKey + ".name");

        let nodeEval = "this.hierarchy";
        if ( !( this.hierarchyDepth === 0 || this.hierarchyDepth === 1 ) ) {
            for (let i = 1; i < this.hierarchyDepth; i++) {
                nodeEval = nodeEval + ".child";
            }
        }

        const searchData = this.dataService.routeLookup[this.hierarchyDepth];

        let searchTerm = null;
        if ( ! (_.isEmpty(this.routeParams) ) ) {
            searchTerm = this.routeParams[Object.keys(this.routeParams)[Object.keys(this.routeParams).length - 1 ]]; // last obj
        }

       
        this.breadcrumbs = this.generateBreadcrumbs(this.routeParams);
        this.dataService.stopDepth = 0;
        const searchOptions: SearchOptions  =  {
            data: this.data, 
            keys: searchData.keys, 
            headerKey: searchData.headerKey,
            showOnly: searchData.showOnly, 
            searchTerm, 
            omitFields: searchData.omitFields,
            depth: this.hierarchyDepth,
            routeParms: this.routeParams,
            nextSearchOptions: null,
            transform: transformer.transform,
            reducer: reducer.reduce
        };
        this.searchOpts = _.cloneDeep(searchOptions);
        this.searchOpts.data = this.data.length;
        this.currentData =  await this.dataService.search(searchOptions);
        this.dataService.currentData = this.currentData;
        
        try {
            if ( (this.currentData[0].properties.length > 0) ) {
                this.shouldFacet = true;
            }
        } catch (e) {}

        if (this.shouldFacet){
            setTimeout( async ()=>{
                await this.facets.getFacets();
            }, 500 )
        }
        return this.currentData;
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

        const filtered = await this.dataService.filter(this.currentData, this.filterPropsAry);
        this.currentData = filtered;
    }

    public go() {
        this.router.navigate(["/home/market"]);
    }

    nav(page){
        let route = decodeURI(this.router.url);
        if (!route.includes('search')){
            route = "/search" + route;
        }
        route = route + "/" + page;
        this.router.navigate([route]).then( ()=>{
            // @todo fix reload hack. i.e sometimes data does not load properly if if it reloaded
            location.reload();
        } );
        
    }

    generateBreadcrumbs(routeParams){
        let breadcrumbs = [{
            label: 'home',
            href: '/search'
        }];
        for (let i = 0; i < Object.keys(routeParams).length; i++ ){
            let label = routeParams[Object.keys(routeParams)[i]];
            let breadcrumbBuilder = "/search/";
            if (i == 0){
                breadcrumbBuilder = breadcrumbBuilder + label
            } else {
                for (let ii = 0; ii <= i ; ii++ ){
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
