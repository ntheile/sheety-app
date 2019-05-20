TODO
----

- [X] 1 config file 
   - [X] delete ignore.ts and read from config file
   - [X] move config from ETL to the data folder
   - [X] move hierarchy.json to the config file
   - [X] npm run etl -path "src/data/cars-nested" 
   - [X] move npm run etl to etl package.json
   - [X] ignoreProps
- [ ] filter facet down when in a nested type
- [ ] AND or LOGIC documentations
- [ ] documentation wiki 

- UI
  - [X] Templating logic for custom UI on nested datasets, if the user wants super custom UI then the can <div *ngIf="currentKey ==='CarBrand'" > <app-brand-component data="currentData"><app-brand-component> </div>
      - [X] ThingContainerComponent
         - [X]  ThingListComponent
            - [X] ThingItemComponent
               - [X] ThingPropertyComponent

- [ ] NPM package excel2jsonld