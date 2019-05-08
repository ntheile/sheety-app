var _ = require('underscore');
var productsJson = require("./products.json");
fs = require('fs');



function main(){
    facetsAry = []
    var markets =  [...new Set( productsJson.map( m=> m.market ) )]; 
 
    for (let market of markets){

        var applications = productsJson.filter( m=> m.market == market ).map( s=> s.sheet )

        for (let application of applications){
            facets = genFacet(market, application);
            if (facets.length > 0){
                facetsAry.push(
                    {
                        market: market,
                        application: application,
                        facets: facets
                    }
                );
            }
        }

    }
    
    

    
    var jsonStr = JSON.stringify(facetsAry);
    fs.writeFile('facets.json', jsonStr, 'utf8', function(){ });
    
    console.log('Facets completed successfully!');
}

function flattenToChildArray(root, prop) {
    let flat = [];
    let children = root.map( p => p[prop]);
    // array to obj
    for ( let childArray of children) {
      for ( let childObj of childArray) {
        flat.push(childObj);
      }
    }
    return flat;
}


function genFacet(market, application){
    var facets = [];
    try{
        var prods = productsJson.find(m => m.market === market && m.sheet === application);
        prods = prods.products;
        var propsFlat = flattenToChildArray(prods, "properties");
        var facets = _.groupBy(propsFlat, "name");
        
        let tmp = [];
        for (let key of Object.keys(facets) )  {
            let data = facets[key];
            let facetObj = {};
            facetObj.name = key;
            facetObj.type = data[0].type;
            facetObj.values = [];
    
            if (facetObj.type == "string"){
                for (let item of data) {
                    facetObj.values.push(item.value);
                }
            }
    
            if (facetObj.type == "number"){
                var numsAry = data.map( m=>m.value )
                facetObj.min = Math.min(...numsAry);
                facetObj.max = Math.max(...numsAry);;
            }
            
            facetObj.values = [...new Set(facetObj.values)];
            
            tmp.push(facetObj);
        }
        facets = tmp;
       
    } catch(e){
        console.error(e);
    }
    return facets;
    

}


main();

