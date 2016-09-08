import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {Observable} from 'rxjs/Observable';
import {LoggingService} from '../common/logging';
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class AccountProfileService {
    httpService: Http;
    authhttpservice: AuthHttp;
    apiEndpoint: string;
    appConfig: Config;
    logService: LoggingService;

    constructor( @Inject(Http) http, @Inject(APP_CONFIG) _appConfig: Config, @Inject(LoggingService) _logservice, @Inject(AuthHttp) _authhttp) {
        this.httpService = http;
        this.authhttpservice = _authhttp;
        this.appConfig = _appConfig;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/Account/";
        this.logService = _logservice;
    }


    getAccountDetails(contactID) {
        return this.authhttpservice.get(this.apiEndpoint + "GetAccountDetails/" + contactID)
            .map(res => res.json())
            .do(data => this.logService.log(data)) 
            .catch(this.handleError);
    }

    getPermissionsAgainstRole(ScreenName) {
        return this.authhttpservice.get(this.apiEndpoint + "CPGetPermissionsAgainstRole/" + ScreenName)
            .map(res => res.json())
            .do(data => this.logService.log(data)) 
            .catch(this.handleError);
    }



    private handleError(error: Response) {
        var msgErr = JSON.parse(error.text()).ModelState[""][0];
        return Observable.throw(msgErr || 'Server error');
    }
}