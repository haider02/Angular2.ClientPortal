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
var logging_1 = require('../common/logging');
var login_model_1 = require('./login.model');
var login_service_1 = require('./login.service');
var cookie_1 = require('../common/cookie');
var customLocalStorage_1 = require('../common/customLocalStorage');
var LoginComponent = (function () {
    function LoginComponent(_appConfig, _router, _service, _logservice) {
        this.model = new login_model_1.Login();
        this.appConfig = _appConfig;
        this.router = _router;
        this.httpService = _service;
        this.isValidUser = true;
        this.logService = _logservice;
    }
    LoginComponent.prototype.ngAfterViewInit = function () {
        if (customLocalStorage_1.CustomLocalStorage.getItem("user_ContactId") !== null && customLocalStorage_1.CustomLocalStorage.getItem("id_token") !== null && customLocalStorage_1.CustomLocalStorage.getItem("refresh_token") !== null) {
            this.router.navigate(['DashBoard']);
        }
        else {
            if (cookie_1.Cookie.getCookie("CPRememberMe") == "true") {
                this.model.rememberMe = true;
                this.model.username = cookie_1.Cookie.getCookie("CPUserName");
            }
            else {
                this.model.rememberMe = false;
                this.model.username = "";
            }
            jQuery('.dashboard-wrapper.main').addClass('login');
            jQuery('#dashboard footer').css('display', 'none');
        }
    };
    LoginComponent.prototype.onLogin = function () {
        var _this = this;
        this.child.showLoader();
        this.isValidUser = true;
        this.httpService.ValidateUser(this.model)
            .subscribe(function (data) { return _this.validateLoginHandler(data); }, function (error) { return _this.validateLoginErrorHandler(error); }, function () { return _this.logService.log("Client Login Successfully!"); });
    };
    LoginComponent.prototype.validateLoginErrorHandler = function (error) {
        this.child.hideLoader();
        this.model.errorMessage = error.toString();
        this.isValidUser = false;
    };
    LoginComponent.prototype.validateLoginHandler = function (data) {
        customLocalStorage_1.CustomLocalStorage.setItem("tokenRefreshReqSent", "false");
        if (this.model.rememberMe == true) {
            cookie_1.Cookie.setCookie("CPRememberMe", "true", 30);
            cookie_1.Cookie.setCookie("CPUserName", this.model.username, 30);
        }
        else {
            cookie_1.Cookie.setCookie("CPRememberMe", "false", 30);
            cookie_1.Cookie.setCookie("CPUserName", "", 30);
        }
        this.pushToLocalStorage(data);
        this.isValidUser = true;
        this.child.hideLoader();
        this.router.navigate(['DashBoard']);
    };
    LoginComponent.prototype.onLogOut = function () {
        var _this = this;
        this.httpService.logout()
            .subscribe(function (data) { return _this.validateLogoutHandler(data); }, function (error) {
            _this.isValidUser = false;
        }, function () { return _this.logService.log("Client LogoutSuccessfully!"); });
    };
    LoginComponent.prototype.validateLogoutHandler = function (data) {
        this.isValidUser = false;
        this.removeFromLocalStorage();
        this.router.navigate(['Login']);
    };
    LoginComponent.prototype.pushToLocalStorage = function (data) {
        customLocalStorage_1.CustomLocalStorage.setItem("id_token", data.access_token);
        customLocalStorage_1.CustomLocalStorage.setItem("refresh_token", data.refresh_token);
        customLocalStorage_1.CustomLocalStorage.setItem("user_ContactId", data.userContactId);
        customLocalStorage_1.CustomLocalStorage.setItem("user_ClientId", data.userClientId);
        customLocalStorage_1.CustomLocalStorage.setItem("user_FullName", data.userFullName);
        customLocalStorage_1.CustomLocalStorage.setItem("session_TimeOut", data.SessionTimeOutinMinutes);
    };
    LoginComponent.prototype.removeFromLocalStorage = function () {
        customLocalStorage_1.CustomLocalStorage.clear();
    };
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], LoginComponent.prototype, "child", void 0);
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'login',
            templateUrl: '../dev/tpl/login.html',
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, notifications_component_1.NotificationsComponent],
            providers: [core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }), login_service_1.LoginService, logging_1.LoggingService]
        }),
        __param(0, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(1, core_1.Inject(router_deprecated_1.Router)),
        __param(2, core_1.Inject(login_service_1.LoginService)),
        __param(3, core_1.Inject(logging_1.LoggingService))
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map