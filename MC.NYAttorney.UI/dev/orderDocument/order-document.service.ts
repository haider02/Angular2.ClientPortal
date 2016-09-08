import {Headers, RequestOptions,Http, Response} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import {Injectable, Inject} from '@angular/core';
import {AuthHttp} from 'angular2-jwt';
import {TreeNodeModel} from '../treeView/tree-node.model'
import {MockDocuments} from '../treeView/mock-node.model'
import {LoggingService} from '../common/logging';
import {DocumentModel} from '../orderDocument/order-document.model'
import {Config, APP_CONFIG, CONFIG} from '../app-config';


@Injectable()
export class DocumentService {
    /** --Property Segment--
    * List of the properties.
    **/
    httpService: Http;
    authhttpservice: AuthHttp;
    appConfig: Config;
    apiEndpoint: string; 
    
    logService: LoggingService;

    /** --Constructor--
    *   _service: Service object injection
    *   _appConfig: Config object injection 
    **/
    constructor( @Inject(Http) _service, @Inject(APP_CONFIG) _appConfig: Config, @Inject(LoggingService) _logservice, @Inject(AuthHttp) _authhttp) {
        this.httpService = _service;
        this.authhttpservice = _authhttp;
        this.appConfig = _appConfig;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/Document";
        this.logService = _logservice;
    }
    
    /** --getDocuments--
    *   Gets document by vendor id
    **/
    getDocuments(id) {
        return this.authhttpservice.get(this.apiEndpoint + '/GetDocumentsById/' + id)
            .map(res => res.json())
            .do(data => data )
            .catch(this.handleError);
    }
    
    /** --getDocuments--
    *   Gets document relative path
    **/
    GetDocPath(id) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice.get(this.apiEndpoint + '/GetDocPath/' + id)
            .map(res => res.json())
            .do(data => data )
            .catch(this.handleError);
    }

    /** --getOrderDetails--
    *   Gets order Details relative path
    **/
    GetOrderDetail(orderNo) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice.get(this.apiEndpoint + '/GetOrderDetailByOrderNo/' + orderNo)
            .map(res => res.json())
            .do(data => data)
            .catch(this.handleError);
    }

    /** --addDocument--
    *   add document post call
    **/
    addDocument(docment: DocumentModel,handler) {
        //this.u1(docment,handler);
        //var body = JSON.stringify(docment);
        //this.logService.log(body);
        //var headers = new Headers(); 
        //headers.append('Content-Type', 'application/json');
        //var fd = new FormData();
        //fd.append('file', docment.file); 

        //return this.authhttpservice
        //    .post(this.apiEndpoint + '/AddDocument',
        //    body, {
        //        headers: headers 
                
        //    })
        //    .map(response => response.json())
        //    .do(data => data)
        //    .catch(this.handleError);
    }

    /** --updateDocument--
    *   update document post call
    **/
    updateDocument(modelEntity: DocumentModel) { 
        var body = JSON.stringify(modelEntity);
        this.logService.log(body);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.authhttpservice
            .post(this.apiEndpoint + '/UpdateDocument',
            body, {
                headers: headers

            })
            .map(response => response.json())
            .do(data => data)
            .catch(this.handleError);
    }
    
    /** --deleteDocument--
    *   delete document post call
    **/
    deleteDocument(docment: DocumentModel) {
        docment.DocumentFolder = 'ddddd';
        var body = JSON.stringify(docment);
        this.logService.log(body);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        
        return this.authhttpservice
            .post(this.apiEndpoint + '/DeleteDocument',
            body, {
                headers: headers
            })
            .map(response => response.json())
            .subscribe(
            response => this.logService.log(response),
            this.handleError,
            () => this.logService.log('update Call Sent')
            );
    }
    
    
    mergeDocument(docments) {
        var body = JSON.stringify(docments);
        this.logService.log(body);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + '/MergeDocument',
                body, {
                    headers: headers

                })
            .map(response => response.json())
            .do(data => data)
            .catch(this.handleError);
    }

    mergeTitleDocument(rowIds) {
        var body = JSON.stringify(rowIds);
        this.logService.log(body);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + '/MergeTitleDocument',
            body, {
                headers: headers

            })
            .map(response => response.json())
            .do(data => data)
            .catch(this.handleError);
    }
    
    /** --deleteDocuments--
    *   delete documents post call
    **/
    deleteDocuments(docments: Array<DocumentModel>) { 
        var body = JSON.stringify(docments);
        this.logService.log(body);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.authhttpservice
            .post(this.apiEndpoint + '/DeleteDocuments',
            body, {
                headers: headers
            })
            .map(response => response.json())
            .do(data => data)
            .catch(this.handleError);
    }
    
    /** --lockDocuments--
    *   lock documents post call
    **/
    lockDocuments(docments: Array<DocumentModel>, lockStatus: boolean) { 
        var body = JSON.stringify(docments);
        this.logService.log(body);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var url = this.apiEndpoint;
       if (lockStatus)
           url += '/LockDocuments';
       else
           url += '/UnLockDocuments';
       return this.authhttpservice
            .post(url,
            body, {
                headers: headers
            })
            .map(response => response.json())
            .do(data => data)
            .catch(this.handleError);
    }
    
    /** --EmailDocument--
    *   email document 
    **/
    EmailDocument(obj) {
        var body = JSON.stringify(obj);
        this.logService.log(body);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var url = this.apiEndpoint + '/EmailDocument';
        return this.authhttpservice
            .post(url,
                body, {
                    headers: headers
                })
            .map(response => response.json())
            .do(data => data)
            .catch(this.handleError);
    }


    SaveUploadDocument(obj) {
        var body = JSON.stringify(obj);        
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var url = this.apiEndpoint + '/SaveUploadDocument';
        return this.authhttpservice
            .post(url,
                body, {
                    headers: headers
                })
            .map(response => response.json())
            .do(data => data)
            .catch(this.handleError);
    }

    
    /** --handleError--
    *   Error handler for all post calls
    **/
    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

}
