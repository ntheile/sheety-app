// see json-ld structured data tool - https://developers.google.com/search/docs/data-types/product
property = require('./property');

product = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": "https://www.dow.com/en-us/industries/packaging/food-and-beverage/meat-and-seafood/barrier-shrink-bags/evoh",
    "name": "EVOH",
    "industry": "Packaging",
    "market": "Food and Beverage",
    "submarket" : "Meat and Seafood",
    "application": "Barrier Shrink Bags",
    "properties": [property]
};


module.exports = product;