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
var logging_1 = require('../common/logging');
var app_config_1 = require('../app-config');
var utility_1 = require('../common/utility');
var customLocalStorage_1 = require('../common/customLocalStorage');
var login_service_1 = require('../login/login.service');
var MainHeaderComponent = (function () {
    function MainHeaderComponent(_router, _loginsrv, _logservice) {
        this.utility = new utility_1.Utility();
        this.router = _router;
        this.loginService = _loginsrv;
        this.logService = _logservice;
    }
    MainHeaderComponent.prototype.getUserName = function () {
        var userName = customLocalStorage_1.CustomLocalStorage.getItem('user_FullName');
        if (userName == null)
            return "";
        return userName;
    };
    MainHeaderComponent.prototype.signOut = function () {
        var _this = this;
        this.loginService.logout()
            .subscribe(function (data) {
            customLocalStorage_1.CustomLocalStorage.clear();
            _this.router.navigate(['Login']);
        }, function (error) { return _this.logService.log(error + ": error while fetching user details"); }, function () { return _this.logService.log("user detials loaded Successfully!"); });
    };
    MainHeaderComponent.prototype.dashBoardClick = function () {
        if (location.href.split("/").slice(-1).toString() == "dashboard") {
            window.location.reload(false);
        }
    };
    MainHeaderComponent.prototype.isTokenExists = function () {
        var token = customLocalStorage_1.CustomLocalStorage.getItem('id_token');
        if (token == null)
            return true;
        return false;
    };
    MainHeaderComponent = __decorate([
        core_1.Component({
            selector: 'main-header',
            templateUrl: '../dev/tpl/main-header.html',
            directives: [router_deprecated_1.ROUTER_DIRECTIVES],
            providers: [core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }), login_service_1.LoginService, logging_1.LoggingService]
        }),
        __param(0, core_1.Inject(router_deprecated_1.Router)),
        __param(1, core_1.Inject(login_service_1.LoginService)),
        __param(2, core_1.Inject(logging_1.LoggingService))
    ], MainHeaderComponent);
    return MainHeaderComponent;
}());
exports.MainHeaderComponent = MainHeaderComponent;
//# sourceMappingURL=main-header.component.js.map