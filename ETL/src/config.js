// Domain Models
vocabulary = require('./models/vocab');
product = require('./models/product');
hierarchy = require('./models/industryHierarchy');

// Domains
// 1) Market Domain
// 2) Product Domain
// 3) Properties Domain
// 4) Facet Domain

// Excel Transform Config
ignoreSheets = ["Markets", "Injection Molding WTF", "Building panels", "Roofing", "Paving"]
rootKeys = ["Market segment", "Application"]
rootProps = ["Product Name "];
ignoreProps = [];
idTokenized = "https://dow.com/en-us/industries/packaging/${Market segment}/${Application}/${Sub-Application}/${Functionality}/${Product Name}";

// Facets 
// facetHierarchy = [
//     {
//         name: "Market segment", // home page facet - var m =  d.map( m=> m["Market segment"] ); var uniqueMarkets = [...new Set(m)]; => then click and get details page of applications for that market 
//         rootKeys: ["Market segment", "Application"],
//         facets: null,
//         children: [
//             {
//                 name: "Applications", // second page facet - d.filter( m => m["Market segment"] == "F&SP")
//                 facets: null,
//                 children: [
//                     {
//                         name: "Product name",
//                         facets: true, // all properties are facets
//                         ignoreFacets: ["Strain at Break% CD"],
//                         advancedFacets: ["Density"]
//                     }
//                 ]
//             }
//         ]
//     }
// ];

// categories
// Drill down categories then facet on individual product 
// jsonHierarchy = {
//     name: "Market segment", // home page facet - var m =  d.map( m=> m["Market segment"] ); var uniqueMarkets = [...new Set(m)]; => then click and get details page of applications for that market 
//     rootKeys: ["Market segment"],
//     child : {
//         name: "Applications", // home page facet - var m =  d.map( m=> m["Market segment"] ); var uniqueMarkets = [...new Set(m)]; => then click and get details page of applications for that market 
//         rootKeys: ["Application"],
//         child: {
//             name: "Product name",
//             rootKeys: ["Product name"],
//             child: {
//                 name: "Properties",
//                 rootKeys: ["properties"],
//                 facets: true, // all properties are facets
//                 ignoreFacets: ["Strain at Break% CD"],
//                 advancedFacets: ["Density"], // more facets appear when user click show more
//                 hide: ["Melt Index g/10min"] // will set visible to false for the UI to determine what to do, such as not showing a certain producr property
//             }
//         }
//     }
// };

// Flat data structure i.e an array of json objects with no nesting
// jsonNesting = { 
//     name: null, // root has no name
//     rootKeys: null,
//     ignoreColumns: [] , // all columns are in the data unless they are ignored
//     staticProps: [
//         // {key: "@id", value: "id"},
//         // {key: "@context", value: "https://schema.org/"},
//         // {key: "@type", value: "Product"}
//     ]
// };

// 1 level deep
// jsonNesting = { 
//     name: null, // root has no name
//     rootKeys: [
//         { key: "Product Name",  title: "Product Name" }
//     ],
//     staticProps: [
//         { key: "@context", value: "https://schema.org/" },
//         { key: "@type", value: "Product" }
//     ],
//     id: "https://dow.com/en-us/industries/packaging/${Market segment}/${Application}/${Sub-Application}/${Functionality}/${Product Name}",
//     child: {
//         name: "properties",
//         rootKeys: null,
//         ignoreColumns: [] , // all columns are in the data unless they are ignored
//         ui: {
//             ignoreFacets: ["basis weight (gsm)", "Elastic recovery"], // all properties are assumed search facets, unless they are ignored
//             advancedFacets: ["Density"], // advanced facet = more facets appear when user click show more
//             hide: ["Melt Index g/10min"] // this is for UI hints if you should hide or show an item, all colums are visisble unless you specify then to hide
//         },
//         staticProps: [
//             { key: "@context", value: "https://schema.org/" },
//             { key: "@type", value: "Product" }
//         ],
//         id: "https://dow.com/en-us/industries/packaging/${Market segment}/${Application}/${Sub-Application}/${Functionality}/${Product Name}"
//     }
// };


jsonNesting = { 
    name: "market", // root has no name
    rootKeys: [
        { key: "sheet",  title: "sheet" }, // grouped by sheet as the top level of the hierarchy
    ],
    staticProps: [
        {key: "market", value: "${Market segment}"}
    ],
    child: {
        name: "products", // root.products
        rootKeys: null,
        staticProps: [
            {key: "@context", value: "https://schema.org/"},
            {key: "@type", value: "Product"},
            {key: "name", value: "${Product name}"},
            {key: "application", value: "${Application}"},
        ],
        child: {
            name: "properties", // root.products.properties
            id: "https://dow.com/en-us/industries/packaging/${Market segment}/${Application}/${Sub-Application}/${Functionality}/${Product Name}",
            rootKeys:  null,
            ignoreColumns: ["Product Name "] , // all columns are in the data unless they are ignored
            ui: {
                ignoreFacets: ["basis weight (gsm)", "Elastic recovery"], // all properties are assumed search facets, unless they are ignored
                advancedFacets: ["Density"], // advanced facet = more facets appear when user click show more
                hide: ["Melt Index g/10min"] // this is for UI hints if you should hide or show an item, all colums are visisble unless you specify then to hide
            },
            genericTransform: true, // transforms {"Application": "Meat&Cheese"} to { name: "Application", value: "Meat&Cheese", type: "string"  }
            staticProps: [
                {key: "@context", value: "https://schema.org/"},
                {key: "@type", value: "ProductValue"},
                {key: "computed", value: "'Results: ' + ( (${basis weight (gsm)} * (9/5)) + 32 )", eval: true} // eval js - for example convert celsius to fahrenheit
            ],
            
            // child: {
            //     name: "computed", // root.products.properties
            //     rootKeys:  null,
            //     ignoreColumns: true, // all columns are in the data unless they are ignored
            //     staticProps: [
            //         {key: "@context", value: "https://schema.org/"},
            //         {key: "@type", value: "Figures"},
            //         {key: "FahrenheitConversion", value: "'Results: ' + ( (${basis weight (gsm)} * (9/5)) + 32 )", eval: true} // eval js - for example convert celsius to fahrenheit
            //     ]
            // }

        }
    }
};


// density facet
// var prod = d.find( m => m["Market segment"] == "F&SP" && m.products.find( p=> p.Application == "Processed foods" ) )
// prod.products.filter( p=> p.properties.find( x=> x.name == "Density g/cc" && x.value == 0 ) )



module.exports = {
    ignoreSheets: ignoreSheets,
    rootKeys: rootKeys,
    rootProps: rootProps,
    ignoreProps: ignoreProps,
    idTokenized: idTokenized,
    // facets: facets,
    // advancedFacets: advancedFacets,
    //facetHierarchy: facetHierarchy,
    product: product,
    hierarchy: hierarchy,
    vocabulary: vocabulary,
    //jsonHierarchy: jsonHierarchy,
    jsonNesting: jsonNesting
}



// sheet
   // product name
       // properties
            // all other fields


// admin

// category
   // category N
      // master page of thing
         // detail page of thing 
            // facets component


// /#/category/value/master/thing/detail
// /#/market/Food and beverage/products/EVOH/properties?density=gt%203