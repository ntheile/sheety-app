// assign reduce object as a function, to be delegated and dynamically called later on in the data service 
let reduce = function (list, keyword, searchOptions, Environment) {
    if (searchOptions.keys.includes('products.name') && searchOptions.searchTerm !== null) {
        list = list[0].products.filter(product => product.name == keyword);
    }
    return list;
}

export {
    reduce
}


