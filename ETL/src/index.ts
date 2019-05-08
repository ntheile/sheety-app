import { Config } from './config.ts';
const XLSX = require('xlsx');
import { Utils } from './utils.ts';
import * as fs from 'fs';

let config = Config;
let utils =  Utils;
let database = [];
let path = "./etl/products.xlsx";
if (!fs.existsSync(path)) {
    path = "products.xlsx";
}
let workbook = load(path);
let sheetNames = workbook.SheetNames;
for (let sheet  of sheetNames) {
    if ( !config.ignoreSheets.includes(sheet) ){
        transform(sheet);
    }
}

let jsonStr = JSON.stringify(this.database);
fs.writeFile('products.json', jsonStr, 'utf8', function() { });

function load(excelFile: any) {
    let workbook = XLSX.readFile(excelFile);
    return workbook;
}

function transform(sheetName: any) {

    let sheet = workbook.Sheets[sheetName];
    let headers = utils.get_header_row(sheet);
    let json = XLSX.utils.sheet_to_json(sheet);
    let products = [];

    for (const row of json) {
        let transform = {};
        transform.properties = [];
        for (const col of Object.keys(row)) {
            if (config.rootProps.includes(col)) {
                transform[col] = row[col]
            } else {
                if ( utils.should_show_column(col)) {
                    transform.properties.push(
                        {
                           name: col ,
                           value:  row[col],
                           type: typeof( row[col])
                        }
                    );
                }
            }
        }
        products.push(transform);
    }

    database.push({
        market: this.sheetName,
        products: products
    });
}
