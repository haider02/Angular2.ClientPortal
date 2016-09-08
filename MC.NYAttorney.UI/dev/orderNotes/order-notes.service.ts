import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {LoggingService} from '../common/logging';
import {OrderNotesModel} from './order-notes.model';
import {AuthHttp} from 'angular2-jwt';


@Injectable()
export class OrderNotesService {
    /** --Property Segment--
    * List of the properties.
    **/
    authhttpservice: AuthHttp;
    httpService: Http;
    result: string;
    appConfig: Config;
    apiEndpoint: string;
    
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
        this.apiEndpoint = _appConfig.apiBaseUrl + "/OrderNotes/";
        this.logService = _logservice;
    }
    //end region


    /** --Method Segment--
  **/

    /** * getNotesByOrder:Get Order Notes**/
    getNotesByOrder(OrderNo) {
        return this.authhttpservice.get(this.apiEndpoint + 'GetOrderNotesByOrderNo/' + OrderNo)
            .map(res => res.json())
            .do(data => this.logService.log(data));// eyeball results in the console            
    }

    /** * createNotesByVendor: Insert Note Record**/
    createNotes(model) {
        var body = JSON.stringify(model);
        
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.authhttpservice
            .post(this.apiEndpoint,
            body, {
                headers: headers
            })
            .map(response => response.json())
    }

    /** * logError: log eror**/
    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }
}