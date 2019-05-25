// Excel Transform Config 
// (Excel to JSON-LD (Hierarchial Linked Data Transformer) )
ignoreSheets = []; // Array of sheet names to ignore in the ETL
ignoreFacets = []; // fields you do not want to filer on
rootKeys = ["App Name"]; // I.E the Thing you are trying to facet like a Product , this should be the column name of that THING
rootProps = ["App Name"]; // The thing your are faceting 
ignoreProps = []; // Array of excel columns names to skip 
idTokenized = "${App Name}"; // This evaluates as string interpolation. Make the ID something globally unique. Like for a product "dow/product/plastics/activecomfort/dowlex50"
outputDir = "../../ClientApp/src/data/samples/blockstack";
excelPath = outputDir  + "/data.xlsx";

// flat
config = {
    "name": "App Name",
    "rootKeys": [
      {
        "key": "App Name",
        "title": "App Name"
      }
    ],
    "staticProps": [
      {
        "key": "@context",
        "value": "https://schema.org/"
      },
      {
        "key": "@type",
        "value": "App"
      }
    ],
    "id": "${App Name}",
    "child": {
      "name": "properties",
      "rootKeys": null,
      "ignoreColumns": [],
      "genericTransform": true,
      "staticProps": [
        {
          "key": "@context",
          "value": "https://schema.org/"
        },
        {
          "key": "@type",
          "value": "Result"
        }
      ]
    }
  };


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