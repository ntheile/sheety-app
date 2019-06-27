import { {{pascalCase name}}Model } from './{{pascalCase name}}.model';

export class Get{{pascalCase name}}{
    static readonly type = "[{{pascalCase name}}] Get";
    constructor(){}
}

export class Add{{pascalCase name}}{
    static readonly type = "[{{pascalCase name}}] Add";
    constructor(public payload: {{pascalCase name}}Model){}
}

export class Update{{pascalCase name}}{
    static readonly type = "[{{pascalCase name}}] Update";
    constructor(public payload: {{pascalCase name}}Model ){}
}


export class Delete{{pascalCase name}}{
    static readonly type = "[{{pascalCase name}}] Delete";
    constructor(public payload:{{pascalCase name}}Model ){}
}