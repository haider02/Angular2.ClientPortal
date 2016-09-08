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
var Observable_1 = require('rxjs/Observable');
var core_1 = require('@angular/core');
var angular2_jwt_1 = require('angular2-jwt');
var logging_1 = require('../common/logging');
var app_config_1 = require('../app-config');
var DocumentService = (function () {
    /** --Constructor--
    *   _service: Service object injection
    *   _appConfig: Config object injection
    **/
    function DocumentService(_service, _appConfig, _logservice, _authhttp) {
        this.httpService = _service;
        this.authhttpservice = _authhttp;
        this.appConfig = _appConfig;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/Document";
        this.logService = _logservice;
    }
    /** --getDocuments--
    *   Gets document by vendor id
    **/
    DocumentService.prototype.getDocuments = function (id) {
        return this.authhttpservice.get(this.apiEndpoint + '/GetDocumentsById/' + id)
            .map(function (res) { return res.json(); })
            .do(function (data) { return data; })
            .catch(this.handleError);
    };
    /** --getDocuments--
    *   Gets document relative path
    **/
    DocumentService.prototype.GetDocPath = function (id) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice.get(this.apiEndpoint + '/GetDocPath/' + id)
            .map(function (res) { return res.json(); })
            .do(function (data) { return data; })
            .catch(this.handleError);
    };
    /** --getOrderDetails--
    *   Gets order Details relative path
    **/
    DocumentService.prototype.GetOrderDetail = function (orderNo) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice.get(this.apiEndpoint + '/GetOrderDetailByOrderNo/' + orderNo)
            .map(function (res) { return res.json(); })
            .do(function (data) { return data; })
            .catch(this.handleError);
    };
    /** --addDocument--
    *   add document post call
    **/
    DocumentService.prototype.addDocument = function (docment, handler) {
        //this.u1(docment,handler);
        //var body = JSON.stringify(docment);
        //this.logService.log(body);
        //var headers = new Headers(); 
        //headers.append('Content-Type', 'application/json');
        //var fd = new FormData();
        //fd.append('file', docment.file); 
        //return this.authhttpservice
        //    .post(this.apiEndpoint + '/AddDocument',
        //    body, {
        //        headers: headers 
        //    })
        //    .map(response => response.json())
        //    .do(data => data)
        //    .catch(this.handleError);
    };
    /** --updateDocument--
    *   update document post call
    **/
    DocumentService.prototype.updateDocument = function (modelEntity) {
        var body = JSON.stringify(modelEntity);
        this.logService.log(body);
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + '/UpdateDocument', body, {
            headers: headers
        })
            .map(function (response) { return response.json(); })
            .do(function (data) { return data; })
            .catch(this.handleError);
    };
    /** --deleteDocument--
    *   delete document post call
    **/
    DocumentService.prototype.deleteDocument = function (docment) {
        var _this = this;
        docment.DocumentFolder = 'ddddd';
        var body = JSON.stringify(docment);
        this.logService.log(body);
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + '/DeleteDocument', body, {
            headers: headers
        })
            .map(function (response) { return response.json(); })
            .subscribe(function (response) { return _this.logService.log(response); }, this.handleError, function () { return _this.logService.log('update Call Sent'); });
    };
    DocumentService.prototype.mergeDocument = function (docments) {
        var body = JSON.stringify(docments);
        this.logService.log(body);
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + '/MergeDocument', body, {
            headers: headers
        })
            .map(function (response) { return response.json(); })
            .do(function (data) { return data; })
            .catch(this.handleError);
    };
    DocumentService.prototype.mergeTitleDocument = function (rowIds) {
        var body = JSON.stringify(rowIds);
        this.logService.log(body);
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + '/MergeTitleDocument', body, {
            headers: headers
        })
            .map(function (response) { return response.json(); })
            .do(function (data) { return data; })
            .catch(this.handleError);
    };
    /** --deleteDocuments--
    *   delete documents post call
    **/
    DocumentService.prototype.deleteDocuments = function (docments) {
        var body = JSON.stringify(docments);
        this.logService.log(body);
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.authhttpservice
            .post(this.apiEndpoint + '/DeleteDocuments', body, {
            headers: headers
        })
            .map(function (response) { return response.json(); })
            .do(function (data) { return data; })
            .catch(this.handleError);
    };
    /** --lockDocuments--
    *   lock documents post call
    **/
    DocumentService.prototype.lockDocuments = function (docments, lockStatus) {
        var body = JSON.stringify(docments);
        this.logService.log(body);
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        var url = this.apiEndpoint;
        if (lockStatus)
            url += '/LockDocuments';
        else
            url += '/UnLockDocuments';
        return this.authhttpservice
            .post(url, body, {
            headers: headers
        })
            .map(function (response) { return response.json(); })
            .do(function (data) { return data; })
            .catch(this.handleError);
    };
    /** --EmailDocument--
    *   email document
    **/
    DocumentService.prototype.EmailDocument = function (obj) {
        var body = JSON.stringify(obj);
        this.logService.log(body);
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        var url = this.apiEndpoint + '/EmailDocument';
        return this.authhttpservice
            .post(url, body, {
            headers: headers
        })
            .map(function (response) { return response.json(); })
            .do(function (data) { return data; })
            .catch(this.handleError);
    };
    DocumentService.prototype.SaveUploadDocument = function (obj) {
        var body = JSON.stringify(obj);
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        var url = this.apiEndpoint + '/SaveUploadDocument';
        return this.authhttpservice
            .post(url, body, {
            headers: headers
        })
            .map(function (response) { return response.json(); })
            .do(function (data) { return data; })
            .catch(this.handleError);
    };
    /** --handleError--
    *   Error handler for all post calls
    **/
    DocumentService.prototype.handleError = function (error) {
        console.error(error);
        return Observable_1.Observable.throw(error.json().error || 'Server error');
    };
    DocumentService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(http_1.Http)),
        __param(1, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(2, core_1.Inject(logging_1.LoggingService)),
        __param(3, core_1.Inject(angular2_jwt_1.AuthHttp))
    ], DocumentService);
    return DocumentService;
}());
exports.DocumentService = DocumentService;
//# sourceMappingURL=order-document.service.js.map