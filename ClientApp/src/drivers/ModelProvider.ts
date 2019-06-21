export interface ModelProvider {
    schema: Schema;
    attrs: Attrs;
    className?: string;
    _id: string;
    fetchList({}:any): any;
    findOne({}:any): any;
    findById({}:any): any;
    count({}:any): any;
    fetchOwnList({}:any): any;
    save(): any;
    saveFile({}:any): any;
    deleteFile({}:any): any;
    fetch({}:any): any;
    update({}:any): any;
    beforeSave({}:any): any;
    afterFetch({}:any): any;
}

export interface SchemaAttribute {
    type: string | Record<string, any> | any[] | number | boolean;
    decrypted?: boolean;
}

export interface Schema {
    [key: string]: SchemaAttribute | string | Record<string, any> | any[] | number | boolean;
}

export interface Attrs {
    createdAt?: number,
    updatedAt?: number,
    signingKeyId?: string,
    _id?: string
    [key: string]: any,
}

