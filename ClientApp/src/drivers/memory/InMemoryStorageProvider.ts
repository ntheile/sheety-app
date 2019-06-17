import { Injectable } from "@angular/core";
import { StorageProvider } from './../interfaces/StorageProvider';

@Injectable()
export class InMemoryStorageProvider implements StorageProvider {
    
    getFile(id) {
        console.log('getFile');
        return new Promise((resolve) => {
            let data = localStorage.getItem(id);
            resolve(data);
        });
    }
    
    putFile(path, content, config?) {
        console.log('putFile');
    }

}