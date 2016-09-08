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
//import {ContactComponent} from '../contacts/contact.component';
var grid_component_1 = require('../grid/grid.component');
var column_1 = require('../grid/column');
var state_component_1 = require('../DropDowns/state/state.component');
var city_component_1 = require('../DropDowns/city/city.component');
var county_component_1 = require('../DropDowns/county/county.component');
var city_service_1 = require('../DropDowns/city/city.service');
var customLocalStorage_1 = require('../common/customLocalStorage');
var utility_1 = require('../common/utility');
var title_clearance_service_1 = require('./title-clearance.service');
var title_clearance_model_1 = require('./title-clearance.model');
var left_navigation_component_1 = require('../common/left-navigation.component');
var header_detail_component_1 = require('../common/header-detail.component');
var enumerations_1 = require("../common/enumerations");
var dashboard_service_1 = require('../dashBoard/dashboard.service');
var account_profile_service_1 = require('../accountProfile/account-profile.service');
var logging_1 = require('../common/logging');
var TitleClearanceComponent = (function () {
    function TitleClearanceComponent(_appConfig, _referenceData, _router, _routeParams, _service, _dashboardService, _accountProfileService, _logservice) {
        this.active = true;
        this.utility = new utility_1.Utility();
        this.model = new title_clearance_model_1.TitleClearance();
        this.viewDetail = false;
        this.saveDetail = true;
        this.screenName = "TitleClearance";
        this.appConfig = _appConfig;
        this.referenceDataService = _referenceData;
        this.router = _router;
        this.routeParams = _routeParams;
        this.httpService = _service;
        this.clientTab = enumerations_1.enmTabs.TitleClearance;
        this.dashboardService = _dashboardService;
        this.accountProfileService = _accountProfileService;
        this.logService = _logservice;
    }
    TitleClearanceComponent.prototype.ngOnInit = function () {
        this.mortgageConnectGridColumns = this.getMortgageConnectGridColumns();
        this.newYorkGridColumns = this.getNewYorkGridColumns();
    };
    TitleClearanceComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.child.showLoader();
        if (this.utility.getClientId() !== null) {
            this.orderNo = +this.routeParams.get("orderno");
            this.model.OrderNo = this.orderNo;
            this.getClearanceItems();
            this.getCleartoCloseItems();
            this.getCEMACollateral();
            this.getCOOPCollateral();
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
    TitleClearanceComponent.prototype.loadRolesAndPermissions = function (data) {
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
        var obj = JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName));
        this.mortgageConnectGridColumns = this.getMortgageConnectGridColumns();
        this.newYorkGridColumns = this.getNewYorkGridColumns();
        for (var index in obj) {
            if (obj[index]["Parent"] == "MortgageConnectGrid") {
                if (!obj[index]["IsVisible"])
                    this.findAndRemove(this.mortgageConnectGridColumns, "name", obj[index]["CtrlName"]);
            }
            if (obj[index]["Parent"] == "NewYorkGrid") {
                if (!obj[index]["IsVisible"])
                    this.findAndRemove(this.newYorkGridColumns, "name", obj[index]["CtrlName"]);
            }
        }
    };
    TitleClearanceComponent.prototype.findAndRemove = function (array, property, value) {
        array.forEach(function (result, index) {
            if (result[property] === value) {
                //Remove from array
                array.splice(index, 1);
            }
        });
    };
    TitleClearanceComponent.prototype.getClearanceItems = function () {
        var _this = this;
        this.httpService.getClearanceItems(this.model.OrderNo)
            .subscribe(function (data) { return _this.loadClearanceItems(data); }, function (error) { return _this.logService.log(error + ": error in Clearance Items call"); }, function () { return _this.logService.log("Clearance Items loaded Successfully!"); });
    };
    TitleClearanceComponent.prototype.loadClearanceItems = function (data) {
        this.model.ClearanceItemsList = data;
        this.model.MortgageConnectList = this.model.ClearanceItemsList.filter(function (x) { return x.ExcludeAttorney == 1; });
        this.model.NewYorkList = this.model.ClearanceItemsList.filter(function (x) { return x.ExcludeAttorney == 0; });
        this.child.hideLoader();
    };
    TitleClearanceComponent.prototype.getMortgageConnectGridColumns = function () {
        return [
            new column_1.Column('ClearingTypeName', 'Clearing Type'),
            new column_1.Column('Name1', 'Name'),
            new column_1.Column('FollowUpDate', 'Follow Up'),
            new column_1.Column('DueDate', 'Due Date'),
            new column_1.Column('Status', 'Status')
        ];
    };
    TitleClearanceComponent.prototype.getNewYorkGridColumns = function () {
        return [
            new column_1.Column('ClearingTypeName', 'Clearing Type'),
            new column_1.Column('Name1', 'Name'),
            new column_1.Column('TCMethod', 'Follow Up/TC Method'),
            new column_1.Column('EditOnly', '')
        ];
    };
    TitleClearanceComponent.prototype.onSave = function () {
        this.child.showLoader();
        this.successMessageDisplay = true;
    };
    TitleClearanceComponent.prototype.saveHandler = function (data) {
        this.child.hideLoader();
        if (data < 0)
            this.child.showErrorNotification('Title Clearance save failed', 'Error!');
        else {
            this.child.showSuccessNotification('Title Clearance saved successfully', 'Success!');
        }
    };
    TitleClearanceComponent.prototype.editNewYorkRow = function (row) {
        this.model.ItemName = row.Name1;
        this.model.isSelectedCheckbox = row.Cleared;
        this.model.ItemAttorneyCleared = row.Cleared;
        this.model.ClearedBy = row.ClearedBy;
        this.model.ClearedDate = this.utility.getDateTime(row.ClearedDate);
        this.model.TCD_RowId = row.TCD_RowId;
        this.viewDetail = true;
    };
    TitleClearanceComponent.prototype.ItemAttorneyClearedChecked = function (isChecked) {
        this.model.ItemAttorneyCleared = isChecked;
        if (isChecked == true) {
            this.model.ClearedBy = this.utility.getContactFullName();
            this.model.ClearedDate = this.utility.getCurrentDateTime();
        }
        else {
            this.model.ClearedBy = "";
            this.model.ClearedDate = "";
        }
    };
    TitleClearanceComponent.prototype.onSaveClearanceItem = function () {
        var _this = this;
        if (this.model.ItemAttorneyCleared == true) {
            this.child.showLoader();
            this.httpService.saveNewYorkAttorneyItem(this.model)
                .subscribe(function (data) { return _this.saveClearanceItemHandler(data); }, function (error) {
                _this.child.showSaveErrorNotification();
                _this.child.hideLoader();
            }, function () { return _this.logService.log("API Call Finished Successfully!"); });
            this.successMessageDisplay = true;
        }
    };
    TitleClearanceComponent.prototype.saveClearanceItemHandler = function (data) {
        this.child.hideLoader();
        if (data < 0)
            this.child.showErrorNotification('Item Clearance save failed', 'Error!');
        else {
            this.child.showSuccessNotification('Item Clearance saved successfully', 'Success!');
        }
        this.viewDetail = false;
        this.getClearanceItems();
    };
    TitleClearanceComponent.prototype.getCleartoCloseItems = function () {
        var _this = this;
        this.httpService.getTCCleartoCloseDetail(this.model.OrderNo)
            .subscribe(function (data) { return _this.loadCleartoCloseItems(data); }, function (error) { return _this.logService.log(error + ": error in Clear to Close call"); }, function () { return _this.logService.log("Clear to Close loaded Successfully!"); });
    };
    TitleClearanceComponent.prototype.loadCleartoCloseItems = function (data) {
        if (data.length > 0) {
            this.model.isRequestedCheckbox = data[0].ReqApproval;
            this.model.FileClearanceRequested = data[0].ReqApproval;
            this.model.FileClearanceRequestedBy = data[0].ReqApprovalBy;
            this.model.FileClearanceRequestedDate = this.utility.getDateTime(data[0].ReqApprovalDate);
            this.model.FileClearanceApproved = data[0].Cleared;
            this.model.FileClearanceApprovedBy = data[0].ClearedBy;
            this.model.FileClearanceApprovedDate = this.utility.getDateTime(data[0].ClearedDate);
        }
        this.child.hideLoader();
    };
    TitleClearanceComponent.prototype.FileClearanceRequestedChecked = function (isChecked) {
        this.model.FileClearanceRequested = isChecked;
        if (isChecked == true) {
            this.model.FileClearanceRequestedBy = this.utility.getContactFullName();
            this.model.FileClearanceRequestedDate = this.utility.getCurrentDateTime();
        }
        else {
            this.model.FileClearanceRequestedBy = "";
            this.model.FileClearanceRequestedDate = "";
        }
    };
    TitleClearanceComponent.prototype.onSaveCleartoClose = function () {
        var _this = this;
        this.child.showLoader();
        this.saveDetail = false;
        this.fillEmailMessage();
        this.httpService.saveFileClearanceRequested(this.model)
            .subscribe(function (data) { return _this.saveCleartoCloseHandler(data); }, function (error) {
            _this.child.showSaveErrorNotification();
            _this.child.hideLoader();
        }, function () { return _this.logService.log("API Call Finished Successfully!"); });
        this.successMessageDisplay = true;
    };
    TitleClearanceComponent.prototype.saveCleartoCloseHandler = function (data) {
        this.child.hideLoader();
        if (data < 0)
            this.child.showErrorNotification('File Clearance Requested save failed', 'Error!');
        else {
            this.child.showSuccessNotification('File Clearance Requested saved successfully', 'Success!');
            this.model.isRequestedCheckbox = true;
        }
    };
    TitleClearanceComponent.prototype.getCEMACollateral = function () {
        var _this = this;
        this.httpService.getTCRequestQuestionsAnswered(this.model.OrderNo, "CEMA")
            .subscribe(function (data) { return _this.loadCEMACollateral(data); }, function (error) { return _this.logService.log(error + ": error in CEMA Collateral call"); }, function () { return _this.logService.log("CEMA Collateral loaded Successfully!"); });
    };
    TitleClearanceComponent.prototype.loadCEMACollateral = function (data) {
        this.model.CEMACollateralList = data;
    };
    TitleClearanceComponent.prototype.getCOOPCollateral = function () {
        var _this = this;
        this.httpService.getTCRequestQuestionsAnswered(this.model.OrderNo, "COOP")
            .subscribe(function (data) { return _this.loadCOOPCollateral(data); }, function (error) { return _this.logService.log(error + ": error in COOP Collateral call"); }, function () { return _this.logService.log("COOP Collateral loaded Successfully!"); });
    };
    TitleClearanceComponent.prototype.loadCOOPCollateral = function (data) {
        this.model.COOPCollateralList = data;
    };
    TitleClearanceComponent.prototype.fillEmailMessage = function () {
        var body = this.utility.getContactFullName() + " has requested the file to be approved as cleared." +
            " Please contact Mortgage Connect if you have any questions or you believe you've received this email in error.\n\nThank you, " +
            "\nMortgage Connect " +
            "\nwww.MortgageConnectLP.com" +
            "\n\n* Please do not reply to this email.This email address is not monitored.";
        this.model.From = this.appConfig.DefaultFromEmailAddress;
        this.model.Body = body;
    };
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], TitleClearanceComponent.prototype, "child", void 0);
    TitleClearanceComponent = __decorate([
        core_1.Component({
            selector: 'title-clearance',
            templateUrl: '../dev/tpl/title-clearance.html',
            inputs: ['state'],
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, notifications_component_1.NotificationsComponent, grid_component_1.GridComponent, state_component_1.StateComponent, city_component_1.CityComponent, county_component_1.CountyComponent,
                left_navigation_component_1.LeftNavigationComponent,
                header_detail_component_1.HeaderDetailComponent
            ],
            providers: [core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }), reference_data_service_1.ReferenceDataService,
                city_service_1.CityService,
                title_clearance_service_1.TitleClearanceService,
                dashboard_service_1.DashBoardService,
                account_profile_service_1.AccountProfileService,
                logging_1.LoggingService
            ]
        }),
        __param(0, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(1, core_1.Inject(reference_data_service_1.ReferenceDataService)),
        __param(2, core_1.Inject(router_deprecated_1.Router)),
        __param(3, core_1.Inject(router_deprecated_1.RouteParams)),
        __param(4, core_1.Inject(title_clearance_service_1.TitleClearanceService)),
        __param(5, core_1.Inject(dashboard_service_1.DashBoardService)),
        __param(6, core_1.Inject(account_profile_service_1.AccountProfileService)),
        __param(7, core_1.Inject(logging_1.LoggingService))
    ], TitleClearanceComponent);
    return TitleClearanceComponent;
}());
exports.TitleClearanceComponent = TitleClearanceComponent;
//# sourceMappingURL=title-clearance.component.js.map