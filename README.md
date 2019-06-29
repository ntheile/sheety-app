# Sheety App

https://sheety.app


## ETL

## Vocabulary
- facet: something that is searchable, filterable, refinable. Think filtering for products on Amazon
- thing: any generic thing like a product or name
- 

## Config

## Nested vs Flat Data Structure

## Environment

## Reducer

## Tranformer

## HomeComponent

## FacetComponent

## Dynamic Routing and Breadcrumbs

## Excel Format



<pre>
FacetComponent
ThingContainerComponent
    |_ ThingListComponent
        |_ ThingItemComponent
            |_ ThingPropertiesComponent
</pre>



TODO
----

- [X] save paths for raw files
- [ ] icons
- [ ] laoding spinners
- [ ] dialog for new features
- [ ] fix categories and breadcrumbs
- [ ] Share *COMING SOON
- [ ] Sell *COMCING SOON
- [ ] public files *COMING SOON
     - [ ] set public names
     - [ ] decrypt in gaia putFile
     - [ ] AuthGuard
        - [ ] in app component if querystring then quert radiks if its a public endpoint
            - [ ] No then contineu as normal with login
            - [ ] Yes public then download unencrypted content

                        - [ ] Remove auth logic from app.component
                        - [ ] Add Anonymous route to load public data
                        - [ ] Add Auth Guard to all other routes

- [ ] make public sheet for blockstack app mining results 
- [ ] if view is category then open first item on details page
- [ ]
- [ ]