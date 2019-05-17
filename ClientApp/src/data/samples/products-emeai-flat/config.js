// Excel Transform Config 
// (Excel to JSON-LD (Hierarchial Linked Data Transformer) )
ignoreSheets = []; // Array of sheet names to ignore in the ETL
ignoreFacets = ['sheet', 'Market Segment', 'Trade Product']; // fields you do not want to filer on
rootKeys = ["Name"]; // I.E the Thing you are trying to facet like a Product , this should be the column name of that THING
rootProps = ["Name"]; // The thing your are faceting 
ignoreProps = ["sheet", "GPL-Link", "GPL/TDS?"]; // Array of excel columns names to skip 
idTokenized = "${Name}"; // This evaluates as string interpolation. Make the ID something globally unique. Like for a product "dow/product/plastics/activecomfort/dowlex50"
outputDir = "../../ClientApp/src/data/samples/products-emeai-flat";
excelPath = outputDir + "/data.xlsx";


// FLAT
config = { 
    "name": "Trade Product", 
    "rootKeys": [
        { "key": "Trade Product",  "title": "Trade Product" }
    ],
    "staticProps": [
        { "key": "@context", "value": "https://schema.org/" },
        { "key": "@type", "value": "Product" }
    ],
    "id": "https://dow.com/EMEAI/${Trade Product}",
    "child": {
        "name": "properties",
        "rootKeys": null,
        "ignoreColumns": [] , 
        "genericTransform": true, 
        "staticProps": [
            { "key": "@context", "value": "https://schema.org/" },
            { "key": "@type", "value": "ProductValue" }
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