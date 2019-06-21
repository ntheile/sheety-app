import { Injectable } from "@angular/core";
import { ModelProvider } from './../ModelProvider';
import { Model } from 'radiks';

@Injectable()
export class BlockstackRadiksModelProvider extends Model implements ModelProvider  {
    // the implementation comes from radiks Model per extends above in the class
    constructor(){
        super();
    }
    schema = Model.schema;
    attrs = Model.attrs;
    _id: string = Model._id;
    fetchList = Model.fetchList;
    findOne = Model.findOne;
    findById = Model.findById;
    count = Model.count;
    fetchOwnList = Model.fetchOwnList;
    save = Model.save;
    saveFile = Model.saveFile;
    deleteFile = Model.deleteFile;
    fetch = Model.fetch;
    update = Model.update;
    beforeSave = Model.beforeSave;
    afterFetch = Model.afterFetch;

}