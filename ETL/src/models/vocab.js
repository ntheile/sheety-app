
vocabulary = [
    {
        "@context": "https://schema.org/",
        "@type": "DefinedTerm",
        "name": "Industry", 
        "description": "The top level heirarchy, distinct group or classifcation within a company in which things (markets/products) are classified into",
        "terms": [
            {
                "@type": "Industry",
                "name": "Consumer", 
                "symbol": "", 
                "description": ""
            },
            {
                "@type": "Industry",
                "name": "Industrial and Infrastructure", 
                "symbol": "", 
                "description": ""
            },
            {
                "@type": "Industry",
                "name": "Packaging", 
                "symbol": "", 
                "description": ""
            }
        ]
    },
    {
        "@context": "https://schema.org/",
        "@type": "DefinedTerm",
        "name": "Market", 
        "description": "The name of a top level market that defines the target that a product is sold in. An area or arena in which commercial dealings are conducted",
        "terms": [
            {
                "@type": "Market",
                "name": "Food and Beverage", 
                "symbol": "", 
                "description": ""
            },
            {
                "@type": "Market",
                "name": "Industrial and Infrastructure", 
                "symbol": "", 
                "description": ""
            },
            {
                "@type": "Industry",
                "name": "Packaging", 
                "symbol": "", 
                "description": ""
            }
        ]
    },
    {"label": "submarket", "desc": "the name of a submarket, such as Meat and Seafood" },
    {"label": "application", "desc": "the name of a applcation, such as Barrier Shrink Bags" },
    {"label": "productName", "desc": "the name of a product, such as EVOH or Dowlex" },
    {"label": "property", "desc": "the name of a property, such as Melting Point or Density" }
]
  
module.exports = vocabulary;
