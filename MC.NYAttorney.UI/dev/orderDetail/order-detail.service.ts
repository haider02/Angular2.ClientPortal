import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {LoggingService} from '../common/logging';
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class OrderDetailService {

    httpService: Http;
    result: string;
    appConfig: Config;
    apiEndpoint: string;
    authhttpservice: AuthHttp;
    logService: LoggingService;

    constructor( @Inject(Http) http, @Inject(APP_CONFIG) _appConfig: Config, @Inject(LoggingService) _logservice, @Inject(AuthHttp) _authhttp) {
        this.httpService = http;
        this.authhttpservice = _authhttp;
        this.appConfig = _appConfig;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/OrderDetail/";        
        this.logService = _logservice;
    }
    
    getMaritalStatus() {
        return this.authhttpservice.get(this.apiEndpoint + "GetMaritalStatus")
            .map(res => res.json())
            .do(data => this.logService.log(data)) 
            .catch(this.handleError);
    }

    saveOrderDeatil(model) {
        var body = JSON.stringify(model);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + 'SaveOrderDetails/',
            body, {
                headers: headers
            })
            .map(res => res.json())
            .do(data => this.logService.log(data)) 
            .catch(this.handleError);
    }

    getOrderDetails(orderNo) {
        return this.authhttpservice.get(this.apiEndpoint + "GetOrderDetails/" + orderNo)
            .map(res => res.json())
            .do(data => this.logService.log(data)) 
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        var lerrorMsg = "";
        if (error.json().Message !== null)
            lerrorMsg = error.json().Message;
        else
            lerrorMsg = error.json();
        return Observable.throw(lerrorMsg || 'Server error');
    }
}