import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ReadFromInjectorFn } from "@angular/core/src/render3/di";
import { ActivatedRoute, Router } from "@angular/router";
import * as d3 from "d3-collection";
import * as _ from "lodash";
import { retry } from "rxjs/operators";
import { Environment } from "../../../environments/environment";
import { DataService } from "../../../services/data.service";
import { FacetComponent } from "../../facet/facet.component";
import { SearchOptions } from "./../../../data/interfaces";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit  {
    public app_id: string;
    hierarchy;
    routeParams;
    hierarchyDepth = 1;
    currentNodeData;
    currentData;
    data;
    searchOpts: any = {hi: "world"};
    shouldFacet = false;
    public d3 = d3;
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
        this.gererateHierarchialDataFromRoute(this.routeParams);
    }

    async gererateHierarchialDataFromRoute(routeParams) {
       
        this.hierarchyDepth = Object.keys(routeParams).length;
        this.hierarchy = await this.dataService.getHierarchy();
        this.data = await this.dataService.getData();
        
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

        this.dataService.stopDepth = 0;
        const searchOptions: SearchOptions  =  {
            data: this.data, 
            keys: searchData.keys, 
            showOnly: searchData.showOnly, 
            searchTerm, 
            omitFields: searchData.omitFields,
            depth: this.hierarchyDepth,
            routeParms: this.routeParams,
            nextSearchOptions: null,
            transform(searchOptions) {
                searchOptions.omitFields = null;
                return searchOptions;
            },
            // transform: function (searchOptions) {
               
            //     if (searchOptions.keys.includes('market') && searchOptions.searchTerm !== null) {
            //         searchOptions.omitFields = ['products.properties'];
            //         // searchOptions.showOnly = 'products.name';
            //     }

            //     if (searchOptions.keys.includes('products.name') && searchOptions.searchTerm !== null) {
            //         //searchOptions.omitFields = ['properties'];
            //         searchOptions.omitFields = null;
            //         searchOptions.keys.push('market');
            //         // searchOptions.showOnly = 'name';
            //     }

            //     return searchOptions;
            // },
            // reducer: function (list, keyword) {
            //     if (searchOptions.keys.includes('products.name') && searchOptions.searchTerm !== null) {
            //       list = list[0].products.filter(product=> product.name == keyword);
            //     }
            //     return list;
            // }
        };
        this.searchOpts = _.cloneDeep(searchOptions);
        this.searchOpts.data = this.data.length;
        this.currentData =  await this.dataService.search(searchOptions);

        try {
            if (this.currentData[0].properties.length > 0) {
                this.shouldFacet = true;
            }
        } catch (e) {}
        
        // Manual search Logic for testing
        // search2(data, keys, showOnly, searchTerm, omitFields )
        // // 1) Root
        // // /search
        // if (_.isEmpty(this.routeParams)) {
        //    this.currentData =  await this.dataService.search2(this.data, ['market'], null, null, ['products']);
        // } else {

        //     // 2) Middle
        //     // /search/:market
        //     // /search/rigids
        //     if (this.hierarchyDepth === 1) {
        //         this.currentData = await this.dataService.search2(this.data, ['market'], null, 'Rigid', ['products']);
        //     }
            
        //     // 3) Middle
        //     // /search/:market/:product
        //     // /search/rigids/Dowlex  (Master = null child - 1)
        //     if (this.hierarchyDepth === 2) {
        //         this.currentData = await this.dataService.search2(this.data, ['products.name'], 'products', 'DOWLEXTM 2629UE', ['properties']);
        //         // await this.dataService.search2(this.data, ['products.name'], 'products', 'DOWLEX', null); // fuzzy
        //     }
           
        //     // 4) Details
        //     // /search/:market/:product/:properties
        //     // /market/rigids/Dowlex/properties (details = null child)
        //     if (this.hierarchyDepth === 3) {
        //         this.currentData = await this.dataService.search2(this.data, ['products.name'], 'products', 'DOWLEXTM 2629UE', null);
        //     }
        // }

        // this.currentNodeData = eval(nodeEval);
        // this.dataService.getDataAt(this.data, 2, 'products');
        // this.currentData = await this.getChildDataAtNode(this.currentNodeData, this.routeParams);
        
        // let nested = d3.nest()
        //     .key(d => d["Trade Product"])
        //     .entries(this.currentData);

            // .rollup( (leaves) => { 
            //     return { 
            //     "min": d3.min(leaves, (d) => { return parseFloat(d.totalpop) } ), 
            //     "max": d3.max(leaves, (d) => { return parseFloat(d.totalpop) } ) 
            //     } 
            // })

        const f = await this.facets.getFacets();

        return this.currentData;
    }

    async filter() {

        const filterPropsAry = [
            {
                "@context": "https://schema.org/",
                "@type": "productvalue",
                "name": "Product Line",
                "value": "Water",
                "type": "string",
            },
        ];

        const filtered = await this.dataService.filter(this.currentData, filterPropsAry);
        this.currentData = filtered;
    }

    public go() {
        this.router.navigate(["/home/market"]);
    }

}
