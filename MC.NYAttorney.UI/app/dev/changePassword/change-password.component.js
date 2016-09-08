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
var change_password_model_1 = require('./change-password.model');
var app_config_1 = require('../app-config');
var utility_1 = require('../common/utility');
var change_password_service_1 = require('./change-password.service');
var router_deprecated_1 = require('@angular/router-deprecated');
var reCaptchaComponent_1 = require('../common/reCaptchaComponent');
var notifications_component_1 = require('../notifications/notifications.component');
var logging_1 = require('../common/logging');
var ChangePasswordComponent = (function () {
    function ChangePasswordComponent(_appConfig, _accountService, _router, _routeParams, _logservice) {
        this.model = new change_password_model_1.ChangePasswordModel();
        this.showOldPassword = false;
        this.utility = new utility_1.Utility();
        this.httpService = _accountService;
        this.router = _router;
        this.routeParams = _routeParams;
        this.logService = _logservice;
        this.appConfig = _appConfig;
        if (this.routeParams.get("originator") !== null) {
            this.SetUserData(this.routeParams.get("email"), false, +this.routeParams.get("contactId"));
        }
    }
    ChangePasswordComponent.prototype.ngAfterViewInit = function () {
        if (location.href.split("/").slice(-1).toString() == "account-profile") {
        }
        else {
            jQuery('.content-wrapper').addClass('ChangePwdOnly');
        }
    };
    ChangePasswordComponent.prototype.vaildateData = function () {
        var alertmg = "";
        if (this.routeParams.get("originator") == null && this.model.OldPassword == "") {
            alertmg = 'Old Password is Required.\r\n';
        }
        if (this.model.OldPassword == this.model.NewPassword) {
            alertmg = 'Old and New Password should never be the same.\r\n';
        }
        if (this.utility.containsSpecial(this.model.NewPassword) == false) {
            alertmg = 'Passwords must have at least one non letter character.\r\n';
        }
        if (this.utility.containsNumeric(this.model.NewPassword) == false) {
            alertmg = alertmg + 'Passwords must have at least one digit (0-9).\r\n';
        }
        if (this.utility.containsUpperCase(this.model.NewPassword) == false) {
            alertmg = alertmg + 'Passwords must have at least one uppercase (A-Z).\r\n';
        }
        if (this.utility.containsLowerCase(this.model.NewPassword) == false) {
            alertmg = alertmg + 'Passwords must have at least one lowercase (a-z).\r\n';
        }
        if (this.utility.verifyMinimumLength(this.model.NewPassword, 8) == false) {
            alertmg = alertmg + 'Password must be at least 8 characters long.';
        }
        return alertmg;
    };
    ChangePasswordComponent.prototype.SetUserData = function (email, isOldPassVisible, contactID) {
        this.model.Email = email;
        this.showOldPassword = isOldPassVisible;
        if (contactID !== null) {
            this.model.ContactID = contactID;
        }
        else {
            this.validateUserEmail(email);
        }
    };
    ChangePasswordComponent.prototype.validateUserEmail = function (email) {
        var _this = this;
        this.httpService.validateUserEmail(email)
            .subscribe(function (data) { return _this.loadValidationData(data); }, function (error) { return _this.logService.log(error + ": Invalid email address"); }, function () { return _this.logService.log("email address validated!"); });
    };
    ChangePasswordComponent.prototype.loadValidationData = function (data) {
        this.model.ContactID = data.contactID;
    };
    ChangePasswordComponent.prototype.onSubmitForm = function () {
        if (this.childReCaptcha.verified == false) {
            alert('Please verify yourself.');
            return;
        }
        var alertmsg = this.vaildateData();
        if (alertmsg !== '') {
            alert(alertmsg);
            return false;
        }
        else {
            this.saveChangePasword();
        }
    };
    ChangePasswordComponent.prototype.saveChangePasword = function () {
        var _this = this;
        this.fillEmailMessage();
        if (this.routeParams.get("originator") == null) {
            this.httpService.updateUserPassword(this.model)
                .subscribe(function (data) { return _this.redirectToLogin(); }, function (error) { return _this.showError(error); }, function () { return _this.logService.log("user details loaded Successfully!"); });
        }
        else {
            this.httpService.setUserPassword(this.model)
                .subscribe(function (data) { return _this.redirectToLogin(); }, function (error) { return _this.showError(error); }, function () { return _this.logService.log("user details loaded Successfully!"); });
        }
    };
    ChangePasswordComponent.prototype.redirectToLogin = function () {
        alert('Password changed successfully.');
        this.router.navigate(['Login']);
    };
    ChangePasswordComponent.prototype.showError = function (error) {
        alert(error);
        return false;
    };
    ChangePasswordComponent.prototype.fillEmailMessage = function () {
        var body = this.appConfig.ChangePasswordBody;
        this.model.EmailObject.From = this.appConfig.DefaultFromEmailAddress;
        this.model.EmailObject.To = this.model.Email;
        this.model.EmailObject.Subject = this.appConfig.ChangePasswordSubject;
        this.model.EmailObject.Body = body;
    };
    __decorate([
        core_1.ViewChild(reCaptchaComponent_1.ReCaptchaComponent)
    ], ChangePasswordComponent.prototype, "childReCaptcha", void 0);
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], ChangePasswordComponent.prototype, "childNotify", void 0);
    ChangePasswordComponent = __decorate([
        core_1.Component({
            selector: 'change-password',
            templateUrl: '../dev/tpl/change-password.html',
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, reCaptchaComponent_1.ReCaptchaComponent, notifications_component_1.NotificationsComponent],
            providers: [core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }), change_password_service_1.ChangePasswordService, logging_1.LoggingService]
        }),
        __param(0, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(1, core_1.Inject(change_password_service_1.ChangePasswordService)),
        __param(2, core_1.Inject(router_deprecated_1.Router)),
        __param(3, core_1.Inject(router_deprecated_1.RouteParams)),
        __param(4, core_1.Inject(logging_1.LoggingService))
    ], ChangePasswordComponent);
    return ChangePasswordComponent;
}());
exports.ChangePasswordComponent = ChangePasswordComponent;
//# sourceMappingURL=change-password.component.js.map