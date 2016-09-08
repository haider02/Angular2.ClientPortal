﻿import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {AuthHttp} from 'angular2-jwt';
import {LoggingService} from '../common/logging';

@Injectable()
export class PostCloseService {

    httpService: Http;
    authhttpservice: AuthHttp;
    result: string;
    appConfig: Config;
    apiEndpoint: string;
    logService: LoggingService;

    constructor( @Inject(Http) http, @Inject(APP_CONFIG) _appConfig: Config, @Inject(LoggingService) _logservice, @Inject(AuthHttp) _authhttp) {
        this.httpService = http;
        this.authhttpservice = _authhttp;
        this.logService = _logservice;
        this.appConfig = _appConfig;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/PostClose/";
    }

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }
    
    getRecordingDetails(orderNo) {
        return this.authhttpservice.get(this.apiEndpoint + "GetRecordingDetails/" + orderNo)
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    getLoanPolicyDetails(orderNo) {
        return this.authhttpservice.get(this.apiEndpoint + "GetLoanPolicyDetails/" + orderNo)
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    getPostCloseDocuments(orderNo) {
        return this.authhttpservice.get(this.apiEndpoint + "GetPostCloseDocuments/" + orderNo)
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    saveOrderStatus(orderNo) {
        return this.authhttpservice.get(this.apiEndpoint + "SaveOrderStatus/" + orderNo)
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }
}