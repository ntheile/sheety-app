export class ToggleShow {
    static readonly type = '[Toggle] Show';
    constructor(public target:string) { }
  }​
  export class ToggleHide {
    static readonly type = '[Toggle] Hide';
    constructor(public target:string) { }
  }​