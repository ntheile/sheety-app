// assign reduce object as a function, to be delegated and dynamically called later on in the data service 
let transform = function (searchOptions, Environment) {
    if (searchOptions.keys.includes('market') && searchOptions.searchTerm !== null) {
        searchOptions.omitFields = ['products.properties'];
        searchOptions.headerKey = "sheet";
        // searchOptions.showOnly = 'products.name';
    }
    if (searchOptions.keys.includes('products.name') && searchOptions.searchTerm !== null) {
        searchOptions.omitFields = null;
        searchOptions.keys.push('market');
        searchOptions.headerKey = "name";

    }
    if (searchOptions.keys.includes('sheet.name') && searchOptions.searchTerm !== null) {
        searchOptions.keys.push('sheet');
        //searchOptions.omitFields = ['products.properties'];
        searchOptions.headerKey = "name";
    }
    return searchOptions;
}

export {
    transform
}


