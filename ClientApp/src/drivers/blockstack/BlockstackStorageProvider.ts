import { Injectable } from "@angular/core";
import { StorageProvider } from './../StorageProvider';
declare let blockstack: any;

@Injectable()
export class BlockstackStorageProvider implements StorageProvider {
    
    getFile(id) {
        console.log('getFile');
        return blockstack.getFile(id);
    }
    
    putFile(path, content, config?) {
        console.log('putFile');
    }

}