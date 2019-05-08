XLSX = require('xlsx');
config = require('./config');
utils = require('./utils');
fs = require('fs');

// Loop each sheet and transform the data
var database = [];
workbook = load('products.xlsx');
sheetNames = workbook.SheetNames;
for (sheet of sheetNames) {
    if ( !config.ignoreSheets.includes(sheet) ){
        var data = transform(sheet);
        database.push(data);
    }
}

var jsonStr = JSON.stringify(database);
fs.writeFile('products.json', jsonStr, 'utf8', function(){ });

console.log('Transform completed successfully!');

function load(excelFile) {
    var workbook = XLSX.readFile(excelFile);
    return workbook;
}

function transform(sheetName) {

    var data = {};
    data.sheet = sheetName;
    var sheet = workbook.Sheets[sheetName];    
    var headers = utils.get_header_row(sheet);
    var json = XLSX.utils.sheet_to_json(sheet);
    var products = [];

    for (const row of json){
        var transform = {};
        transform["@context"] = "https://schema.org/";
        transform["@type"] = "Product";
        var id = utils.replaceTokens(config.idTokenized, row);
        transform["@id"] = id;
        transform.properties = [];
        for (const col of Object.keys(row)) {

            // root keys
            if (config.rootKeys.includes(col)) {
                data[col] = row[col]
            } 

            // loop props
            if (config.rootProps.includes(col)) {
                transform[col] = row[col]
            } else {
                if ( utils.should_show_column(col)) {
                    
                    // rootKey
                    if (config.rootKeys.includes(col)){
                        transform[col] = row[col];
                    } // or PropKeys
                    else {
                        transform.properties.push(
                            {
                               "@type": "PropertyValue",
                               name: col ,
                               value:  row[col],
                               type: typeof( row[col]),
                               ui: {
                                    "facet": "true",
                                    "advancedFacet": "false",
                                    "visible": "true"
                               }
                            }
                        );
                    }
                }
            }
        }
        products.push(transform);
    }

    data.products = products;    

    return data;

}
