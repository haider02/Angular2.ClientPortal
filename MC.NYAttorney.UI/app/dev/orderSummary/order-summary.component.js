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
var reference_data_service_1 = require('../referenceData/reference-data.service');
var notifications_component_1 = require('../notifications/notifications.component');
var logging_1 = require('../common/logging');
var grid_component_1 = require('../grid/grid.component');
var state_component_1 = require('../DropDowns/state/state.component');
var city_component_1 = require('../DropDowns/city/city.component');
var county_component_1 = require('../DropDowns/county/county.component');
var city_service_1 = require('../DropDowns/city/city.service');
var account_profile_service_1 = require('../accountProfile/account-profile.service');
var utility_1 = require('../common/utility');
var order_summary_service_1 = require('./order-summary.service');
var order_summary_model_1 = require('./order-summary.model');
var left_navigation_component_1 = require('../common/left-navigation.component');
var header_detail_component_1 = require('../common/header-detail.component');
var enumerations_1 = require("../common/enumerations");
var milestone_tracker_component_1 = require('../common/milestone-tracker.component');
var item_checklist_component_1 = require('../common/item-checklist.component');
var customLocalStorage_1 = require('../common/customLocalStorage');
var OrderSummaryComponent = (function () {
    function OrderSummaryComponent(_appConfig, _referenceData, _router, _routeParams, _service, _accountProfileService, _logservice) {
        this.active = true;
        this.utility = new utility_1.Utility();
        this.model = new order_summary_model_1.OrderSummary();
        this.isAttorneyEnable = false;
        this.screenName = "OrderSummary";
        this.appConfig = _appConfig;
        this.referenceDataService = _referenceData;
        this.router = _router;
        this.routeParams = _routeParams;
        this.httpService = _service;
        this.clientTab = enumerations_1.enmTabs.OrderSummary;
        this.accountProfileService = _accountProfileService;
        this.logService = _logservice;
    }
    OrderSummaryComponent.prototype.ngOnInit = function () {
        this.routetoLogin();
    };
    OrderSummaryComponent.prototype.ngOnChanges = function () {
    };
    OrderSummaryComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.child.showLoader();
        if (this.utility.getClientId() !== null) {
            this.orderNo = +this.routeParams.get("orderno");
            this.model.OrderNo = this.orderNo;
            this.getProductCodeByOrder();
            if (JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName)) == null)
                this.accountProfileService.getPermissionsAgainstRole(this.screenName)
                    .subscribe(function (data) {
                    customLocalStorage_1.CustomLocalStorage.setItem(_this.screenName, JSON.stringify(data));
                    _this.loadRolesAndPermissions(data);
                }, function (error) { return _this.logService.log(error); });
            else
                this.loadRolesAndPermissions(JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName)));
        }
    };
    OrderSummaryComponent.prototype.loadRolesAndPermissions = function (data) {
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
    OrderSummaryComponent.prototype.routetoLogin = function () {
        if (customLocalStorage_1.CustomLocalStorage.getItem("user_ContactId") == null || customLocalStorage_1.CustomLocalStorage.getItem("id_token") == null || customLocalStorage_1.CustomLocalStorage.getItem("refresh_token") == null) {
            this.router.navigate(['Login']);
        }
    };
    OrderSummaryComponent.prototype.getProductCodeByOrder = function () {
        var _this = this;
        this.httpService.getProductCodeByOrder(this.model.OrderNo)
            .subscribe(function (data) { return _this.loadProductCode(data); }, function (error) { return _this.logService.log(error + ": error in Product Code call"); }, function () { return _this.logService.log("Product Code loaded Successfully!"); });
    };
    OrderSummaryComponent.prototype.loadProductCode = function (data) {
        this.model.ProductCode = data;
        this.trackerChild.getMileStoneTracker(data);
        this.checklistChild.getCheckList(data);
        this.child.hideLoader();
    };
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], OrderSummaryComponent.prototype, "child", void 0);
    __decorate([
        core_1.ViewChild(milestone_tracker_component_1.MilestoneTrackerComponent)
    ], OrderSummaryComponent.prototype, "trackerChild", void 0);
    __decorate([
        core_1.ViewChild(item_checklist_component_1.ItemCheckListComponent)
    ], OrderSummaryComponent.prototype, "checklistChild", void 0);
    OrderSummaryComponent = __decorate([
        core_1.Component({
            selector: 'order-summary',
            templateUrl: '../dev/tpl/order-summary.html',
            inputs: ['state'],
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, notifications_component_1.NotificationsComponent, grid_component_1.GridComponent, state_component_1.StateComponent, city_component_1.CityComponent, county_component_1.CountyComponent,
                left_navigation_component_1.LeftNavigationComponent,
                header_detail_component_1.HeaderDetailComponent,
                milestone_tracker_component_1.MilestoneTrackerComponent,
                item_checklist_component_1.ItemCheckListComponent
            ],
            providers: [core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }), reference_data_service_1.ReferenceDataService,
                city_service_1.CityService,
                order_summary_service_1.OrderSummaryService,
                account_profile_service_1.AccountProfileService,
                logging_1.LoggingService
            ]
        }),
        __param(0, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(1, core_1.Inject(reference_data_service_1.ReferenceDataService)),
        __param(2, core_1.Inject(router_deprecated_1.Router)),
        __param(3, core_1.Inject(router_deprecated_1.RouteParams)),
        __param(4, core_1.Inject(order_summary_service_1.OrderSummaryService)),
        __param(5, core_1.Inject(account_profile_service_1.AccountProfileService)),
        __param(6, core_1.Inject(logging_1.LoggingService))
    ], OrderSummaryComponent);
    return OrderSummaryComponent;
}());
exports.OrderSummaryComponent = OrderSummaryComponent;
//# sourceMappingURL=order-summary.component.js.map