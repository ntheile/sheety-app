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

- ETL
   - [ ] Use the broswer to upload excel and ETL in browser
      - [X] index.js port
      - [X] facets.js port
      - [ ] write logic, blob storage
      - [ ] normalize case differences, For example one sheet might read "App Name" to next sheet might read "App name". This
            can done in the UI. After the user picks what "thing" and column he wants to facet, the ui will check all sheets for similar names and normalized at that point.
      - [ ] If multiple sheets contain the same info, then in facets fitler properties for the "thing" of the non selected sheet
      - [ ] port of ignore fields
- [ ] Port data access code to BehaviorSubjects

- [ ] NPM package excel2jsonld