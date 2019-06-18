import { Excel } from '../models/excel.model';

export class AddExcel{
    static readonly type = "[EXCEL] Add";

    constructor(public payload: Excel){}
}

export class RemoveExcel{
    static readonly type = "[EXCEL] Remove";

    constructor(public payload: string){}
}