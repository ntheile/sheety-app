import { SheetyappModel } from './sheetyapp.model';

export class GetSheetyapp{
    static readonly type = "[Sheetyapp] Get";
    constructor(){}
}

export class AddSheetyapp{
    static readonly type = "[Sheetyapp] Add";
    constructor(public payload: SheetyappModel){}
}

export class UpdateSheetyapp{
    static readonly type = "[Sheetyapp] Update";
    constructor(public payload: SheetyappModel ){}
}


export class DeleteSheetyapp{
    static readonly type = "[Sheetyapp] Delete";
    constructor(public payload:SheetyappModel ){}
}