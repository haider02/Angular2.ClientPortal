import {Injectable, Inject} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {MenuModel} from './menu.model';
import {LoggingService} from '../common/logging';
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class MenuService {
    httpService: Http;
    appConfig: Config;
    apiEndpoint: string;
    logService: LoggingService;
    authhttpservice: AuthHttp;

    constructor( @Inject(Http) _http, @Inject(APP_CONFIG) _appConfig: Config, @Inject(LoggingService) _logservice, @Inject(AuthHttp) _authhttp) {
        this.httpService = _http;
        this.authhttpservice = _authhttp;
        this.apiEndpoint = _appConfig.apiBaseUrl;
        this.logService = _logservice;             
    }

    getAllMenus() {
        let apiEndPoint = this.apiEndpoint + "/Menu/GetAllMenus";

        return this.authhttpservice.get(apiEndPoint)
            .map(res => <MenuModel[]>res.json())
            .do(data => this.logService.log(data)) 
            .catch(this.handleError);
    }   

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
