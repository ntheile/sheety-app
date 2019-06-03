// Excel Transform Config 
// (Excel to JSON-LD (Hierarchial Linked Data Transformer) )
ignoreSheets = []; // Array of sheet names to ignore in the ETL
ignoreFacets = ['Name']; // fields you do not want to filer on
rootKeys = ["Name"]; // I.E the Thing you are trying to facet like a Product , this should be the column name of that THING
rootProps = ["Name"]; // The thing your are faceting 
ignoreProps = []; // Array of excel columns names to skip 
idTokenized = "${Name}"; // This evaluates as string interpolation. Make the ID something globally unique.
outputDir = "../../ClientApp/src/data/samples/cars";
excelPath = outputDir  + "/data.xlsx";

// flat
config = { 
    "name": "Name", 
    "rootKeys": [
        { "key": "Name",  "title": "Name" }
    ],
    "staticProps": [
        { "key": "@context", "value": "https://schema.org/" },
        { "key": "@type", "value": "Vehicle" }
    ],
    "id": "${Brand}/${Name}",
    "child": {
        "name": "properties",
        "rootKeys": null,
        "ignoreColumns": [] , 
        "genericTransform": true, 
        "staticProps": [
            { "key": "@context", "value": "https://schema.org/" },
            { "key": "@type", "value": "VehicleProperties" }
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