// assign reduce object as a function, to be delegated and dynamically called later on in the data service 
let transform = function (searchOptions, Environment) {
    searchOptions.omitFields = null;
    return searchOptions;
}

export {
    transform
}


