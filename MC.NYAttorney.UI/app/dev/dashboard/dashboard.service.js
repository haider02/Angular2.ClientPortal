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
var logging_1 = require('../common/logging');
var customLocalStorage_1 = require('../common/customLocalStorage');
var angular2_jwt_1 = require('angular2-jwt');
var DashBoardService = (function () {
    function DashBoardService(http, _appConfig, _logservice, _authhttp) {
        this.httpService = http;
        this.authhttpservice = _authhttp;
        this.appConfig = _appConfig;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/DashBoard/";
        this.logService = _logservice;
        this.apiTokenURL = _appConfig.apiBaseUrl.replace("/api", "/Token");
    }
    DashBoardService.prototype.handleError = function (error) {
        var lerrorMsg = "";
        if (error.json().Message !== null)
            lerrorMsg = error.json().Message;
        else
            lerrorMsg = error.json();
        return Observable_1.Observable.throw(lerrorMsg || 'Server error');
    };
    DashBoardService.prototype.getClientList = function (clientId) {
        var _this = this;
        return this.authhttpservice.get(this.apiEndpoint + "GetClientList/" + clientId)
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); })
            .catch(this.handleError);
    };
    DashBoardService.prototype.getOrderDetail = function (model) {
        var _this = this;
        var body = JSON.stringify(model);
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + 'OrderSearch', body, {
            headers: headers
        })
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); })
            .catch(this.handleError);
    };
    DashBoardService.prototype.getOrderSummary = function (orderNo) {
        var _this = this;
        return this.authhttpservice.get(this.apiEndpoint + "GetOrderSummary/" + orderNo)
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); })
            .catch(this.handleError);
    };
    DashBoardService.prototype.getLoadStartUrl = function () {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + 'GetLoadStarUrl', null, {
            headers: headers
        })
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); })
            .catch(this.handleError);
    };
    DashBoardService.prototype.getDownloadDocuments = function () {
        var _this = this;
        return this.authhttpservice.get(this.appConfig.apiBaseUrl + "/GenerateDocument/GetDownloadDocuments/")
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); })
            .catch(this.handleError);
    };
    DashBoardService.prototype.getDocumentPath = function (model) {
        var _this = this;
        var body = JSON.stringify(model);
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.appConfig.apiBaseUrl + "/GenerateDocument/GetDocumentPath/", body, {
            headers: headers
        })
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); })
            .catch(this.handleError);
    };
    DashBoardService.prototype.refreshToken = function () {
        var _this = this;
        var refreshToken = customLocalStorage_1.CustomLocalStorage.getItem('refresh_token');
        if (refreshToken !== null) {
            var headers = new http_1.Headers();
            headers.append("Content-Type", "application/x-www-form-urlencoded");
            var body = "grant_type=refresh_token&refresh_token=" + refreshToken;
            return this.authhttpservice.post(this.apiTokenURL, body, { headers: headers })
                .map(function (res) { return res.json(); })
                .do(function (data) { return _this.logService.log(data); })
                .catch(this.handleError);
        }
    };
    DashBoardService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(http_1.Http)),
        __param(1, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(2, core_1.Inject(logging_1.LoggingService)),
        __param(3, core_1.Inject(angular2_jwt_1.AuthHttp))
    ], DashBoardService);
    return DashBoardService;
}());
exports.DashBoardService = DashBoardService;
//# sourceMappingURL=dashboard.service.js.map