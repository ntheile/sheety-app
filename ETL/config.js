// Excel Transform Config 
// (Excel to JSON-LD (Hierarchial Linked Data Transformer) )
ignoreSheets = []; // Array of sheet names to ignore in the ETL
rootKeys = ["Name"]; // I.E the Thing you are trying to facet like a Product , this should be the column name of that THING
rootProps = ["Name"]; // The thing your are faceting 
ignoreProps = []; // Array of excel columns names to skip 
idTokenized = "${Name}"; // This evaluates as string interpolation. Make the ID something globally unique. Like for a product "dow/product/plastics/activecomfort/dowlex50"

// FLAT
config = { 
    name: null, // flat root has no name
    rootKeys: [
        { key: "Name",  title: "Name" }
    ],
    staticProps: [ // these props are injected, you can use string interpolation in the value like this ${Name}
        { key: "@context", value: "https://schema.org/" },
        { key: "@type", value: "Vehicle" }
    ],
    id: "${Name}",
    child: {
        name: "properties",
        rootKeys: null,
        genericTransform: true, // need this to transform facets to key value pairs
        ignoreColumns: [] , // all columns are in the data unless they are ignored
        staticProps: [
            { key: "@context", value: "https://schema.org/" },
            { key: "@type", value: "Car" }
        ]
    }
};

// // NESTED
// config = { 
//     name: "market", // root has no name
//     rootKeys: [
//         { key: "sheet",  title: "sheet" }, // grouped by sheet as the top level of the hierarchy
//     ],
//     staticProps: [
//         {key: "market", value: "${Market segment}"}
//     ],
//     child: {
//         name: "products", // root.products
//         rootKeys: null,
//         staticProps: [
//             {key: "@context", value: "https://schema.org/"},
//             {key: "@type", value: "Product"},
//             {key: "name", value: "${Product name}"},
//             {key: "application", value: "${Application}"},
//         ],
//         child: {
//             name: "properties", // root.products.properties
//             id: "https://dow.com/en-us/industries/packaging/${Market segment}/${Application}/${Sub-Application}/${Functionality}/${Product Name}",
//             rootKeys:  null,
//             ignoreColumns: ["Product Name "] , // all columns are in the data unless they are ignored
//             ui: {
//                 ignoreFacets: ["basis weight (gsm)", "Elastic recovery"], // all properties are assumed search facets, unless they are ignored
//                 advancedFacets: ["Density"], // advanced facet = more facets appear when user click show more
//                 hide: ["Melt Index g/10min"] // this is for UI hints if you should hide or show an item, all colums are visisble unless you specify then to hide
//             },
//             genericTransform: true, // transforms {"Application": "Meat&Cheese"} to { name: "Application", value: "Meat&Cheese", type: "string"  }
//             staticProps: [
//                 {key: "@context", value: "https://schema.org/"},
//                 {key: "@type", value: "ProductValue"},
//                 {key: "computed", value: "'Results: ' + ( (${basis weight (gsm)} * (9/5)) + 32 )", eval: true} // eval js - for example convert celsius to fahrenheit
//             ],
            
//             // child: {
//             //     name: "computed", // root.products.properties
//             //     rootKeys:  null,
//             //     ignoreColumns: true, // all columns are in the data unless they are ignored
//             //     staticProps: [
//             //         {key: "@context", value: "https://schema.org/"},
//             //         {key: "@type", value: "Figures"},
//             //         {key: "FahrenheitConversion", value: "'Results: ' + ( (${basis weight (gsm)} * (9/5)) + 32 )", eval: true} // eval js - for example convert celsius to fahrenheit
//             //     ]
//             // }

//         }
//     }
// };


module.exports = {
    ignoreSheets: ignoreSheets,
    rootKeys: rootKeys,
    rootProps: rootProps,
    ignoreProps: ignoreProps,
    idTokenized: idTokenized,
    jsonNesting: config
}