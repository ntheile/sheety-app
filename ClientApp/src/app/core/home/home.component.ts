import { Component, OnInit } from '@angular/core';
import { Environment } from '../../../environments/environment';
import { DataService } from '../../../services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReadFromInjectorFn } from '@angular/core/src/render3/di';
import * as _ from 'lodash';
import { SearchOptions } from './../../../data/interfaces';
import { retry } from 'rxjs/operators';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit  {
    public app_id: string;
    hierarchy;
    routeParams;
    hierarchyDepth = 1;
    currentNodeData;
    currentData;
    data;
    searchOpts:any = {"hi": "world"};

    constructor(
        public dataService: DataService,
        private router: Router,
        private activeRoute: ActivatedRoute,
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
        let nodeEval = 'this.hierarchy';
        if ( !( this.hierarchyDepth === 0 || this.hierarchyDepth === 1 ) ) {
            for (let i = 1; i < this.hierarchyDepth; i++) {
                nodeEval = nodeEval + '.child';
            }
        }

        let searchData = this.dataService.routeLookup[this.hierarchyDepth];

        let searchTerm = null;
        if ( ! (_.isEmpty(this.routeParams) ) ){
            searchTerm = this.routeParams[Object.keys(this.routeParams)[Object.keys(this.routeParams).length - 1 ]]; // last obj
        }

        this.dataService.stopDepth = 0;
        let searchOptions:SearchOptions  =  {
            data: this.data, 
            keys: searchData.keys, 
            showOnly: searchData.showOnly, 
            searchTerm: searchTerm, 
            omitFields: searchData.omitFields,
            depth: this.hierarchyDepth,
            routeParms: this.routeParams,
            nextSearchOptions: null,
            transform: function (searchOptions) {
               
                if (searchOptions.keys.includes('market') && searchOptions.searchTerm !== null) {
                    searchOptions.omitFields = ['products.properties'];
                    // searchOptions.showOnly = 'products.name';
                }

                if (searchOptions.keys.includes('products.name') && searchOptions.searchTerm !== null) {
                    //searchOptions.omitFields = ['properties'];
                    searchOptions.omitFields = null;
                    searchOptions.keys.push('market');
                    // searchOptions.showOnly = 'name';
                }

                return searchOptions;
            },
            reducer: function (list, keyword) {
                if (searchOptions.keys.includes('products.name') && searchOptions.searchTerm !== null) {
                  list = list[0].products.filter(product=> product.name == keyword);
                }
                return list;
            }
        };
        this.searchOpts = _.cloneDeep(searchOptions);
        this.searchOpts.data = this.data.length;
        this.currentData =  await this.dataService.search2(searchOptions);

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
           

        //}

        //this.currentNodeData = eval(nodeEval);

        //this.dataService.getDataAt(this.data, 2, 'products');

        //this.currentData = await this.getChildDataAtNode(this.currentNodeData, this.routeParams);
        
        return this.currentData;
    }

    // filter then map (aka select)
    async getChildDataAtNode(currentNodeData, route) {
        
        // odd or even route? odd= key even = value
        // for example /market/marketValue/properties/propertyValue would be even route
        // this route has a depth of 4, so it will recurse 2 times representing each key/value pair

        // split route into pairs
        let routePairs = this.splitRouteIntoPairs(route);
        

        let i = 0;
        for (let routePair of routePairs) {
            let filterStr = null;
             // if value then get data
            if ( routePair.value ) { 
                let filterKey = route[routePair.key];
                let filterValue = route[routePair.value];
                filterStr = `item => item.${filterKey} === '${filterValue}' `;
            }
    
            // if depth = 1 then its just key, keep going and get the keys to facet/refine on
            let keys = [];
            let childKeys = [];
           
            try {
                if (currentNodeData.rootKeys){
                    keys = currentNodeData.rootKeys;
                }
            } catch (e) {
                // console.error('Error generating currentNodeData.rootKeys', e);
            }
   
            try {
                if (currentNodeData.name){
                    keys.push({key: currentNodeData.name, title: currentNodeData.name}); 
                }
            } catch (e) {
                // console.error('Error generating currentNodeData.name', e);
            }

            try{
                if (currentNodeData.child){
                    childKeys.push({key: currentNodeData.child.name, title: currentNodeData.child.name}); 
                }
            } catch(e) {}


            let refresh = false;
            if (this.hierarchyDepth < ( routePairs.length * 2 ) ) {
               refresh = true;
            } 
            
            
            currentNodeData = await this.dataService.getDataAtDepth(1, keys, filterStr, refresh, childKeys);
            
            i++;
        }

        return currentNodeData;
    }

    splitRouteIntoPairs(route) {

        let len = Object.keys(route).length;
        let numberOfPairs = len / 2;
        let routePairs = [];
        let keyIterator;

        for (let i = 0; i < numberOfPairs;) {
            if (i == 0){
                keyIterator = 0;
            } else{
                keyIterator = keyIterator + 2;
            }
            routePairs.push({
                key: Object.keys(route)[keyIterator],
                value: Object.keys(route)[(keyIterator + 1)] || null,
            });
            i = i + 1;
        }

        return routePairs;
    }

    public go() {
        this.router.navigate(['/home/market']);
    }

   
}