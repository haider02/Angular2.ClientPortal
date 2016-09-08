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
var utility_1 = require('./utility');
var item_checklist_service_1 = require('./item-checklist.service');
var logging_1 = require('../common/logging');
var ItemCheckListComponent = (function () {
    function ItemCheckListComponent(_appConfig, _router, _service, _routeParams, _logservice) {
        this.model = new ItemCheckList();
        this.utility = new utility_1.Utility();
        this.isAttorneyEnable = false;
        this.appConfig = _appConfig;
        this.httpService = _service;
        this.router = _router;
        this.routeParams = _routeParams;
        this.logService = _logservice;
    }
    ItemCheckListComponent.prototype.ngAfterViewInit = function () {
        var orderNo = +this.routeParams.get("orderno");
        this.model.OrderNo = orderNo;
        var status = this.routeParams.get("status");
        this.model.OrderStatus = status;
    };
    ItemCheckListComponent.prototype.getCheckList = function (pCode) {
        var _this = this;
        this.model.ProductCode = pCode;
        this.httpService.getItemCheckList(this.model.OrderNo, this.model.ProductCode)
            .subscribe(function (data) { return _this.loadCheckList(data); }, function (error) { return _this.logService.log(error + ": error in CheckList call"); }, function () { return _this.logService.log("CheckList loaded Successfully!"); });
    };
    ItemCheckListComponent.prototype.loadCheckList = function (data) {
        this.model.ItemCheckList = data;
        var maxDate, minDate;
        var deptCompletedone = 0;
        if (this.model.ProductCode == "Refinance") {
            //Opened
            minDate = this.utility.findMin(data, "Opened");
            this.model.OpenedItemDate = this.utility.getDateTime(minDate);
            //Departmental
            var departmentalCompleteList = data.filter(function (x) { return x.DepartmentalCompleteExists == 1; });
            if (departmentalCompleteList.length == 0) {
                jQuery(".departmentalItem").remove();
                deptCompletedone = 1;
            }
            else {
                if (this.utility.findNull(departmentalCompleteList, "DepartmentalComplete") == false) {
                    maxDate = this.utility.findMax(departmentalCompleteList, "DepartmentalComplete");
                    this.model.DepartmentalItemDate = this.utility.getDateTime(maxDate);
                    this.model.DepartmentalItemStatus = "Complete";
                    deptCompletedone = 1;
                }
            }
            //Title
            var titleCompleteList = data.filter(function (x) { return x.TitleCompleteExists == 1; });
            maxDate = this.utility.findMax(titleCompleteList, "TitleComplete");
            if (maxDate !== null && deptCompletedone == 1) {
                this.model.TitleItemDate = this.utility.getDateTime(maxDate);
                this.model.TitleItemStatus = "Complete";
            }
            //Collateral
            var collateralList = data.filter(function (x) { return x.CollateralDocumentExists == 1; });
            maxDate = this.utility.findMax(collateralList, "CollateralDocument");
            if (maxDate !== null) {
                this.model.CollateralItemDate = this.utility.getDateTime(maxDate);
                this.model.CollateralItemStatus = "Complete";
            }
            //Attorney
            var attorneyList = data.filter(function (x) { return x.AttorneyCleartoCloseEnable == true; });
            if (attorneyList.length > 0)
                this.isAttorneyEnable = true;
            maxDate = this.utility.findMax(data, "AttorneyCleartoCloseDate");
            if (maxDate !== null) {
                this.model.AttorneyItemDate = this.utility.getDateTime(maxDate);
                this.model.AttorneyItemStatus = "Complete";
            }
            //Mortgage Connect
            var cleartocloseList = data.filter(function (x) { return x.TitleClearedExists == 1; });
            maxDate = this.utility.findMax(cleartocloseList, "TitleCleared");
            if (maxDate !== null) {
                this.model.MortgageConnectItemDate = this.utility.getDateTime(maxDate);
                this.model.MortgageConnectItemStatus = "Complete";
            }
            else {
                maxDate = this.utility.findMax(cleartocloseList, "ClearedDate");
                if (maxDate !== null) {
                    this.model.MortgageConnectItemDate = this.utility.getDateTime(maxDate);
                    this.model.MortgageConnectItemStatus = "Complete";
                }
            }
            //Title Bill
            var titleBillList = data.filter(function (x) { return x.TitleBillUpdatedExists == 1; });
            maxDate = this.utility.findMax(titleBillList, "TitleBillUpdated");
            if (maxDate !== null) {
                this.model.TitleBillItemDate = this.utility.getDateTime(maxDate);
                this.model.TitleBillItemStatus = "Complete";
            }
            //Recording
            var recordingList = data.filter(function (x) { return x.DocumentRecordedExists == 1; });
            maxDate = this.utility.findMax(recordingList, "DocumentRecorded");
            if (maxDate !== null) {
                this.model.RecordingItemDate = this.utility.getDateTime(maxDate);
                this.model.RecordingItemStatus = "Complete";
            }
            //Policy
            var policyList = data.filter(function (x) { return x.FinalPolicyIssuedExists == 1; });
            maxDate = this.utility.findMax(policyList, "FinalPolicyIssued");
            if (maxDate !== null) {
                this.model.PolicyItemDate = this.utility.getDateTime(maxDate);
                this.model.PolicyItemStatus = "Complete";
            }
            //Title Update
            var titleUpdateList = data.filter(function (x) { return x.TitleUpdateExists == 1; });
            if (titleUpdateList.length == 0)
                jQuery(".titleUpdateItem").remove();
            else {
                maxDate = this.utility.findMax(titleUpdateList, "TitleUpdate");
                if (maxDate !== null) {
                    this.model.TitleUpdateItemDate = this.utility.getDateTime(maxDate);
                    this.model.TitleUpdateItemStatus = "Complete";
                }
            }
        }
        else if (this.model.ProductCode == "Purchase") {
            //Opened
            minDate = this.utility.findMin(data, "Opened");
            this.model.OpenedItemDate = this.utility.getDateTime(minDate);
            //Departmental
            var departmentalCompleteList = data.filter(function (x) { return x.DepartmentalCompleteExists == 1; });
            if (departmentalCompleteList.length == 0) {
                deptCompletedone = 1;
                jQuery(".departmentalItem").remove();
            }
            else {
                if (this.utility.findNull(departmentalCompleteList, "DepartmentalComplete") == false) {
                    maxDate = this.utility.findMax(departmentalCompleteList, "DepartmentalComplete");
                    this.model.DepartmentalItemDate = this.utility.getDateTime(maxDate);
                    this.model.DepartmentalItemStatus = "Complete";
                    deptCompletedone = 1;
                }
            }
            //Title
            var titleCompleteList = data.filter(function (x) { return x.TitleCompleteExists == 1; });
            maxDate = this.utility.findMax(titleCompleteList, "TitleComplete");
            if (maxDate !== null && deptCompletedone == 1) {
                this.model.TitleItemDate = this.utility.getDateTime(maxDate);
                this.model.TitleItemStatus = "Complete";
            }
            //Mortgage Connect
            var cleartocloseList = data.filter(function (x) { return x.TitleClearedExists == 1; });
            maxDate = this.utility.findMax(cleartocloseList, "TitleCleared");
            this.model.CollateralItemText = "Mortgage Connect Clear to Close - Title Company Ready to Schedule";
            if (maxDate !== null) {
                this.model.CollateralItemDate = this.utility.getDateTime(maxDate);
                this.model.CollateralItemStatus = "Complete";
            }
            else {
                maxDate = this.utility.findMax(cleartocloseList, "ClearedDate");
                if (maxDate !== null) {
                    this.model.CollateralItemDate = this.utility.getDateTime(maxDate);
                    this.model.CollateralItemStatus = "Complete";
                }
            }
            //Title Update
            var titleUpdateList = data.filter(function (x) { return x.TitleUpdateExists == 1; });
            maxDate = this.utility.findMax(titleUpdateList, "TitleUpdate");
            this.model.AttorneyItemText = "Title Update - Update of Title Report";
            if (titleUpdateList.length == 0)
                jQuery(".AttorneyItem").remove();
            else {
                if (maxDate !== null) {
                    this.model.AttorneyItemDate = this.utility.getDateTime(maxDate);
                    this.model.AttorneyItemStatus = "Complete";
                }
            }
            //Tax Update
            var titleBillList = data.filter(function (x) { return x.TitleTaxUpdateExists == 1; });
            maxDate = this.utility.findMax(titleBillList, "TitleTaxUpdate");
            this.model.MortgageConnectItemText = "Tax Update - Update of Tax Information";
            if (titleBillList.length == 0)
                jQuery(".MortgageConnectItem").remove();
            else {
                if (maxDate !== null) {
                    this.model.MortgageConnectItemDate = this.utility.getDateTime(maxDate);
                    this.model.MortgageConnectItemStatus = "Complete";
                }
            }
            //Title Bill
            var titleBillList = data.filter(function (x) { return x.TitleBillUpdatedExists == 1; });
            maxDate = this.utility.findMax(titleBillList, "TitleBillUpdated");
            this.model.TitleBillItemText = "Title Bill - Title Fees Prepared";
            if (maxDate !== null) {
                this.model.TitleBillItemDate = this.utility.getDateTime(maxDate);
                this.model.TitleBillItemStatus = "Complete";
            }
            //Scheduled Closing
            var scheduledClosingList = data.filter(function (x) { return x.ScheduledClosingExists == 1; });
            maxDate = this.utility.findMax(scheduledClosingList, "ScheduledClosingEnteredDate");
            this.model.RecordingItemText = "Scheduled Closing - Appointment for Closing";
            if (maxDate !== null) {
                var maxIndex = this.utility.findMaxIndex(scheduledClosingList, "ScheduledClosingEnteredDate");
                if (scheduledClosingList.length !== 0 && scheduledClosingList[maxIndex]["ScheduledClosing"] !== null) {
                    maxDate = this.utility.findMax(scheduledClosingList, "ScheduledClosing");
                    if (maxDate !== null) {
                        this.model.RecordingItemDate = this.utility.getDateTime(maxDate);
                        this.model.RecordingItemStatus = "Complete";
                    }
                }
            }
            //Recording
            var recordingList = data.filter(function (x) { return x.DocumentRecordedExists == 1; });
            maxDate = this.utility.findMax(recordingList, "DocumentRecorded");
            this.model.PolicyItemText = "Recording - Recordable Documents of Record";
            if (maxDate !== null) {
                this.model.PolicyItemDate = this.utility.getDateTime(maxDate);
                this.model.PolicyItemStatus = "Complete";
            }
            //Policy
            var policyList = data.filter(function (x) { return x.FinalPolicyIssuedExists == 1; });
            maxDate = this.utility.findMax(policyList, "FinalPolicyIssued");
            this.model.TitleUpdateItemText = "Policy - Final Policy Issued";
            if (maxDate !== null) {
                this.model.TitleUpdateItemDate = this.utility.getDateTime(maxDate);
                this.model.TitleUpdateItemStatus = "Complete";
            }
        }
        else if (this.model.ProductCode == "COOP") {
            //Opened
            minDate = this.utility.findMin(data, "Opened");
            this.model.OpenedItemDate = this.utility.getDateTime(minDate);
            //Lien Search
            this.model.DepartmentalItemText = "Lien Search - Data being collected and reviewed";
            var lienSearchList = data.filter(function (x) { return x.LienSearchExists == 1; });
            maxDate = this.utility.findMax(lienSearchList, "LienSearch");
            if (maxDate !== null) {
                this.model.DepartmentalItemDate = this.utility.getDateTime(maxDate);
                this.model.DepartmentalItemStatus = "Complete";
            }
            //Contin - Lien Search
            this.model.TitleItemText = "Contin. - Update of Lien Search";
            var lienSearchList = data.filter(function (x) { return x.ContinUpdateExists == 1; });
            maxDate = this.utility.findMax(lienSearchList, "ContinUpdate");
            if (maxDate !== null) {
                this.model.TitleItemDate = this.utility.getDateTime(maxDate);
                this.model.TitleItemStatus = "Complete";
            }
            //UCC-1 Requested
            this.model.CollateralItemText = "UCC-1 Requested - Recording is in progress";
            var ucc1RequestedList = data.filter(function (x) { return x.UCC1RequestedExists == 1; });
            maxDate = this.utility.findMax(ucc1RequestedList, "UCC1Requested");
            if (maxDate !== null) {
                this.model.CollateralItemDate = this.utility.getDateTime(maxDate);
                this.model.CollateralItemStatus = "Complete";
            }
            //UCC-1 Recorded
            this.model.AttorneyItemText = "UCC-1 Recorded";
            var ucc1RecordedList = data.filter(function (x) { return x.UCC1RecordedExists == 1; });
            maxDate = this.utility.findMax(ucc1RecordedList, "UCC1Recorded");
            if (maxDate !== null) {
                this.model.AttorneyItemDate = this.utility.getDateTime(maxDate);
                this.model.AttorneyItemStatus = "Complete";
            }
            //UCC-3 Requested
            this.model.MortgageConnectItemText = "UCC-3 Requested - Recording is in progress";
            var ucc3RequestedList = data.filter(function (x) { return x.UCC3RequestedExists == 1; });
            maxDate = this.utility.findMax(ucc3RequestedList, "UCC3Requested");
            if (maxDate !== null) {
                this.model.MortgageConnectItemDate = this.utility.getDateTime(maxDate);
                this.model.MortgageConnectItemStatus = "Complete";
            }
            //UCC-3 Recorded
            this.model.TitleBillItemText = "UCC-3 Recorded";
            var ucc3RecordedList = data.filter(function (x) { return x.UCC3RecordedExists == 1; });
            maxDate = this.utility.findMax(ucc3RecordedList, "UCC3Recorded");
            if (maxDate !== null) {
                this.model.TitleBillItemDate = this.utility.getDateTime(maxDate);
                this.model.TitleBillItemStatus = "Complete";
            }
            //No need of more than 7 items incase of COOP
            jQuery(".recordingItem").remove();
            jQuery(".policyItem").remove();
            jQuery(".titleUpdateItem").remove();
        }
    };
    ItemCheckListComponent.prototype.onSave = function () {
        var _this = this;
        this.notify.showLoader();
        this.httpService.saveOrderStatus(this.model.OrderNo)
            .subscribe(function (data) { return _this.OrderStatusSaved(data); }, function (error) {
            _this.notify.hideLoader();
            _this.notify.showErrorNotification("error in Attorney Clear to Close call" + error, "Error !");
        }, function () { return _this.logService.log("Order Status Saved Successfully!"); });
    };
    ItemCheckListComponent.prototype.OrderStatusSaved = function (data) {
        this.notify.hideLoader();
        this.notify.showSuccessNotification("Order Status Saved Successfully!", "Success!");
        setTimeout(function (d) { window.location.reload(false); }, 1000);
    };
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], ItemCheckListComponent.prototype, "notify", void 0);
    ItemCheckListComponent = __decorate([
        core_1.Component({
            selector: 'item-checklist',
            templateUrl: '../dev/tpl/item-checklist.html',
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, notifications_component_1.NotificationsComponent],
            providers: [core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }),
                item_checklist_service_1.ItemCheckListService, logging_1.LoggingService
            ]
        }),
        __param(0, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(1, core_1.Inject(router_deprecated_1.Router)),
        __param(2, core_1.Inject(item_checklist_service_1.ItemCheckListService)),
        __param(3, core_1.Inject(router_deprecated_1.RouteParams)),
        __param(4, core_1.Inject(logging_1.LoggingService))
    ], ItemCheckListComponent);
    return ItemCheckListComponent;
}());
exports.ItemCheckListComponent = ItemCheckListComponent;
var ItemCheckList = (function () {
    function ItemCheckList(OrderNo, OrderStatus, ProductCode, OpenedItemText, OpenedItemStatus, OpenedItemDate, TitleItemText, TitleItemStatus, TitleItemDate, DepartmentalItemText, DepartmentalItemStatus, DepartmentalItemDate, CollateralItemText, CollateralItemStatus, CollateralItemDate, AttorneyItemText, AttorneyItemStatus, AttorneyItemDate, MortgageConnectItemText, MortgageConnectItemStatus, MortgageConnectItemDate, TitleBillItemText, TitleBillItemStatus, TitleBillItemDate, RecordingItemText, RecordingItemStatus, RecordingItemDate, PolicyItemText, PolicyItemStatus, PolicyItemDate, TitleUpdateItemText, TitleUpdateItemStatus, TitleUpdateItemDate, ItemCheckList) {
        if (OrderNo === void 0) { OrderNo = null; }
        if (OrderStatus === void 0) { OrderStatus = null; }
        if (ProductCode === void 0) { ProductCode = ""; }
        if (OpenedItemText === void 0) { OpenedItemText = "Opened - Order received"; }
        if (OpenedItemStatus === void 0) { OpenedItemStatus = "Complete"; }
        if (OpenedItemDate === void 0) { OpenedItemDate = null; }
        if (TitleItemText === void 0) { TitleItemText = "Title - Data being collected and Underwritten"; }
        if (TitleItemStatus === void 0) { TitleItemStatus = "In-progress"; }
        if (TitleItemDate === void 0) { TitleItemDate = null; }
        if (DepartmentalItemText === void 0) { DepartmentalItemText = "Departmental - Data being collected for review"; }
        if (DepartmentalItemStatus === void 0) { DepartmentalItemStatus = "In-progress"; }
        if (DepartmentalItemDate === void 0) { DepartmentalItemDate = null; }
        if (CollateralItemText === void 0) { CollateralItemText = "Collateral - Documents being collected for review"; }
        if (CollateralItemStatus === void 0) { CollateralItemStatus = "In-progress"; }
        if (CollateralItemDate === void 0) { CollateralItemDate = null; }
        if (AttorneyItemText === void 0) { AttorneyItemText = "Attorney Clear to Close - Attorney ready to schedule"; }
        if (AttorneyItemStatus === void 0) { AttorneyItemStatus = "In-progress"; }
        if (AttorneyItemDate === void 0) { AttorneyItemDate = null; }
        if (MortgageConnectItemText === void 0) { MortgageConnectItemText = "Mortgage Connect Clear to Close - Title Company Ready to Schedule"; }
        if (MortgageConnectItemStatus === void 0) { MortgageConnectItemStatus = "In-progress"; }
        if (MortgageConnectItemDate === void 0) { MortgageConnectItemDate = null; }
        if (TitleBillItemText === void 0) { TitleBillItemText = "Title Bill - Title Fees Prepared"; }
        if (TitleBillItemStatus === void 0) { TitleBillItemStatus = "In-progress"; }
        if (TitleBillItemDate === void 0) { TitleBillItemDate = null; }
        if (RecordingItemText === void 0) { RecordingItemText = "Recording - Recordable Documents of Record"; }
        if (RecordingItemStatus === void 0) { RecordingItemStatus = "In-progress"; }
        if (RecordingItemDate === void 0) { RecordingItemDate = null; }
        if (PolicyItemText === void 0) { PolicyItemText = "Policy - Final Policy Issued"; }
        if (PolicyItemStatus === void 0) { PolicyItemStatus = "In-progress"; }
        if (PolicyItemDate === void 0) { PolicyItemDate = null; }
        if (TitleUpdateItemText === void 0) { TitleUpdateItemText = "Title Update - Update of Title Report"; }
        if (TitleUpdateItemStatus === void 0) { TitleUpdateItemStatus = "In-progress"; }
        if (TitleUpdateItemDate === void 0) { TitleUpdateItemDate = null; }
        if (ItemCheckList === void 0) { ItemCheckList = new Array(); }
        this.OrderNo = OrderNo;
        this.OrderStatus = OrderStatus;
        this.ProductCode = ProductCode;
        this.OpenedItemText = OpenedItemText;
        this.OpenedItemStatus = OpenedItemStatus;
        this.OpenedItemDate = OpenedItemDate;
        this.TitleItemText = TitleItemText;
        this.TitleItemStatus = TitleItemStatus;
        this.TitleItemDate = TitleItemDate;
        this.DepartmentalItemText = DepartmentalItemText;
        this.DepartmentalItemStatus = DepartmentalItemStatus;
        this.DepartmentalItemDate = DepartmentalItemDate;
        this.CollateralItemText = CollateralItemText;
        this.CollateralItemStatus = CollateralItemStatus;
        this.CollateralItemDate = CollateralItemDate;
        this.AttorneyItemText = AttorneyItemText;
        this.AttorneyItemStatus = AttorneyItemStatus;
        this.AttorneyItemDate = AttorneyItemDate;
        this.MortgageConnectItemText = MortgageConnectItemText;
        this.MortgageConnectItemStatus = MortgageConnectItemStatus;
        this.MortgageConnectItemDate = MortgageConnectItemDate;
        this.TitleBillItemText = TitleBillItemText;
        this.TitleBillItemStatus = TitleBillItemStatus;
        this.TitleBillItemDate = TitleBillItemDate;
        this.RecordingItemText = RecordingItemText;
        this.RecordingItemStatus = RecordingItemStatus;
        this.RecordingItemDate = RecordingItemDate;
        this.PolicyItemText = PolicyItemText;
        this.PolicyItemStatus = PolicyItemStatus;
        this.PolicyItemDate = PolicyItemDate;
        this.TitleUpdateItemText = TitleUpdateItemText;
        this.TitleUpdateItemStatus = TitleUpdateItemStatus;
        this.TitleUpdateItemDate = TitleUpdateItemDate;
        this.ItemCheckList = ItemCheckList;
    }
    return ItemCheckList;
}());
exports.ItemCheckList = ItemCheckList;
//# sourceMappingURL=item-checklist.component.js.map