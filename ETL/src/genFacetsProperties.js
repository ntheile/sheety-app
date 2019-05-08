var _ = require('underscore');
var productsJson = require("./products.json");
config = require('./config');
fs = require('fs');
d3 = require('d3-collection');
d3Ary = require('d3-array');

childPropertiesLeaf = [];
keyPath = null;
propsArray = [];

function main() {
    facetsAry = [];



    findPropertiesLeaf(productsJson);

    // var markets =  [...new Set( productsJson.map( m=> m.market ) )]; 

    // for (let market of markets){

    //     var applications = productsJson.filter( m=> m.market == market ).map( s=> s.sheet )

    //     for (let application of applications){
    //         facets = genFacet(market, application);
    //         if (facets.length > 0){
    //             facetsAry.push(
    //                 {
    //                     market: market,
    //                     application: application,
    //                     facets: facets
    //                 }
    //             );
    //         }
    //     }

    // }


    // break into nested heirarchy, one for each property
    let facets = d3.nest().key(d => d.name).rollup((leaves) => {
        let reduced = d3.map(leaves, (d) => { return d.value });
        return reduced;
    }).entries(propsArray);


    // break up the numbers and strings
    let numbersArray = [];
    for (const [index, facet] of facets.entries()) {

        for ( facetProps of facet.value.entries() ) {
            if (facetProps.value.type == "number"){
                numbersArray.push({ [facetProps.value.name]:  facet.value });
                break;
            }
            let a = 1;
        }

        let b = 1;

    }

    // find min max for numbers
    for (let numItem of numbersArray){
        let rawNums = [];
        let key = Object.keys(numItem)[0];
        let a = 1;
        for (let num of numItem[key].entries()){
            rawNums.push(num.value.value);
            let a = 1;
        }

        let min = d3Ary.min(rawNums);
        let max = d3Ary.max(rawNums);

        let updateFacet = facets.find( d=>d.key == key );
        updateFacet.min = min;
        updateFacet.max = max;

    }

    // re-model, remove weird keys
    for(let facet of facets){
        let a = 1;
        facet.values = [];
        for (let obj of facet.value.entries()){
            facet.values.push(obj.value);
        }
        delete facet.value;
    }

    var jsonStr = JSON.stringify(facets);
    fs.writeFile('facets.json', jsonStr, 'utf8', function () { });

    console.log('Facets completed successfully!');
}


function findPropertiesLeaf(data) {




    for (let child of data) {

        for (let key of Object.keys(child)) {
            if (key == "properties") {
                let hey = 'ya';
                for (let grandKid of child.properties) {
                    if (grandKid.length) {
                        for (let prop of grandKid) {
                            prop[config.jsonNesting.name] = child[config.jsonNesting.name];
                            propsArray.push(prop);
                        }
                    } else {
                        propsArray.push(grandKid);
                    }
                }
            } else {

                // search child leaves for the key "properties"
                // loop thru the config props

                if (child.child) {
                    findPropertiesLeaf(child.child);
                }
                else{
                    let childKeyName = config.jsonNesting.child.name;
                    let childNode = child[childKeyName];
                    if(childNode){
                        findPropertiesLeaf(childNode);
                    }
                }
            }
        }
    }
}

function flattenToChildArray(root, prop) {
    let flat = [];
    let children = root.map(p => p[prop]);
    // array to obj
    for (let childArray of children) {
        for (let childObj of childArray) {
            flat.push(childObj);
        }
    }
    return flat;
}


function genFacet(market, application) {
    var facets = [];
    try {
        var prods = productsJson.find(m => m.market === market && m.sheet === application);
        prods = prods.products;
        var propsFlat = flattenToChildArray(prods, "properties");
        var facets = _.groupBy(propsFlat, "name");

        let tmp = [];
        for (let key of Object.keys(facets)) {
            let data = facets[key];
            let facetObj = {};
            facetObj.name = key;
            facetObj.type = data[0].type;
            facetObj.values = [];

            if (facetObj.type == "string") {
                for (let item of data) {
                    facetObj.values.push(item.value);
                }
            }

            if (facetObj.type == "number") {
                var numsAry = data.map(m => m.value)
                facetObj.min = Math.min(...numsAry);
                facetObj.max = Math.max(...numsAry);;
            }

            facetObj.values = [...new Set(facetObj.values)];

            tmp.push(facetObj);
        }
        facets = tmp;

    } catch (e) {
        console.error(e);
    }
    return facets;


}


main();

