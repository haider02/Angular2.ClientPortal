import {bootstrap} from '@angular/platform-browser-dynamic';
import {provide} from '@angular/core';
import {HTTP_PROVIDERS, Http, Request, RequestOptionsArgs, Response, XHRBackend, RequestOptions, ConnectionBackend, Headers} from '@angular/http';
import {ROUTER_PROVIDERS, Router} from '@angular/router-deprecated';
import { Observable } from 'rxjs/Observable';
import {ClientStorage} from '../common/ClientStorage';

declare var jQuery;

export class HttpInterceptor extends Http {

    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions,
        private _router: Router) {
        super(backend, defaultOptions);        
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.request(url, this.getRequestOptionArgs(options)));

    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.get(url, this.getRequestOptionArgs(options)));
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.delete(url, this.getRequestOptionArgs(options)));
    }

    getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) 
            options = new RequestOptions();
        
        if (options.headers == null) 
            options.headers = new Headers();
        
        return options;
    }

    intercept(observable: Observable<Response>): Observable<Response> {
        return observable.catch((err, source) => {            
            if (err.status == 401 && err.url.search('/login') == -1 && err._body.toString().search('-APIAuthorization') == -1) {
                this._router.navigate(['Login']);
                return Observable.empty();
            }            
            else {
                return Observable.throw(err);
            }
        });
    }
}