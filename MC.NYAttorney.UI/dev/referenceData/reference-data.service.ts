import {Injectable, Inject} from '@angular/core';
import {Headers, RequestOptions, Http, Response} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {AuthHttp} from 'angular2-jwt';
import {TreeNodeModel} from '../treeView/tree-node.model'
import {MockDocuments} from '../treeView/mock-node.model'
import {LoggingService} from '../common/logging';



@Injectable()
export class ReferenceDataService {
    /** --Property Segment--
     * List of the properties.
     **/
    httpService: Http;
    authhttpservice: AuthHttp;
    apiEndpoint: string;
    appConfig: Config;
    logService: LoggingService;
    //end region

    /** --Constructor--
   * _http: HTTP request object
   * _appConfig: Config object injection 
   **/
    constructor( @Inject(Http) http, @Inject(APP_CONFIG) _appConfig: Config, @Inject(LoggingService) _logservice, @Inject(AuthHttp) _authhttp) {
        this.httpService = http;
        this.authhttpservice = _authhttp;
        this.appConfig = _appConfig;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/ReferenceData/";
        this.logService = _logservice;
    }
    //endregion

    getReferenceDatabyRowId(rowId) {

        return this.authhttpservice.get(this.apiEndpoint + 'GetComboEntitybyRowId/' + rowId)
            .map(res => res.json())
            .do(data => this.logService.log(data))
            .catch(this.handleError);
    }
        

    getDocumentFolders() {
        return this.authhttpservice.get(this.apiEndpoint + 'GetComboEntitybyCode/DocumentFolders')
            .map(res => res.json())
            .do(data => this.logService.log(data))
            .catch(this.handleError);

    }

    getDocumentTypesSelectAllByProdCat(doctTypeCat) {

        return this.authhttpservice.get(this.apiEndpoint + 'DocumentTypesSelectAllByProdCat/' + doctTypeCat)
            .map(res => res.json())
            .do(data => this.logService.log(data))
            .catch(this.handleError);

    }
    
    /** 
   * getAddressTypeList: Get default Address Type
   **/
    getddlType(ddlType) {
        return this.authhttpservice.get(this.apiEndpoint + 'GetComboEntitybyCode/' + ddlType)
            .map(res => res.json())
            .do(data => this.logService.log(data))
            .catch(this.handleError);
    }

    logError(err) {
        console.error('There was an error: ' + err);
    }

    private handleError(error: Response) {    
        return Observable.throw(error.json().error || 'Server error');
    }
}
