export interface Excel{
    sheets: Array<string>;
    name: string;
    rawData: any;
    rawJSON: any;
}
// sheets ['cars', 'commercial']
// name cars.xlsx
// rawData nvcds8(*(JDS))  
// rawJSON [{}]