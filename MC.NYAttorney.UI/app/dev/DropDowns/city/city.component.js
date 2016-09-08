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
var city_service_1 = require('./city.service');
var core_2 = require('@angular/core');
var app_config_1 = require('../../app-config');
var CityComponent = (function () {
    /** --Constructor--
* _http: Service object injection
* _appConfig: Config object injection
**/
    function CityComponent(_service, _appConfig) {
        this.CitySelectedOutput = new core_1.EventEmitter();
        this.cityService = _service;
        this.cities = new Array();
        this.model = new CityObject();
        this.appConfig = _appConfig;
    }
    CityComponent.prototype.ngOnChanges = function () {
        if (this.cityList)
            this.cities = this.cityList;
        if (this.cityInput) {
            var city = this.cityInput.toLowerCase();
            this.model.City = this.cityInput;
        }
    };
    /** --Method Segment--
   * getColumns(): To initialized grid's columns array to be used by the view.
   **/
    CityComponent.prototype.onCityChange = function (sender) {
        this.cityInput = sender.target.value;
        this.CitySelectedOutput.emit(sender.target.value);
    };
    CityComponent.prototype.setData = function (data) {
        this.cities = data;
    };
    __decorate([
        core_1.Output()
    ], CityComponent.prototype, "CitySelectedOutput", void 0);
    CityComponent = __decorate([
        core_1.Component({
            selector: 'data-city',
            templateUrl: '../dev/tpl/city.html',
            inputs: ['stateInput: stateInput', 'cityList:cityList', "cityInput:cityInput"],
            providers: [core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }), city_service_1.CityService]
        }),
        __param(0, core_2.Inject(city_service_1.CityService)),
        __param(1, core_2.Inject(app_config_1.APP_CONFIG))
    ], CityComponent);
    return CityComponent;
}());
exports.CityComponent = CityComponent;
var CityObject = (function () {
    function CityObject(ZipCode, City, CityType, StateAbbr) {
        if (ZipCode === void 0) { ZipCode = null; }
        if (City === void 0) { City = null; }
        if (CityType === void 0) { CityType = null; }
        if (StateAbbr === void 0) { StateAbbr = null; }
        this.ZipCode = ZipCode;
        this.City = City;
        this.CityType = CityType;
        this.StateAbbr = StateAbbr;
    }
    return CityObject;
}());
//# sourceMappingURL=city.component.js.map