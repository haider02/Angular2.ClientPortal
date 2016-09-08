import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {LoggingService} from '../common/logging';
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class MilestoneTrackerService {
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
        this.apiEndpoint = _appConfig.apiBaseUrl + "/OrderSummary/";
    }

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }

    getMileStoneTracker(orderNo, productCode) {
        return this.authhttpservice.get(this.apiEndpoint + "GetMileStoneTracker/" + orderNo + "/" + productCode)
            .map(res => res.json())
            .do(data => this.logService.log(data))
            .catch(this.handleError);
    }
}