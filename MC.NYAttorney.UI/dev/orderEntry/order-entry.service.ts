import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {AuthHttp} from 'angular2-jwt';
import {LoggingService} from '../common/logging';

@Injectable()
export class OrderEntryService {

    httpService: Http;
    authhttpservice: AuthHttp;
    result: string;
    appConfig: Config;
    apiEndpoint: string;
    logService: LoggingService;

    constructor( @Inject(Http) http, @Inject(APP_CONFIG) _appConfig: Config, @Inject(LoggingService) _logservice, @Inject(AuthHttp) _authhttp) {
        this.httpService = http;
        this.authhttpservice = _authhttp;
        this.appConfig = _appConfig;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/OrderEntry/";
        this.logService = _logservice;
    }
   
    getStateCountyByZip(zipCode) {

        return this.authhttpservice.get(this.appConfig.apiBaseUrl + "/County/GetStateCountyFromZip/" + zipCode)
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);        
    }

    getTransactionType(clientId) {
        return this.authhttpservice.get(this.apiEndpoint + "GetClientTransactionTypes/" + clientId)
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    getClientContactNames(clientId, suffix, isShowMultiLevels) {
        return this.authhttpservice.get(this.apiEndpoint + 'GetClientContactNames/' + clientId + '/' + suffix + '/' + isShowMultiLevels)
            .map(res => res.json())
            .do(data => this.logService.log(data))
            .catch(this.handleError);
    }

    getMaritalStatus() {
        return this.authhttpservice.get(this.apiEndpoint + "GetMaritalStatus")
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    saveOrderEntry(model) {
        var body = JSON.stringify(model);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + 'SaveOrderEntry/',
            body, {
                headers: headers
            })
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }
    
    getClientList(clientId) {
        return this.authhttpservice.get(this.appConfig.apiBaseUrl + "/DashBoard/GetClientList/" + clientId)
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }
}