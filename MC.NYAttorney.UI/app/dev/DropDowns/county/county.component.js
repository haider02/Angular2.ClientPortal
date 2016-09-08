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
var county_service_1 = require('./county.service');
var core_2 = require('@angular/core');
var app_config_1 = require('../../app-config');
var logging_1 = require('../../common/logging');
var CountyComponent = (function () {
    /** --Constructor--
    * _http: Service object injection
    * _appConfig: Config object injection
    **/
    function CountyComponent(_service, _appConfig, _logservice) {
        this.CountySelectedOutput = new core_1.EventEmitter();
        this.countyService = _service;
        this.counties = new Array();
        this.model = new CountyObject();
        this.logService = _logservice;
    }
    CountyComponent.prototype.ngOnChanges = function () {
        this.logService.log(this.countiesList);
        this.counties = this.countiesList;
        if (this.countyInput !== null)
            this.model.CountyName = this.countyInput;
    };
    /** --Method Segment--
    * getColumns(): To initialized grid's columns array to be used by the view.
    **/
    CountyComponent.prototype.onCountyChange = function (sender) {
        this.countyInput = sender.target.value;
        this.CountySelectedOutput.emit(sender.target.value);
    };
    CountyComponent.prototype.setData = function (data) {
        this.counties = data;
    };
    __decorate([
        core_1.Output()
    ], CountyComponent.prototype, "CountySelectedOutput", void 0);
    CountyComponent = __decorate([
        core_1.Component({
            selector: 'data-county',
            templateUrl: '../dev/tpl/county.html',
            inputs: ['countyInput:countyInput', 'countiesList: countiesList'],
            providers: [
                county_service_1.CountyService, logging_1.LoggingService,
                core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG })]
        }),
        __param(0, core_2.Inject(county_service_1.CountyService)),
        __param(1, core_2.Inject(app_config_1.APP_CONFIG)),
        __param(2, core_2.Inject(logging_1.LoggingService))
    ], CountyComponent);
    return CountyComponent;
}());
exports.CountyComponent = CountyComponent;
var CountyObject = (function () {
    function CountyObject(StateAbbr, CountyCode, CountyName) {
        if (StateAbbr === void 0) { StateAbbr = null; }
        if (CountyCode === void 0) { CountyCode = null; }
        if (CountyName === void 0) { CountyName = null; }
        this.StateAbbr = StateAbbr;
        this.CountyCode = CountyCode;
        this.CountyName = CountyName;
    }
    return CountyObject;
}());
//# sourceMappingURL=county.component.js.map