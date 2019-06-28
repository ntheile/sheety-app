import { Injectable } from "@angular/core";
import { StorageProvider } from './../StorageProvider';
declare let userSession: any; // this is blockstack js in the global state with the userSession

@Injectable()
export class BlockstackStorageProvider implements StorageProvider {
    
    getFile(path, options?) {
        console.log('getFile');
        return userSession.getFile(path, options || null);
    }
    
    putFile(path, content, options?) {
        console.log('putFile');
        return userSession.putFile(path, content,  options || null);
    }

    deleteFile(path, options?) {
        console.log('putFile');
        return userSession.deleteFile(path, options || null);
    }

}