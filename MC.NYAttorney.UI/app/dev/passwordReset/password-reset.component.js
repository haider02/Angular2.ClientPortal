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
var router_deprecated_1 = require('@angular/router-deprecated');
var app_config_1 = require('../app-config');
var forms_1 = require('@angular/forms');
var notifications_component_1 = require('../notifications/notifications.component');
var reference_data_service_1 = require('../referenceData/reference-data.service');
var grid_component_1 = require('../grid/grid.component');
var password_reset_service_1 = require('./password-reset.service');
var logging_1 = require('../common/logging');
core_1.enableProdMode();
var PasswordResetComponent = (function () {
    function PasswordResetComponent(_appConfig, _referenceData, _router, _routeParams, _service, _logservice) {
        this.model = new PasswordResetClass();
        this.isPasswordMatch = true;
        this.key = "";
        this.status = "Please Wait...";
        this.appConfig = _appConfig;
        this.referenceDataService = _referenceData;
        this.router = _router;
        this.routeParams = _routeParams;
        this.logService = _logservice;
        this.httpService = _service;
    }
    PasswordResetComponent.prototype.ngOnInit = function () {
    };
    PasswordResetComponent.prototype.ngAfterViewInit = function () {
        this.key = this.routeParams.get("key");
        this.getPasswordResetStatus();
    };
    PasswordResetComponent.prototype.getPasswordResetStatus = function () {
        var _this = this;
        var validHours = this.appConfig.PasswordResetTokenValidHours;
        this.httpService.getPasswordResetStatus(this.key, validHours)
            .subscribe(function (data) { return _this.saveHandler(data); }, function (error) {
            _this.child.showSaveErrorNotification();
            _this.child.hideLoader();
        }, function () { return _this.logService.log("Password Reset Successfully!"); });
        this.successMessageDisplay = true;
    };
    PasswordResetComponent.prototype.saveHandler = function (data) {
        this.model = data;
        if (this.model.isSuccess == false) {
            this.status = this.model.Message;
            return;
        }
        this.status = "";
        this.router.navigate(['ChangePassword', { contactId: this.model.ContactId, email: this.model.Email, originator: this.model.Originator }]);
    };
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], PasswordResetComponent.prototype, "child", void 0);
    PasswordResetComponent = __decorate([
        core_1.Component({
            selector: 'password-reset',
            templateUrl: '../../dev/tpl/password-reset.html',
            directives: [forms_1.NgForm, notifications_component_1.NotificationsComponent, grid_component_1.GridComponent],
            providers: [reference_data_service_1.ReferenceDataService, core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }),
                password_reset_service_1.PasswordResetService, logging_1.LoggingService
            ]
        }),
        __param(0, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(1, core_1.Inject(reference_data_service_1.ReferenceDataService)),
        __param(2, core_1.Inject(router_deprecated_1.Router)),
        __param(3, core_1.Inject(router_deprecated_1.RouteParams)),
        __param(4, core_1.Inject(password_reset_service_1.PasswordResetService)),
        __param(5, core_1.Inject(logging_1.LoggingService))
    ], PasswordResetComponent);
    return PasswordResetComponent;
}());
exports.PasswordResetComponent = PasswordResetComponent;
var PasswordResetClass = (function () {
    function PasswordResetClass(isSuccess, Message, ContactId, Email, Originator) {
        if (isSuccess === void 0) { isSuccess = false; }
        if (Message === void 0) { Message = ""; }
        if (ContactId === void 0) { ContactId = ""; }
        if (Email === void 0) { Email = ""; }
        if (Originator === void 0) { Originator = ""; }
        this.isSuccess = isSuccess;
        this.Message = Message;
        this.ContactId = ContactId;
        this.Email = Email;
        this.Originator = Originator;
    }
    return PasswordResetClass;
}());
//# sourceMappingURL=password-reset.component.js.map