import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {AuthHttp} from 'angular2-jwt';
import {LoggingService} from '../common/logging';

@Injectable()
export class PreCloseService {

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
        this.apiEndpoint = _appConfig.apiBaseUrl + "/PreClose/";
    }

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }
    
    getSignatureRequirement(orderNo) {
        return this.authhttpservice.get(this.apiEndpoint + "GetSignatureRequirement/" + orderNo)
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    getPreCloseDetails(orderNo) {
        return this.authhttpservice.get(this.apiEndpoint + "GetPreCloseDetails/" + orderNo)
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    getPreCloseDocuments(orderNo) {
        return this.authhttpservice.get(this.apiEndpoint + "GetPreCloseDocuments/" + orderNo)
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    savePreClose(model) {
        var body = JSON.stringify(model);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + 'SavePreCloseDetail/',
            body, {
                headers: headers
            })
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }
}