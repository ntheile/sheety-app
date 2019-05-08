hierarchy = {
    industries: [
        {
            name: "Consumer",
            markets: [
                { 
                    "name": "Packaging",
                    submarkets: [
                        {
                            "name": "Food and Beverage",
                            applications: [
                                {
                                    "name": "Barrier Shrink Bags",
                                    subapplication: [
                                        {
                                            "name": "EVOH",
                                            products : [
                                                {
                                                    "@context": "https://schema.org",
                                                    "@uri": "/industries/packaging/food-and-beverage/meat-and-seafood/barrier-shrink-bags",
                                                    "@type": "Products",
                                                    name: "EVOH 39293",
                                                    sku: "",
                                                    gmid: "",
                                                    properties: [
                                                        {
                                                            "name": "Density",
                                                            "value": 2,
                                                            "type": "number"
                                                        }
                                                    ],
                                                    ui: [ 
                                                        { name: "group", value: "Solution | Critical | Other | Market", type: "string" },
                                                        { name: "groupingOrderIndex", value: 1, type: "number" },
                                                        { name: "facetable", value: false, type: "boolean" },
                                                        { name: "visible", value: false, type: "boolean" },
                                                        { name: "propertyGrouping", value: "Melt", type: "string" },
                                                        { name: "propertyGroupingOrderIndex", value: 1, type: "number" }
                                                    ]
                                                }
                                            ]
                                        }   
                                    ]
                                   
                                }
                            ]
                        }
                    ] 
                }
            ]
        }
    ]
}

module.exports = hierarchy;