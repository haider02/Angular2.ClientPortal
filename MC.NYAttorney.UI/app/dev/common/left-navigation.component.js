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
var menu_service_1 = require('../menu/menu.service');
var utility_1 = require('../common/utility');
var customLocalStorage_1 = require('../common/customLocalStorage');
var account_profile_service_1 = require('../accountProfile/account-profile.service');
var logging_1 = require('../common/logging');
var LeftNavigationComponent = (function () {
    function LeftNavigationComponent(_service, _appConfig, _router, _routeParams, _accountProfileService, _logservice) {
        this.utility = new utility_1.Utility();
        this.screenName = "LeftNavigation";
        this.appConfig = _appConfig;
        this.httpService = _service;
        this.router = _router;
        this.routeParams = _routeParams;
        this.accountProfileService = _accountProfileService;
        this.logService = _logservice;
    }
    LeftNavigationComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var orderNo = +this.routeParams.get("orderno");
        this.orderNo = orderNo;
        this.orderstatus = this.routeParams.get("status");
        pagNav();
        if (JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName)) == null)
            this.accountProfileService.getPermissionsAgainstRole(this.screenName)
                .subscribe(function (data) {
                customLocalStorage_1.CustomLocalStorage.setItem(_this.screenName, JSON.stringify(data));
                _this.rolesAndPermissionHandler();
            }, function (error) { return _this.logService.log(error); });
        else
            this.rolesAndPermissionHandler();
    };
    LeftNavigationComponent.prototype.rolesAndPermissionHandler = function () {
        var _this = this;
        this.httpService.getAllMenus()
            .subscribe(function (data) { return _this.setMenuResponse(data); }, function (error) { return _this.logService.log(error + ": error"); }, function () { return _this.logService.log('Service Call Completed'); });
    };
    LeftNavigationComponent.prototype.setMenuResponse = function (data) {
        var _this = this;
        this.menuList = data;
        this.menuList = this.menuList.filter(function (x) { return x.RefDataId == _this.appConfig.MenuId; });
        var data = JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName));
        if (data.length > 0) {
            for (var index in data) {
                if (!data[index]["IsVisible"]) {
                    var index1 = this.menuList.findIndex(function (x) { return x.RouterLink == data[index]["CtrlName"]; });
                    if (index1 > -1) {
                        this.menuList.splice(index1, 1);
                    }
                }
            }
        }
    };
    LeftNavigationComponent.prototype.routeNavigator = function (menuLink) {
        this.router.navigate([menuLink.RouterLink, { orderno: this.orderNo, status: this.orderstatus }]);
    };
    LeftNavigationComponent.prototype.hideShowLeftMenu = function () {
        jQuery('body').toggleClass('nomenu');
    };
    __decorate([
        core_1.Input()
    ], LeftNavigationComponent.prototype, "selectedTab", void 0);
    LeftNavigationComponent = __decorate([
        core_1.Component({
            selector: 'left-navigation',
            templateUrl: '../dev/tpl/left-navigation.html',
            directives: [router_deprecated_1.ROUTER_DIRECTIVES],
            providers: [core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }),
                menu_service_1.MenuService,
                account_profile_service_1.AccountProfileService,
                logging_1.LoggingService
            ]
        }),
        __param(0, core_1.Inject(menu_service_1.MenuService)),
        __param(1, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(2, core_1.Inject(router_deprecated_1.Router)),
        __param(3, core_1.Inject(router_deprecated_1.RouteParams)),
        __param(4, core_1.Inject(account_profile_service_1.AccountProfileService)),
        __param(5, core_1.Inject(logging_1.LoggingService))
    ], LeftNavigationComponent);
    return LeftNavigationComponent;
}());
exports.LeftNavigationComponent = LeftNavigationComponent;
//# sourceMappingURL=left-navigation.component.js.map