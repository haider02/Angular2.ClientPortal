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
var http_1 = require('@angular/http');
var http_2 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var core_1 = require('@angular/core');
var app_config_1 = require('../../app-config');
var logging_1 = require('../../common/logging');
var angular2_jwt_1 = require('angular2-jwt');
var CountyService = (function () {
    /** --Constructor--
    * _http: HTTP request object
    * _appConfig: Config object injection
    **/
    function CountyService(http, _appConfig, _logservice, _authhttp) {
        this.selectedState = "";
        this.httpService = http;
        this.authhttpservice = _authhttp;
        this.appConfig = _appConfig;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/County/";
        this.logService = _logservice;
    }
    /** --Method Segment--
    **/
    CountyService.prototype.getAll = function () {
        var _this = this;
        return this.authhttpservice.get(this.apiEndpoint + "GetAll")
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); }) // eyeball results in the console
            .catch(this.handleError);
    };
    CountyService.prototype.getCountyByState = function (state) {
        var _this = this;
        return this.authhttpservice.get(this.apiEndpoint + "GetbyStateAbbr/" + state)
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); }) // eyeball results in the console
            .catch(this.handleError);
    };
    CountyService.prototype.getCountyByStates = function (states) {
        var _this = this;
        var body = JSON.stringify(states);
        var url = this.apiEndpoint + "GetCountiesByState/";
        var headers = new http_2.Headers();
        headers.append('Content-Type', 'application/json');
        this.logService.log(body);
        return this.authhttpservice
            .post(url, body, {
            headers: headers
        })
            .map(function (response) { return response.json(); })
            .do(function (data) { return _this.logService.log(data); })
            .catch(this.handleError);
    };
    CountyService.prototype.getCurrentTime = function () {
        return this.authhttpservice.get("http://date.jsontest.com")
            .map(function (res) { return res.json(); });
    };
    CountyService.prototype.handleError = function (error) {
        console.error(error);
        return Observable_1.Observable.throw(error.json().error || 'Server error');
    };
    CountyService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(http_1.Http)),
        __param(1, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(2, core_1.Inject(logging_1.LoggingService)),
        __param(3, core_1.Inject(angular2_jwt_1.AuthHttp))
    ], CountyService);
    return CountyService;
}());
exports.CountyService = CountyService;
//# sourceMappingURL=county.service.js.map