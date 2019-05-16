export interface SearchOptions {
    data: any;
    keys: Array<any>;
    headerKey?: string;
    showOnly: string; 
    searchTerm: string;
    omitFields: Array<any>;
    options?: any;
    transform?(SearchOptions: SearchOptions, Environment): SearchOptions;
    routeParms?: any;
    depth?: any;
    nextSearchOptions?: SearchOptions;
    reducer?(list, keyword, SearchOptions, Environment): any;
} 