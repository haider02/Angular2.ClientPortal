var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('angular2/core');
var http_1 = require('angular2/http');
var Observable_1 = require('rxjs/Observable');
var app_config_1 = require('../app-config');
var NotesService = (function () {
    //end region
    /** --Constructor--
  * _http: HTTP request object
  * _appConfig: Config object injection
  **/
    function NotesService(http, _appConfig) {
        this.httpService = http;
        this.appConfig = _appConfig;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/Notes/";
    }
    //end region
    /** --Method Segment--
  **/
    /** * getNotesByVendor:Get Vendor Notes**/
    NotesService.prototype.getNotesByVendor = function (vendorId) {
        return this.httpService.get(this.apiEndpoint + 'GetNotesByXrefId/' + vendorId)
            .map(function (res) { return res.json(); })
            .do(function (data) { return console.log(data); }); // eyeball results in the console            
    };
    /** * getInternalVendor:Get Vendor Notes**/
    NotesService.prototype.getInternalVendor = function (orderNo, itemId) {
        return this.httpService.get(this.apiEndpoint + 'GetInternalContacts/' + orderNo + '/' + itemId)
            .map(function (res) { return res.json(); })
            .do(function (data) { return console.log(data); }); // eyeball results in the console            
    };
    /** * createNotesByVendor: Insert Note Record**/
    NotesService.prototype.createNotesByVendor = function (model) {
        var body = JSON.stringify(model);
        console.log(body);
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.httpService
            .post(this.apiEndpoint, body, {
            headers: headers
        })
            .map(function (response) { return response.json(); });
    };
    NotesService.prototype.getVendorAssociateContactList = function (vendorId) {
        return this.httpService.get(this.appConfig.apiBaseUrl + '/VendorAssociate/GetAllVendorAssociateByVendorId' + '/' + vendorId)
            .map(function (res) { return res.json(); })
            .do(function (data) { return console.log(data); })
            .catch(this.handleError);
    };
    /** * logError: log eror**/
    NotesService.prototype.handleError = function (error) {
        return Observable_1.Observable.throw(error.json().error || 'Server error');
    };
    NotesService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(http_1.Http)),
        __param(1, core_1.Inject(app_config_1.APP_CONFIG))
    ], NotesService);
    return NotesService;
})();
exports.NotesService = NotesService;
//# sourceMappingURL=notes.service.js.map