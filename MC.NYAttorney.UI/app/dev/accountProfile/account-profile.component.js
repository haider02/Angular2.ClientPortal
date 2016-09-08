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
var account_profile_model_1 = require('./account-profile.model');
var app_config_1 = require('../app-config');
var account_profile_service_1 = require('./account-profile.service');
var utility_1 = require('../common/utility');
var customLocalStorage_1 = require('../common/customLocalStorage');
var change_password_component_1 = require('../changePassword/change-password.component');
var logging_1 = require('../common/logging');
var AccountProfileComponent = (function () {
    function AccountProfileComponent(_orderService, _router, _logservice) {
        this.model = new account_profile_model_1.AccountProfile();
        this.fullAddress = "";
        this.contactId = "";
        this.utility = new utility_1.Utility();
        this.httpService = _orderService;
        this.router = _router;
        this.logService = _logservice;
    }
    AccountProfileComponent.prototype.ngAfterViewInit = function () {
        this.contactId = customLocalStorage_1.CustomLocalStorage.getItem("user_ContactId");
        this.getUserDetail();
    };
    AccountProfileComponent.prototype.getUserDetail = function () {
        var _this = this;
        this.httpService.getAccountDetails(this.contactId)
            .subscribe(function (data) { return _this.loadUserData(data); }, function (error) { return _this.logService.log(error + ": error while fetching user details"); }, function () { return _this.logService.log("user detials loaded Successfully!"); });
    };
    AccountProfileComponent.prototype.loadUserData = function (data) {
        if (data.length > 0) {
            this.model.Name = data[0].Name;
            this.model.Line1 = data[0].Line1;
            this.model.Line2 = data[0].Line2;
            this.model.city = data[0].city;
            this.model.State = data[0].State;
            this.model.Zip = data[0].Zip;
            this.model.MainContact = data[0].MainContact;
            this.model.FullName = data[0].FullName;
            this.model.Email = data[0].Email;
            this.model.MyRole = data[0].MyRole;
            this.model.Contact = data[0].Contact;
            this.fullAddress = this.model.Line1 + " " + this.model.Line2 + " " + this.model.city + " " + this.model.State + " ," + this.model.Zip;
            this.child.SetUserData(this.model.Email, true, this.contactId);
        }
    };
    __decorate([
        core_1.ViewChild(change_password_component_1.ChangePasswordComponent)
    ], AccountProfileComponent.prototype, "child", void 0);
    AccountProfileComponent = __decorate([
        core_1.Component({
            selector: 'ac-profile',
            templateUrl: '../dev/tpl/account-profile.html',
            directives: [change_password_component_1.ChangePasswordComponent],
            providers: [core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }), account_profile_service_1.AccountProfileService, logging_1.LoggingService]
        }),
        __param(0, core_1.Inject(account_profile_service_1.AccountProfileService)),
        __param(1, core_1.Inject(router_deprecated_1.Router)),
        __param(2, core_1.Inject(logging_1.LoggingService))
    ], AccountProfileComponent);
    return AccountProfileComponent;
}());
exports.AccountProfileComponent = AccountProfileComponent;
//# sourceMappingURL=account-profile.component.js.map