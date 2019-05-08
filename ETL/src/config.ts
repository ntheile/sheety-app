export class Config {
    public ignoreSheets = ['Markets'];
    rootProps = ['Product Name '];
    ignoreProps = ['Market segment'];
    _facets = [''];

    constructor() { }

    facets(): Array<string> {
        return this._facets;
    }
}
