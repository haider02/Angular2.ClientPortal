import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {ClientStorage} from '../common/ClientStorage';
import {LoggingService} from '../common/logging';
import {AuthHttp} from 'angular2-jwt';
import {ClientStorageConstants} from '../common/constants';

@Injectable()
export class LoginService {
    httpService: Http;  
    authhttpservice: AuthHttp;  
    result: string;
    appConfig: Config;
    apiEndpoint: string;
    apiTokenURL: string;
    logService: LoggingService;

    constructor( @Inject(Http) http, @Inject(APP_CONFIG) _appConfig: Config, @Inject(LoggingService) _logservice, @Inject(AuthHttp) _authhttp) {
        this.httpService = http;       
        this.authhttpservice = _authhttp;     
        this.appConfig = _appConfig;
        this.logService = _logservice;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/Account/";
        this.apiTokenURL = _appConfig.apiBaseUrl.replace("/api", "/Token");
        
    }

    ValidateUser(model) {
        var headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");               
        var body = "grant_type=password&username=" + model.username + "&Password=" + model.password;
        return this.authhttpservice
            .post(this.apiTokenURL,
            body, {
                headers: headers
            })
            .map(res => res.json())
            .do(data => this.logService.log(data))
            .catch(this.handleError);    
    }

    logout() {
        var body = null;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.authhttpservice
            .post(this.apiEndpoint + "Logout", body, {
                headers: headers
            })            
            .do(data => data) 
            .catch(this.handleError);
    }
    
    private handleError(error: Response) {        
        return Observable.throw(error.json().error_description || 'Server error');
    }
}