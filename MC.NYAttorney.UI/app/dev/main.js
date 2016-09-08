"use strict";
/// <reference path="../node_modules/typescript/lib/lib.es6.d.ts" />
var core_1 = require('@angular/core');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var http_1 = require('@angular/http');
var router_deprecated_1 = require('@angular/router-deprecated');
var common_1 = require('@angular/common');
var common_2 = require('@angular/common');
require('rxjs/Rx');
var app_component_1 = require('./app.component');
var HttpInterceptor_1 = require('./common/HttpInterceptor');
var core_2 = require('ng2-idle/core');
var core_3 = require('ng2-idle-keepalive/core');
var forms_1 = require('@angular/forms');
var angular2_jwt_1 = require('angular2-jwt/angular2-jwt');
var customLocalStorage_1 = require('./common/customLocalStorage');
platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [
    router_deprecated_1.ROUTER_PROVIDERS, http_1.HTTP_PROVIDERS, core_3.KEEPALIVE_PROVIDERS, core_2.IDLE_PROVIDERS,
    core_1.provide(common_1.LocationStrategy, { useClass: common_2.HashLocationStrategy }),
    core_1.provide(http_1.Http, {
        useFactory: function (xhrBackend, requestOptions, router) {
            return new HttpInterceptor_1.HttpInterceptor(xhrBackend, requestOptions, router);
        },
        deps: [http_1.XHRBackend, http_1.RequestOptions, router_deprecated_1.Router]
    }),
    core_1.provide(angular2_jwt_1.AuthHttp, {
        useFactory: function (http) {
            return new angular2_jwt_1.AuthHttp(new angular2_jwt_1.AuthConfig({
                headerName: 'Authorization',
                headerPrefix: 'Bearer',
                tokenName: 'id_token',
                tokenGetter: (function () { return customLocalStorage_1.CustomLocalStorage.getItem("id_token"); }),
                noJwtError: true
            }), http);
        },
        deps: [http_1.Http]
    }),
    forms_1.disableDeprecatedForms(),
    forms_1.provideForms()
]);
//# sourceMappingURL=main.js.map