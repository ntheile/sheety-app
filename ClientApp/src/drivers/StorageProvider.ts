// https://blog.10pines.com/2017/12/01/substitution-based-on-environments-and-di-in-angular/
export interface StorageProvider {
    getFile(path, options?): any;
    putFile(path, content, options?): any;
    deleteFile(path, options?): any;
}