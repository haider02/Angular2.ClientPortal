import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {AuthHttp} from 'angular2-jwt';
import {ClientStorage} from '../common/ClientStorage';
import {LoggingService} from '../common/logging';
import {ClientStorageConstants} from '../common/constants';
@Injectable()
export class PropertyDetailService {

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
        this.apiEndpoint = _appConfig.apiBaseUrl + "/PropertyDetail/";
    }

    private handleError(error: Response) {
        var lerrorMsg = "";

        if (error.json().Message !== null)
            lerrorMsg = error.json().Message;
        else
            lerrorMsg = error.json();
        return Observable.throw(lerrorMsg || 'Server error');
    }

    getStateCountyByZip(zipCode) {
        this.logService.log(ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_id_token));
        return this.authhttpservice.get(this.appConfig.apiBaseUrl + "/County/GetStateCountyFromZip/" + zipCode)
            .map(res => res.json())
            .do(data => this.logService.log(data)) 
            .catch(this.handleError);        
    }
    
    savePropertyDetail(model) {
        var body = JSON.stringify(model);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + 'SavePropertyDetail/',
            body, {
                headers: headers
            })
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    getOrderHeader(orderNo) {
        return this.authhttpservice.get(this.apiEndpoint + "GetOrderHeader/" + orderNo)
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    getPropertyDetail(orderNo) {
        return this.authhttpservice.get(this.apiEndpoint + "GetPropertyDetail/" + orderNo)
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }
}