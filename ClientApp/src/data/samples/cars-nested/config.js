// Excel Transform Config 
// (Excel to JSON-LD (Hierarchial Linked Data Transformer) )
ignoreSheets = []; // Array of sheet names to ignore in the ETL
ignoreFacets = ['sheet', 'Market segment', 'Application']; // fields you do not want to filer on
rootKeys = ["Name"]; // I.E the Thing you are trying to facet like a Product , this should be the column name of that THING
rootProps = ["Name"]; // The thing your are faceting 
ignoreProps = []; // Array of excel columns names to skip 
idTokenized = "${Name}"; // This evaluates as string interpolation. Make the ID something globally unique. Like for a product "dow/product/plastics/activecomfort/dowlex50"
outputDir = "../../ClientApp/src/data/samples/cars-nested";
excelPath = outputDir + "/data.xlsx";


// nested
config = {
    "name": "Brand", 
    "rootKeys": [
        { 
            "key": "Brand",  "title": "Brand"
        }
    ],
    "staticProps": [
        {
            "key": "Brand", "value": "${Brand}"
        }
    ],
    "child": {
        "name": "properties", 
        "id": "${Brand}/${Name}",
        "rootKeys": null,
        "ignoreColumns": [

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
                "key": "@type", "value": "VehicleProperties"
            }
        ]
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