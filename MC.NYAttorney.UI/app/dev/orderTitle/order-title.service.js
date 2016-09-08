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
var angular2_jwt_1 = require('angular2-jwt');
var OrderTitleService = (function () {
    function OrderTitleService(http, _appConfig, _logservice, _authhttp) {
        this.httpService = http;
        this.authhttpservice = _authhttp;
        this.logService = _logservice;
        this.appConfig = _appConfig;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/OrderTitle/";
    }
    OrderTitleService.prototype.GetOrderTitleDetail = function (OrderNo) {
        var _this = this;
        return this.authhttpservice.get(this.apiEndpoint + "GetOrderTitleDetail/" + OrderNo)
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); }) // eyeball results in the console
            .catch(this.handleError);
    };
    OrderTitleService.prototype.AddTitleBillReqEvent = function (OrderNo) {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + 'CPAddTitleRequestEvent/' + OrderNo, '', {
            headers: headers
        })
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); }) // eyeball results in the console
            .catch(this.handleError);
    };
    OrderTitleService.prototype.CPAddTitleProduct = function (OrderNo) {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + 'CPAddTitleProduct/' + OrderNo, '', {
            headers: headers
        })
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); }) // eyeball results in the console
            .catch(this.handleError);
    };
    OrderTitleService.prototype.GetDocuments = function (OrderNo) {
        return this.authhttpservice.get(this.apiEndpoint + 'CPGetTitleDocumentsSelectAll/' + OrderNo)
            .map(function (res) { return res.json(); })
            .do(function (data) { return data; })
            .catch(this.handleError);
    };
    OrderTitleService.prototype.handleError = function (error) {
        return Observable_1.Observable.throw(error.json().error || 'Server error');
    };
    OrderTitleService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(http_1.Http)),
        __param(1, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(2, core_1.Inject(logging_1.LoggingService)),
        __param(3, core_1.Inject(angular2_jwt_1.AuthHttp))
    ], OrderTitleService);
    return OrderTitleService;
}());
exports.OrderTitleService = OrderTitleService;
//# sourceMappingURL=order-title.service.js.map