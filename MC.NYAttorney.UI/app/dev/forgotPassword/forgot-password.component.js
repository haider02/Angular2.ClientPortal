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
var notifications_component_1 = require('../notifications/notifications.component');
var app_config_1 = require('../app-config');
var forgot_password_service_1 = require('./forgot-password.service');
var forgot_password_model_1 = require('./forgot-password.model');
var logging_1 = require('../common/logging');
var ForgotPasswordComponent = (function () {
    function ForgotPasswordComponent(_appConfig, _router, _service, _logservice) {
        this.model = new forgot_password_model_1.ForgotPasswordDetail();
        this.emailAddress = null;
        this.appConfig = _appConfig;
        this.router = _router;
        this.httpService = _service;
        this.isValidUser = true;
        this.logService = _logservice;
    }
    ForgotPasswordComponent.prototype.onSendPassword = function () {
        this.validateUserEmail(this.model);
    };
    ForgotPasswordComponent.prototype.validateUserEmail = function (details) {
        var _this = this;
        this.httpService.validateUserEmail(details)
            .subscribe(function (data) { return _this.loadValidationData(data); }, function (error) { return _this.child.showErrorNotification(error, "Error"); }, function () { return _this.logService.log("email address validated!"); });
    };
    ForgotPasswordComponent.prototype.loadValidationData = function (data) {
        if (data.isSuccess == true) {
            this.model = data;
            this.fillEmailMessage();
            this.model.EmailObject.To = this.model.Email;
            this.forgotPassword(this.model);
        }
    };
    ForgotPasswordComponent.prototype.forgotPassword = function (data) {
        var _this = this;
        this.httpService.forgotPassword(data)
            .subscribe(function (data) { return _this.onEmailSent(data); }, function (error) { return _this.child.showErrorNotification(error, "Error"); }, function () { return _this.logService.log("email send successfully!"); });
    };
    ForgotPasswordComponent.prototype.fillEmailMessage = function () {
        var body = this.appConfig.ForgotPasswordEmailBody.toString();
        body = body.replace(/PasswordResetTokenValidHours/g, this.appConfig.PasswordResetTokenValidHours.toString());
        this.model.EmailObject.From = this.appConfig.DefaultFromEmailAddress;
        this.model.EmailObject.To = this.model.Email;
        this.model.EmailObject.Subject = "Password Reset";
        this.model.EmailObject.Body = body;
    };
    ForgotPasswordComponent.prototype.onEmailSent = function (data) {
        if (data.isSuccess == true)
            this.child.showSuccessNotification("You will receive an email shortly to change the password", "Success!");
    };
    ForgotPasswordComponent.prototype.routetoLogin = function () {
        this.router.navigate(['Login']);
    };
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], ForgotPasswordComponent.prototype, "child", void 0);
    ForgotPasswordComponent = __decorate([
        core_1.Component({
            selector: 'forgot-password',
            templateUrl: '../dev/tpl/forgot-password.html',
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, notifications_component_1.NotificationsComponent],
            providers: [core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }), forgot_password_service_1.ForgotPasswordService, logging_1.LoggingService]
        }),
        __param(0, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(1, core_1.Inject(router_deprecated_1.Router)),
        __param(2, core_1.Inject(forgot_password_service_1.ForgotPasswordService)),
        __param(3, core_1.Inject(logging_1.LoggingService))
    ], ForgotPasswordComponent);
    return ForgotPasswordComponent;
}());
exports.ForgotPasswordComponent = ForgotPasswordComponent;
//# sourceMappingURL=forgot-password.component.js.map