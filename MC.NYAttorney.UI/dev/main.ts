 /// <reference path="../node_modules/typescript/lib/lib.es6.d.ts" />
import {provide} from '@angular/core';
import {bootstrap}        from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS, Http, XHRBackend, RequestOptions} from '@angular/http';
import {ROUTER_PROVIDERS, Router } from '@angular/router-deprecated';
import { LocationStrategy} from '@angular/common';
import { HashLocationStrategy} from '@angular/common';
import 'rxjs/Rx';
import {AppComponent}  from './app.component';
import {HttpInterceptor} from './common/HttpInterceptor';
import {IDLE_PROVIDERS} from 'ng2-idle/core'; 
import {KEEPALIVE_PROVIDERS} from 'ng2-idle-keepalive/core'; 
import { disableDeprecatedForms, provideForms } from '@angular/forms'
import {ClientStorageConstants} from './common/constants';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {ClientStorage} from './common/ClientStorage';


bootstrap(AppComponent, [
    ROUTER_PROVIDERS, HTTP_PROVIDERS, KEEPALIVE_PROVIDERS, IDLE_PROVIDERS,
    provide(LocationStrategy, { useClass: HashLocationStrategy }),
    provide(Http, {
        useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions,
            router: Router) => new HttpInterceptor(xhrBackend, requestOptions, router),
        deps: [XHRBackend, RequestOptions, Router]
    }),
    provide(AuthHttp, {
        useFactory: (http) => {
            return new AuthHttp(new AuthConfig({
                headerName: 'Authorization',
                headerPrefix: 'Bearer',
                tokenName: 'id_token',
                tokenGetter: (() => ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_id_token)),
                noJwtError: true
            }), http);
        },
        deps: [Http]
    }),
    disableDeprecatedForms(),
    provideForms()
    ]);
