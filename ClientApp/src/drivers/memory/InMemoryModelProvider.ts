import { Injectable } from "@angular/core";
import { ModelProvider } from './../ModelProvider';

@Injectable()
export class InMemoryModelProvider implements ModelProvider  {
    
    constructor(){
        
    }
    schema;
    attrs;
    _id: string;
    fetchList (){

    };
    findOne (){

    };
    findById (){

    };
    count (){

    };
    fetchOwnList (){

    };
    save (){

    };
    saveFile (){

    };
    deleteFile (){

    };
    fetch (){
        
    };
    update (){

    };
    beforeSave (){

    };
    afterFetch (){

    };

}