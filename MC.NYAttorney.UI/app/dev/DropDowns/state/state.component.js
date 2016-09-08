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
var state_service_1 = require('./state.service');
var city_service_1 = require('../city/city.service');
var core_2 = require('@angular/core');
var county_service_1 = require('../county/county.service');
var app_config_1 = require('../../app-config');
var logging_1 = require('../../common/logging');
var StateComponent = (function () {
    //#endregion 
    /** --Constructor--
 * _http: Service object injection
 * _appConfig: Config object injection
 **/
    function StateComponent(_service, _cityService, _countyService, _appConfig, _logservice) {
        this.StateSelectedOutput = new core_1.EventEmitter();
        this.CityList = new core_1.EventEmitter();
        this.CountyList = new core_1.EventEmitter();
        this.stateService = _service;
        this.cityService = _cityService;
        this.countyService = _countyService;
        this.logService = _logservice;
    }
    StateComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.stateService.getState()
            .subscribe(function (data) { return _this.setData(data); }, function (error) { return _this.logError(error); }, function () { return _this.logService.log("API Call Finished Successfully!"); });
    };
    StateComponent.prototype.ngOnChanges = function () {
        var _this = this;
        this.model.StateAbbr = this.stateInput;
        if (this.stateInput !== null && this.stateInput !== undefined) {
            this.cityService.getCitybyState(this.stateInput)
                .subscribe(function (data) { return _this.getCitybyState(data); }, function (error) { return _this.logError(error); }, function () { return _this.logService.log("API Call Finished Successfully!"); });
        }
        if (this.stateInput !== null && this.stateInput !== undefined) {
            this.countyService.getCountyByState(this.stateInput)
                .subscribe(function (data) { return _this.getCountybyState(data); }, function (error) { return _this.logError(error); }, function () { return _this.logService.log("API Call Finished Successfully!"); });
        }
    };
    StateComponent.prototype.logError = function (err) {
        this.logService.log('There was an error: ' + err);
    };
    StateComponent.prototype.logCityError = function (err) {
        this.logService.log('There was an error: ' + err);
        this.CityList.emit([]);
    };
    StateComponent.prototype.logCountyError = function (err) {
        this.logService.log('There was an error: ' + err);
        this.CountyList.emit([]);
    };
    /** --Method Segment--
    *
    **/
    StateComponent.prototype.setData = function (data) {
        this.states = data;
    };
    StateComponent.prototype.getCitybyState = function (data) {
        this.CityList.emit(data);
    };
    StateComponent.prototype.getCountybyState = function (data) {
        this.CountyList.emit(data);
    };
    StateComponent.prototype.onStateChange = function (sender) {
        var _this = this;
        this.model.StateAbbr = sender.target.value;
        this.StateSelectedOutput.emit(sender.target.value);
        this.cityService.getCitybyState(sender.target.value)
            .subscribe(function (data) { return _this.getCitybyState(data); }, function (error) { return _this.logCityError(error); }, function () { return _this.logService.log("API Call Finished Successfully!"); });
        this.countyService.getCountyByState(sender.target.value)
            .subscribe(function (data) { return _this.getCountybyState(data); }, function (error) { return _this.logCountyError(error); }, function () { return _this.logService.log("API Call Finished Successfully!"); });
    };
    __decorate([
        core_1.Output()
    ], StateComponent.prototype, "StateSelectedOutput", void 0);
    __decorate([
        core_1.Output()
    ], StateComponent.prototype, "CityList", void 0);
    __decorate([
        core_1.Output()
    ], StateComponent.prototype, "CountyList", void 0);
    StateComponent = __decorate([
        core_1.Component({
            selector: 'data-state',
            templateUrl: '../dev/tpl/state.html',
            inputs: ['stateInput: stateInput', 'zip:zip', 'model:model'],
            providers: [
                county_service_1.CountyService, city_service_1.CityService, state_service_1.StateService, logging_1.LoggingService,
                core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG })]
        }),
        __param(0, core_2.Inject(state_service_1.StateService)),
        __param(1, core_2.Inject(city_service_1.CityService)),
        __param(2, core_2.Inject(county_service_1.CountyService)),
        __param(3, core_2.Inject(app_config_1.APP_CONFIG)),
        __param(4, core_2.Inject(logging_1.LoggingService))
    ], StateComponent);
    return StateComponent;
}());
exports.StateComponent = StateComponent;
var StateObject = (function () {
    function StateObject(StateCode, StateAbbr, StateName) {
        if (StateCode === void 0) { StateCode = null; }
        if (StateAbbr === void 0) { StateAbbr = null; }
        if (StateName === void 0) { StateName = null; }
        this.StateCode = StateCode;
        this.StateAbbr = StateAbbr;
        this.StateName = StateName;
    }
    return StateObject;
}());
//# sourceMappingURL=state.component.js.map