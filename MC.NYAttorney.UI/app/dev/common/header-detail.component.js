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
var menu_service_1 = require('../menu/menu.service');
var header_detail_service_1 = require('../common/header-detail.service');
var utility_1 = require('../common/utility');
var customLocalStorage_1 = require('../common/customLocalStorage');
var account_profile_service_1 = require('../accountProfile/account-profile.service');
var HeaderDetailComponent = (function () {
    function HeaderDetailComponent(_service, _appConfig, _router, _headerservice, _routeParams, _accountProfileService, _logservice) {
        this.utility = new utility_1.Utility();
        this.screenName = "OrderHeader";
        this.appConfig = _appConfig;
        this.httpService = _service;
        this.router = _router;
        this.routeParams = _routeParams;
        this.headerService = _headerservice;
        this.accountProfileService = _accountProfileService;
        this.logService = _logservice;
    }
    HeaderDetailComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var orderNo = +this.routeParams.get("orderno");
        this.orderNo = orderNo;
        var status = this.routeParams.get("status");
        this.orderStatus = status;
        this.getOrderHeader();
        if (JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName)) == null)
            this.accountProfileService.getPermissionsAgainstRole(this.screenName)
                .subscribe(function (data) {
                customLocalStorage_1.CustomLocalStorage.setItem(_this.screenName, JSON.stringify(data));
                _this.loadRolesAndPermissions(data);
            }, function (error) { return _this.logService.log(error); });
        else
            this.loadRolesAndPermissions(JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName)));
    };
    HeaderDetailComponent.prototype.loadRolesAndPermissions = function (data) {
        if (data.length > 0) {
            for (var index in data) {
                if (!data[index]["IsVisible"]) {
                    jQuery("#" + data[index]["CtrlName"]).hide();
                }
                else if (!data[index]["IsEnabled"]) {
                    jQuery("#" + data[index]["CtrlName"] + " :input").attr("disabled", true);
                }
            }
        }
    };
    HeaderDetailComponent.prototype.routeNavigator = function (menuLink) {
        this.router.navigate([menuLink.RouterLink]);
    };
    HeaderDetailComponent.prototype.getOrderHeader = function () {
        var _this = this;
        this.headerService.getOrderHeader(this.orderNo)
            .subscribe(function (data) { return _this.loadOrderHeader(data); }, function (error) { return _this.logService.log(error + ": error in Order Header call"); }, function () { return _this.logService.log("Order Header loaded Successfully!"); });
    };
    HeaderDetailComponent.prototype.loadOrderHeader = function (data) {
        this.headerList = data;
        this.logService.log(data);
        if (data !== null && data.length > 0) {
            this.FullName = data[0].Name;
            this.address = data[0].Address;
            this.HomePhone = this.utility.formatPhoneCell(data[0].HomePhone);
            this.CellPhone = this.utility.formatPhoneCell(data[0].CellPhone);
            this.Email = data[0].Email;
            this.Note = data[0].Note;
            this.loanNo = data[0].LoanNo;
            this.loanAmount = this.utility.formatAmount(data[0].LoanAmount, "$");
            this.ProviderContact = data[0].ProviderContact;
        }
    };
    HeaderDetailComponent.prototype.hideShowNotes = function () {
        jQuery('.urgent-notes-content').stop().slideToggle();
    };
    HeaderDetailComponent.prototype.onClose = function () {
        jQuery('.header-detail-inner').slideToggle();
        jQuery('#headerDetailToggle').find('span').toggleClass('fa-caret-square-o-up').toggleClass('fa-caret-square-o-down');
    };
    HeaderDetailComponent = __decorate([
        core_1.Component({
            selector: 'header-detail',
            templateUrl: '../dev/tpl/header-detail.html',
            directives: [router_deprecated_1.ROUTER_DIRECTIVES],
            providers: [core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }),
                menu_service_1.MenuService,
                header_detail_service_1.HeaderDetailService,
                account_profile_service_1.AccountProfileService,
                logging_1.LoggingService
            ]
        }),
        __param(0, core_1.Inject(menu_service_1.MenuService)),
        __param(1, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(2, core_1.Inject(router_deprecated_1.Router)),
        __param(3, core_1.Inject(header_detail_service_1.HeaderDetailService)),
        __param(4, core_1.Inject(router_deprecated_1.RouteParams)),
        __param(5, core_1.Inject(account_profile_service_1.AccountProfileService)),
        __param(6, core_1.Inject(logging_1.LoggingService))
    ], HeaderDetailComponent);
    return HeaderDetailComponent;
}());
exports.HeaderDetailComponent = HeaderDetailComponent;
//# sourceMappingURL=header-detail.component.js.map