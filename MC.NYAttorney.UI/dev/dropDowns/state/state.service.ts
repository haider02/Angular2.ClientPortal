import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import {Injectable, Inject} from '@angular/core';
import {Config, APP_CONFIG, CONFIG} from '../../app-config';
import {LoggingService} from '../../common/logging';
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class StateService {
    
   /** --Property Segment--
    * List of the properties.
    **/
    httpService: Http;
    authhttpservice: AuthHttp;
    appConfig: Config;
    apiEndpoint: string;
    logService: LoggingService;    

    /** --Constructor--
    * _http: HTTP request object
    * _appConfig: Config object injection 
    **/
    constructor( @Inject(Http) http, @Inject(APP_CONFIG) _appConfig: Config, @Inject(LoggingService) _logservice, @Inject(AuthHttp) _authhttp) {
        this.httpService = http;
        this.authhttpservice = _authhttp;
        this.appConfig = _appConfig;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/state/";
        this.logService = _logservice;
    }

    /** --Method Segment--
    **/
    getState() {
        return this.authhttpservice.get(this.apiEndpoint+"get")
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }
    
    getCurrentTime() {
        return this.authhttpservice.get("http://date.jsontest.com")
            .map(res => res.json());
    }
    
    private handleError(error: Response) {    
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
