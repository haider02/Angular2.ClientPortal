﻿import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {LoggingService} from '../common/logging';
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class OrderTitleService {
    authhttpservice: AuthHttp;
    httpService: Http;
    result: string;
    appConfig: Config;
    apiEndpoint: string;
    logService: LoggingService;

    constructor( @Inject(Http) http, @Inject(APP_CONFIG) _appConfig: Config, @Inject(LoggingService) _logservice, @Inject(AuthHttp) _authhttp) {
        this.httpService = http;
        this.authhttpservice = _authhttp;
        this.logService = _logservice;
        this.appConfig = _appConfig;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/OrderTitle/";
    }


    GetOrderTitleDetail(OrderNo) {
        return this.authhttpservice.get(this.apiEndpoint + "GetOrderTitleDetail/" + OrderNo)
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    AddTitleBillReqEvent(OrderNo) {        
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + 'CPAddTitleRequestEvent/' + OrderNo,
            '', {
                headers: headers
            })
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    CPAddTitleProduct(OrderNo) {        
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + 'CPAddTitleProduct/' + OrderNo,
            '', {
                headers: headers
            })
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    GetDocuments(OrderNo) {
        return this.authhttpservice.get(this.apiEndpoint + 'CPGetTitleDocumentsSelectAll/' + OrderNo)
            .map(res => res.json())
            .do(data => data)
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }
    
}