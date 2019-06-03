XLSX = require('xlsx');
var configPath = process.argv[3]; // node index -configPath ../../ClientApp/src/data/samples/cars-nested
config = require(configPath + '/config');
utils = require('./utils');
fs = require('fs');

// Loop each sheet and transform the data
var database = [];
// workbook = load('../data.xlsx');
workbook = load(config.excelPath);
sheetNames = workbook.SheetNames;

// flatten
for (sheet of sheetNames) {
    if (!config.ignoreSheets.includes(sheet)) {
        var data = flatten(sheet);
        for (const item of data) {
            database.push(item);
        }
    }
}

// transform
database = transform(database);

var jsonStr = JSON.stringify(database);
// fs.writeFile('../data.json', jsonStr, 'utf8', function(){ });
fs.writeFile(config.outputDir + "/data.json", jsonStr, 'utf8', function () { });

console.log('Transform completed successfully!');

function load(excelFile) {
    var workbook = XLSX.readFile(excelFile);
    return workbook;
}

function flatten(sheetName) {
    var data = [];
    data.sheet = sheetName;
    var sheet = workbook.Sheets[sheetName];
    var headers = utils.get_header_row(sheet);
    var json = XLSX.utils.sheet_to_json(sheet);

    for (const row of json) {
        var transform = {};
        transform.sheet = sheetName;
        for (const col of Object.keys(row)) {
            transform[col] = row[col];
        }
        data.push(transform);
    }

    return data;
}

function transform(database) {

    var data = [];

    //
    // is children or flat data structure
    //

    // is flat     
    if (config.jsonNesting.rootKeys == null) {
        var data = [];
        for (const row of database) {
            var transform = transformRow(row, config.jsonNesting);
            data.push(transform);
        }
    }
    else { // is Nested 

        var data = [];
        //for(const row of database){

        // root props
        for (const rootItem of config.jsonNesting.rootKeys) {

            // find and loop all root children
            var rootChildren = [... new Set(database.map(q => q[rootItem.key]))];
            for (const rootChild of rootChildren) {
                var transform = {};

                transform[rootItem.title] = rootChild;

                // recursive
                var childrenRows = database.filter(q => q[rootItem.key] == rootChild);

                transform[config.jsonNesting.child.name] = [];
                for (var childRow of childrenRows) {

                    // set root static props
                    transform = addStaticProps(config.jsonNesting.staticProps, childRow, transform);

                    var transformedRow = transformRow(childRow, config.jsonNesting.child, {});
                    transform[config.jsonNesting.child.name].push(transformedRow);
                }
                data.push(transform);
            }

        }

    }
    return data;
}


function transformRow(row, config, transform) {

    var expandAry = [];

    if (config.id) {
        var id = replaceTokens(config.id, row);
        transform["@id"] = id;
    }

    // add static keys
    transform = addStaticProps(config.staticProps, row, transform);

    for (const col of Object.keys(row)) {
        // ignore cols
        if (config.ignoreColumns) {

            if (config.ignoreColumns === true) {
                // ignore all columns in this transfom
            }
            else {
                if (!config.ignoreColumns.includes(col)) {
                    // expand key value?
                    if (config.genericTransform === true) {
                        var newData = Object.assign({}, transform);
                        newData.name = col;
                        newData.value = row[col];
                        newData.type = typeof (row[col]);
                        expandAry.push(newData);
                    }
                    else {
                        // normal key value
                        transform[col] = row[col];
                    }

                }
            }
        }

    }

    // add ui hints
    if (config.ui) {
        transform.ui = config.ui;
    }

    if (config.child) {
        var childTransform = transformRow(row, config.child, {});
        transform[config.child.name] = childTransform;
    }

    if (config.genericTransform === true) {
        return expandAry;
    }

    return transform;
}


function addStaticProps(staticProps, row, transform) {

    if (staticProps) {
        for (const prop of staticProps) {
            transform[prop.key] = replaceTokens(prop.value, row);
            if (prop.eval) {
                try {
                    transform[prop.key] = eval(transform[prop.key]);
                }
                catch (e) {
                    // evaluation
                }

            }
        }
    }
    return transform;
}

// dynamically replaces a string with tokens stored in an array dynamically
function replaceTokens(str, obj) {
    var tokens = [];
    var tokenizedString = null;
    //var originalCase = str;
    str = str.toLowerCase().replaceAll(" ", "");
    obj = utils.object_keys_to_lower(obj);
    obj = utils.object_keys_strip_space(obj);
    var tokensArry = str.split('${');
    for (var item of tokensArry) {
        var tokenRightBoundIndex = item.indexOf('}');
        if (tokenRightBoundIndex >= 0) {
            // get text in front of } and its your token!
            item = item.split('}')[0];
            item = item.toLowerCase().replaceAll(" ", "");
            tokens.push(item);
        }
    }
    tokenizedString = str;
    for (var token of tokens) {
        token = token.replaceAll(" ", "");
        var replaceToken = "${" + token + "}";
        tokenizedString = tokenizedString.replace(replaceToken, obj[token]);
        var a = 1;
    }
    return tokenizedString;
}
