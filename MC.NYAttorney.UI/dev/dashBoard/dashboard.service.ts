import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {LoggingService} from '../common/logging';
import {ClientStorage} from '../common/ClientStorage';
import {ClientStorageConstants} from '../common/constants';
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class DashBoardService {
    authhttpservice: AuthHttp;
    httpService: Http;
    result: string;
    appConfig: Config;
    apiEndpoint: string;
    logService: LoggingService; 
    apiTokenURL: string;

    constructor( @Inject(Http) http, @Inject(APP_CONFIG) _appConfig: Config, @Inject(LoggingService) _logservice, @Inject(AuthHttp) _authhttp) {
        this.httpService = http;
        this.authhttpservice = _authhttp;
        this.appConfig = _appConfig;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/DashBoard/";        
        this.logService = _logservice;
        this.apiTokenURL = _appConfig.apiBaseUrl.replace("/api", "/Token");
    }
    
    handleError(error: Response) {
        var lerrorMsg = "";
        if (error.json().Message !== null)
            lerrorMsg = error.json().Message;
        else
            lerrorMsg = error.json();

        return Observable.throw(lerrorMsg || 'Server error');        
    }
    
    getClientList(clientId) {
        return this.authhttpservice.get(this.apiEndpoint + "GetClientList/" + clientId)
            .map(res => res.json())
            .do(data => this.logService.log(data)) 
            .catch(this.handleError);
    }

    getOrderDetail(model) {
        var body = JSON.stringify(model);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + 'OrderSearch',
            body, {
                headers: headers
            })
            .map(res => res.json())
            .do(data => this.logService.log(data)) 
            .catch(this.handleError);
    }

    getOrderSummary(orderNo) {
        return this.authhttpservice.get(this.apiEndpoint + "GetOrderSummary/" + orderNo)
            .map(res => res.json())
            .do(data => this.logService.log(data)) 
            .catch(this.handleError);
    }

    getLoadStartUrl() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        

        return this.authhttpservice
            .post(this.apiEndpoint + 'GetLoadStarUrl',
            null, {
                headers: headers
            })
            .map(res => res.json())
            .do(data => this.logService.log(data)) 
            .catch(this.handleError);
    }

    getDownloadDocuments() {
        return this.authhttpservice.get(this.appConfig.apiBaseUrl + "/GenerateDocument/GetDownloadDocuments/")
            .map(res => res.json())
            .do(data => this.logService.log(data)) 
            .catch(this.handleError);
    }

    getDocumentPath(model) {
        var body = JSON.stringify(model);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.appConfig.apiBaseUrl + "/GenerateDocument/GetDocumentPath/",
            body, {
                headers: headers
            })
            .map(res => res.json())
            .do(data => this.logService.log(data)) 
            .catch(this.handleError);
    }

    refreshToken() {
        var refreshToken = ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_refresh_token);
        if (refreshToken !== null) {
            var headers = new Headers();
            headers.append("Content-Type", "application/x-www-form-urlencoded");
            var body = "grant_type=refresh_token&refresh_token=" + refreshToken;

            return this.authhttpservice.post(this.apiTokenURL, body, { headers: headers })
                .map(res => res.json())
                .do(data => this.logService.log(data))
                .catch(this.handleError);
        }
    }
}