// Excel Transform Config 
// (Excel to JSON-LD (Hierarchial Linked Data Transformer) )
ignoreSheets = ['sheet']; // Array of sheet names to ignore in the ETL
ignoreFacets = ['sheet', 'Market segment', 'Application']; // fields you do not want to filer on
rootKeys = ["Name"]; // I.E the Thing you are trying to facet like a Product , this should be the column name of that THING
rootProps = ["Name"]; // The thing your are faceting 
ignoreProps = []; // Array of excel columns names to skip 
idTokenized = "${Name}"; // This evaluates as string interpolation. Make the ID something globally unique. Like for a product "dow/product/plastics/activecomfort/dowlex50"
outputDir = "../../ClientApp/src/data/samples/products-plastics-nested";
excelPath = outputDir + "/data.xlsx";


// Nested
config = {
    "name": "market", 
    "rootKeys": [
        { 
            "key": "sheet",  "title": "sheet"
        }
    ],
    "staticProps": [
        {
            "key": "market", "value": "${Market segment}"
        }
    ],
    "child": {
        "name": "sheet",
        "rootKeys": { 
            "key": "sheet",  "title": "sheet"
        },
        "staticProps": [
            {
                "key": "@context", "value": "https://schema.org/"
            },
            {
                "key": "@type", "value": "Product"
            },
            {
                "key": "name", "value": "${Product name}"
            },
            {
                "key": "application", "value": "${Application}"
            }
        ],
        "child": {
            "name": "products",
            "rootKeys": null,
            "staticProps": [
                {
                    "key": "@context", "value": "https://schema.org/"
                },
                {
                    "key": "@type", "value": "Product"
                },
                {
                    "key": "name", "value": "${Product name}"
                },
                {
                    "key": "application", "value": "${Application}"
                }
            ],
            "child": {
                "name": "properties", 
                "id": "https://dow.com/en-us/industries/packaging/${Market segment}/${Application}/${Sub-Application}/${Functionality}/${Product Name}",
                "rootKeys": null,
                "ignoreColumns": [
                    "Product Name "
                ], 
                "ui": {
                    "ignoreFacets": [
                        "basis weight (gsm)",
                        "Elastic recovery"
                    ], 
                    "advancedFacets": [
                        "Density"
                    ], 
                    "hide": [
                        "Melt Index g/10min"
                    ]
                },
                "genericTransform": true, 
                "staticProps": [
                    {
                        "key": "@context", "value": "https://schema.org/"
                    },
                    {
                        "key": "@type", "value": "ProductValue"
                    }
                ]
            }

        }
    }
}

module.exports = {
    ignoreSheets: ignoreSheets,
    rootKeys: rootKeys,
    rootProps: rootProps,
    ignoreProps: ignoreProps,
    idTokenized: idTokenized,
    jsonNesting: config,
    excelPath: excelPath,
    outputDir: outputDir,
    ignoreFacets: ignoreFacets
}