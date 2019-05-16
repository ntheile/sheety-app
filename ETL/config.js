// Excel Transform Config
ignoreSheets = []
rootKeys = ["Name"]
rootProps = ["Name"];
ignoreProps = [];
idTokenized = "${Name}";

// FLAT
jsonNesting = { 
    name: null, // root has no name
    rootKeys: [
        { key: "Name",  title: "Name" }
    ],
    staticProps: [
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
// jsonNesting = { 
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
    jsonNesting: jsonNesting
}