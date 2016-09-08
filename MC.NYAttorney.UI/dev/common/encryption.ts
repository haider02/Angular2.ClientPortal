import {ClientStorage} from '../common/ClientStorage';
import {ClientStorageConstants} from '../common/constants';
declare var jQuery;

export class EncryptionService {
    public static encryptItem(name: string): string {
        return this.executeStringAction(name, "EncryptItem");
    }

    public static decryptItem(name: string): string {
        return this.executeStringAction(name, "DecryptItem");
    }

   private static executeStringAction(key: string, action: string) {
       let lReturnVal: string;
       jQuery.ajax({
           url: ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_apiURL) + '/Administration/' + action + '/' + key,
           headers: {'Authorization': 'Bearer ' + ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_id_token) },
           cache: false,
           contentType: false,
           processData: false,
           async: false,
           type: 'GET',
           success: d => lReturnVal = d,
           error: e => lReturnVal = e
       });
       return lReturnVal;
   }
}