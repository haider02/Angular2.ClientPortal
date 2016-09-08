"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var app_config_1 = require('../app-config');
var customLocalStorage_1 = require('../common/customLocalStorage');
var logging_1 = require('../common/logging');
var angular2_jwt_1 = require('angular2-jwt');
var LoginService = (function () {
    function LoginService(http, _appConfig, _logservice, _authhttp) {
        this.httpService = http;
        this.authhttpservice = _authhttp;
        this.appConfig = _appConfig;
        this.logService = _logservice;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/Account/";
        this.apiTokenURL = _appConfig.apiBaseUrl.replace("/api", "/Token");
        customLocalStorage_1.CustomLocalStorage.setItem("apiTokenURL", this.apiTokenURL);
    }
    LoginService.prototype.ValidateUser = function (model) {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        var body = "grant_type=password&username=" + model.username + "&Password=" + model.password;
        return this.authhttpservice
            .post(this.apiTokenURL, body, {
            headers: headers
        })
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); })
            .catch(this.handleError);
    };
    LoginService.prototype.logout = function () {
        var body = null;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + "Logout", body, {
            headers: headers
        })
            .do(function (data) { return data; })
            .catch(this.handleError);
    };
    LoginService.prototype.handleError = function (error) {
        return Observable_1.Observable.throw(error.json().error_description || 'Server error');
    };
    LoginService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(http_1.Http)),
        __param(1, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(2, core_1.Inject(logging_1.LoggingService)),
        __param(3, core_1.Inject(angular2_jwt_1.AuthHttp))
    ], LoginService);
    return LoginService;
}());
exports.LoginService = LoginService;
//# sourceMappingURL=login.service.js.map