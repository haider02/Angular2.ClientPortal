﻿import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Config, APP_CONFIG, CONFIG} from '../../app-config';
import {LoggingService} from '../../common/logging';
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class SecurityFormControlService {
    authhttpservice: AuthHttp;
    httpService: Http;
    result: string;
    appConfig: Config;
    apiEndpoint: string;
    logService: LoggingService;

    constructor( @Inject(Http) http, @Inject(APP_CONFIG) _appConfig: Config, @Inject(LoggingService) _logservice, @Inject(AuthHttp) _authhttp) {
        this.httpService = http;
        this.authhttpservice = _authhttp;
        this.appConfig = _appConfig;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/Administration/";
        this.logService = _logservice;
    }
    
    getAllSecurityFormControls(applicationId) {
        return this.authhttpservice.get(this.apiEndpoint + "CPGetSecurityControlFormGridList/" + applicationId)
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }

    saveSecurityFormControls(model) {
        var body = JSON.stringify(model);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + 'InsertUpdateSecurityFormControl/',
            body, {
                headers: headers
            })
            .map(res => res.json())
            .do(data => this.logService.log(data))
            .catch(this.handleError);
    }

    deleteSecurityFormControl(securityFormId) {        
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + 'DeleteSecurityFormControl/' + securityFormId,
            '', {
                headers: headers
            })
            .map(res => res.json())
            .do(data => this.logService.log(data))
            .catch(this.handleError);
    }
}