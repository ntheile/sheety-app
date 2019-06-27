import { SheetyAppDataModel } from '../models/sheetyapp.data.model';

export class GetData {
    static readonly type = "[SheetyApp Data] Get Data by path";

    constructor(public payload: SheetyAppDataModel){}
}

export class AddData {
    static readonly type = "[SheetyApp Data] Add";

    constructor(public payload: SheetyAppDataModel){}
}

export class UpdateData{
    static readonly type = "[SheetyApp Data] Update";

    constructor(public payload: SheetyAppDataModel ){}
}


export class DeleteData {
    static readonly type = "[SheetyApp Data] Delete";

    constructor(public payload: SheetyAppDataModel ){}
}