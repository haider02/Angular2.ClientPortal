import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {LoggingService} from '../common/logging';
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class TitleClearanceService {
    httpService: Http;    
    result: string;
    appConfig: Config;
    apiEndpoint: string;
    logService: LoggingService;
    authhttpservice: AuthHttp;

    constructor( @Inject(Http) http, @Inject(APP_CONFIG) _appConfig: Config, @Inject(LoggingService) _logservice, @Inject(AuthHttp) _authhttp) {
        this.httpService = http;
        this.authhttpservice = _authhttp;
        this.logService = _logservice;
        this.appConfig = _appConfig;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/TitleClearance/";
    }

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }
    
    getClearanceItems(orderNo) {
        return this.authhttpservice.get(this.apiEndpoint + "GetClearanceItems/" + orderNo)
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }
    
    saveNewYorkAttorneyItem(model) {
        var body = JSON.stringify(model);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + 'SaveNewYorkAttorneyItem/',
            body, {
                headers: headers
            })
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    saveFileClearanceRequested(model) {
        var body = JSON.stringify(model);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + 'SaveFileClearanceRequested/',
            body, {
                headers: headers
            })
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    getTCCleartoCloseDetail(orderNo) {
        return this.authhttpservice.get(this.apiEndpoint + "GetTCCleartoCloseDetail/" + orderNo)
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    getTCRequestQuestionsAnswered(orderNo, requestType) {
        return this.authhttpservice.get(this.apiEndpoint + "TCRequestQuestionsAnswered/" + orderNo + "/" + requestType)
            .map(res => res.json())
            .do(data => this.logService.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }
}