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
var ReferenceDataService = (function () {
    //end region
    /** --Constructor--
   * _http: HTTP request object
   * _appConfig: Config object injection
   **/
    function ReferenceDataService(http, _appConfig, _logservice, _authhttp) {
        this.httpService = http;
        this.authhttpservice = _authhttp;
        this.appConfig = _appConfig;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/ReferenceData/";
        this.logService = _logservice;
    }
    //endregion
    ReferenceDataService.prototype.getReferenceDatabyRowId = function (rowId) {
        var _this = this;
        return this.authhttpservice.get(this.apiEndpoint + 'GetComboEntitybyRowId/' + rowId)
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); })
            .catch(this.handleError);
    };
    ReferenceDataService.prototype.getDocumentFolders = function () {
        var _this = this;
        return this.authhttpservice.get(this.apiEndpoint + 'GetComboEntitybyCode/DocumentFolders')
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); })
            .catch(this.handleError);
    };
    ReferenceDataService.prototype.getDocumentTypesSelectAllByProdCat = function (doctTypeCat) {
        var _this = this;
        return this.authhttpservice.get(this.apiEndpoint + 'DocumentTypesSelectAllByProdCat/' + doctTypeCat)
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); })
            .catch(this.handleError);
    };
    /**
   * getAddressTypeList: Get default Address Type
   **/
    ReferenceDataService.prototype.getddlType = function (ddlType) {
        var _this = this;
        return this.authhttpservice.get(this.apiEndpoint + 'GetComboEntitybyCode/' + ddlType)
            .map(function (res) { return res.json(); })
            .do(function (data) { return _this.logService.log(data); })
            .catch(this.handleError);
    };
    ReferenceDataService.prototype.logError = function (err) {
        console.error('There was an error: ' + err);
    };
    ReferenceDataService.prototype.handleError = function (error) {
        return Observable_1.Observable.throw(error.json().error || 'Server error');
    };
    ReferenceDataService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(http_1.Http)),
        __param(1, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(2, core_1.Inject(logging_1.LoggingService)),
        __param(3, core_1.Inject(angular2_jwt_1.AuthHttp))
    ], ReferenceDataService);
    return ReferenceDataService;
}());
exports.ReferenceDataService = ReferenceDataService;
//# sourceMappingURL=reference-data.service.js.map