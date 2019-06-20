import { Injectable } from "@angular/core";
import { StorageProvider } from '../StorageProvider';

@Injectable()
export class InMemoryStorageProvider implements StorageProvider {
    
    getFile(path) {
        return new Promise((resolve) => {
            let data = localStorage.getItem(path);
            resolve(data);
        });
    }
    
    putFile(path, content, config?) {
        return new Promise((resolve) => {
            let data = localStorage.setItem(path, content);
            resolve('sucess');
        });
    }

    deleteFile(path){
        return new Promise((resolve) => {
            let data = localStorage.removeItem(path);
            resolve('sucess');
        });
    }

}