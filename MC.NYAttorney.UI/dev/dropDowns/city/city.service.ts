import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import {Injectable, Inject} from '@angular/core';
import {Config, APP_CONFIG, CONFIG} from '../../app-config';
import {LoggingService} from '../../common/logging';
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class CityService {   
    httpService: Http;    
    authhttpservice: AuthHttp;
    selectedState = "";
    appConfig: Config;
    apiEndpoint: string;
    logService: LoggingService;
  
    constructor( @Inject(Http) http, @Inject(APP_CONFIG) _appConfig: Config, @Inject(LoggingService) _logservice, @Inject(AuthHttp) _authhttp) {
        this.httpService = http;
        this.authhttpservice = _authhttp;
        this.appConfig = _appConfig;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/City/";
        this.logService = _logservice;
    }
    
    getAllCity() {       
        return this.authhttpservice.get(this.apiEndpoint+"GetAll")
            .map(res => res.json())
            .do(data => this.logService.log(data)) 
            .catch(this.handleError);
    }
        
    getCitybyState(state) {      
        return this.authhttpservice.get(this.apiEndpoint +"GetByStateAbbr/"+state)
            .map(res => res.json())
            .do(data => this.logService.log(data)) 
            .catch(this.handleError);
    }
    //getCurrentTime() {
    //    return this.authhttpservice.get("http://date.jsontest.com")
    //        .map(res => res.json());
    //}

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
