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
var angular2_jwt_1 = require('angular2-jwt');
var logging_1 = require('../common/logging');
var OrderEntryService = (function () {
    function OrderEntryService(http, _appConfig, _logservice, _authhttp) {
        this.httpService = http;
        this.authhttpservice = _authhttp;
        this.appConfig = _appConfig;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/OrderEntry/";
        this.logService = _logservice;
    }
    OrderEntryService.prototype.getStateCountyByZip = function (zipCode) {
        var _this = this;
        return this.authhttpservice.get(this.appConfig.apiBaseUrl + "/County/GetStateCountyFromZip/" + zipCode)
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); }) // eyeball results in the console
            .catch(this.handleError);
    };
    OrderEntryService.prototype.getTransactionType = function (clientId) {
        var _this = this;
        return this.authhttpservice.get(this.apiEndpoint + "GetClientTransactionTypes/" + clientId)
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); }) // eyeball results in the console
            .catch(this.handleError);
    };
    OrderEntryService.prototype.getClientContactNames = function (clientId, suffix, isShowMultiLevels) {
        var _this = this;
        return this.authhttpservice.get(this.apiEndpoint + 'GetClientContactNames/' + clientId + '/' + suffix + '/' + isShowMultiLevels)
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); })
            .catch(this.handleError);
    };
    OrderEntryService.prototype.getMaritalStatus = function () {
        var _this = this;
        return this.authhttpservice.get(this.apiEndpoint + "GetMaritalStatus")
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); }) // eyeball results in the console
            .catch(this.handleError);
    };
    OrderEntryService.prototype.saveOrderEntry = function (model) {
        var _this = this;
        var body = JSON.stringify(model);
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + 'SaveOrderEntry/', body, {
            headers: headers
        })
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); }) // eyeball results in the console
            .catch(this.handleError);
    };
    OrderEntryService.prototype.getClientList = function (clientId) {
        var _this = this;
        return this.authhttpservice.get(this.appConfig.apiBaseUrl + "/DashBoard/GetClientList/" + clientId)
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); }) // eyeball results in the console
            .catch(this.handleError);
    };
    OrderEntryService.prototype.handleError = function (error) {
        return Observable_1.Observable.throw(error.json().error || 'Server error');
    };
    OrderEntryService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(http_1.Http)),
        __param(1, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(2, core_1.Inject(logging_1.LoggingService)),
        __param(3, core_1.Inject(angular2_jwt_1.AuthHttp))
    ], OrderEntryService);
    return OrderEntryService;
}());
exports.OrderEntryService = OrderEntryService;
//# sourceMappingURL=order-entry.service.js.map