import { SheetyAppModel } from '../models/sheetyapp.model';

export class GetAllSheetyApps{
    static readonly type = "[SheetyApp] Get all";

    constructor(){}
}

export class AddSheetyApp{
    static readonly type = "[SheetyApp] Add";

    constructor(public payload: SheetyAppModel){}
}

export class RemoveSheetyApp{
    static readonly type = "[SheetyApp] Remove";

    constructor(public payload: string){}
}


export class UpdateSheetyApp{
    static readonly type = "[SheetyApp] Update";

    constructor(public payload: SheetyAppModel ){}
}


export class DeleteSheetyApp{
    static readonly type = "[SheetyApp] Delete";

    constructor(public payload: SheetyAppModel ){}
}