import {EncryptionService} from '../common/encryption';

export class ClientStorage {


    public static setSessionStorageItem(name: string, value: string) {
        let lVal = value;
        //if (name.endsWith("_Encrypt"))
            //lVal = EncryptionService.encryptItem(value);
        sessionStorage.setItem(name, lVal);
    }

    public static removeSessionStorageItem(name: string) {
        sessionStorage.removeItem(name);
    }

    public static getSessionStorageItem(name: string): any {
        let lVal = sessionStorage.getItem(name);        

        //if (name.endsWith("_Encrypt"))
          //  EncryptionService.decryptItem(lVal);

        return lVal;
    }
    public static clearSessionStorage() {
        sessionStorage.clear();
    }



    public static setLocalStorageItem(name: string, value: string) {
        let lVal = value;
        //if (name.endsWith("_Encrypt"))
        //lVal = EncryptionService.encryptItem(value);
        localStorage.setItem(name, lVal);
    }

    public static removeLocalStorageItem(name: string) {
        localStorage.removeItem(name);
    }

    public static getLocalStorageItem(name: string): any {
        let lVal = localStorage.getItem(name);

        //if (name.endsWith("_Encrypt"))
        //  EncryptionService.decryptItem(lVal);

        return lVal;
    }
    public static clearLocalStorage() {
        localStorage.clear();
    }
}