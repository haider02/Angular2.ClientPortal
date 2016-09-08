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
var utility_1 = require('./utility');
var milestone_tracker_service_1 = require('./milestone-tracker.service');
var logging_1 = require('../common/logging');
var MilestoneTrackerComponent = (function () {
    function MilestoneTrackerComponent(_appConfig, _router, _service, _routeParams, _logservice) {
        this.model = new MilestoneTracker();
        this.utility = new utility_1.Utility();
        this.appConfig = _appConfig;
        this.httpService = _service;
        this.router = _router;
        this.routeParams = _routeParams;
        this.logService = _logservice;
    }
    MilestoneTrackerComponent.prototype.ngAfterViewInit = function () {
        var orderNo = +this.routeParams.get("orderno");
        this.model.OrderNo = orderNo;
        var status = this.routeParams.get("status");
        this.model.OrderStatus = status;
    };
    MilestoneTrackerComponent.prototype.getMileStoneTracker = function (pCode) {
        var _this = this;
        this.model.ProductCode = pCode;
        this.httpService.getMileStoneTracker(this.model.OrderNo, this.model.ProductCode)
            .subscribe(function (data) { return _this.loadMileStoneTracker(data); }, function (error) { return _this.logService.log(error + ": error in MileStone Tracker call"); }, function () { return _this.logService.log("MileStone Tracker loaded Successfully!"); });
    };
    MilestoneTrackerComponent.prototype.loadMileStoneTracker = function (data) {
        this.model.MileStoneTrackerList = data;
        var maxDate, minDate;
        var deptCompletedone = 0;
        if (this.model.ProductCode == "Refinance" || this.model.ProductCode == "Purchase") {
            //Opened
            minDate = this.utility.findMin(data, "Opened");
            this.model.OpenedDate = this.utility.getDate(minDate);
            //Departmental Complete
            var departmentalCompleteList = data.filter(function (x) { return x.DepartmentalCompleteExists == 1; });
            if (departmentalCompleteList.length == 0) {
                deptCompletedone = 1;
                jQuery(".departmentalComplete").parent().remove();
            }
            else {
                if (this.utility.findNull(departmentalCompleteList, "DepartmentalComplete") == false) {
                    maxDate = this.utility.findMax(departmentalCompleteList, "DepartmentalComplete");
                    this.model.DepartmentalCompleteDate = this.utility.getDate(maxDate);
                    jQuery(".departmentalComplete").parent().addClass("done");
                    deptCompletedone = 1;
                }
            }
            //Title Complete
            var titleCompleteList = data.filter(function (x) { return x.TitleCompleteExists == 1; });
            maxDate = this.utility.findMax(titleCompleteList, "TitleComplete");
            if (maxDate !== null && deptCompletedone == 1) {
                this.model.TitleCompleteDate = this.utility.getDate(maxDate);
                jQuery(".titleComplete").parent().addClass("done");
            }
            //Title Cleared
            var titleClearedList = data.filter(function (x) { return x.TitleClearedExists == 1; });
            maxDate = this.utility.findMax(titleClearedList, "TitleCleared");
            if (maxDate !== null) {
                this.model.TitleClearedDate = this.utility.getDate(maxDate);
                jQuery(".titleCleared").parent().addClass("done");
            }
            //Title Bill Update
            var titleBillUpdateList = data.filter(function (x) { return x.TitleBillUpdatedExists == 1; });
            maxDate = this.utility.findMax(titleBillUpdateList, "TitleBillUpdated");
            if (maxDate !== null) {
                this.model.TitleBillUpdateDate = this.utility.getDate(maxDate);
                jQuery(".titleBillUpdate").parent().addClass("done");
            }
            //Document Recorded
            var documentRecordedList = data.filter(function (x) { return x.DocumentRecordedExists == 1; });
            maxDate = this.utility.findMax(documentRecordedList, "DocumentRecorded");
            if (maxDate !== null) {
                this.model.DocumentRecordedDate = this.utility.getDate(maxDate);
                jQuery(".documentRecorded").parent().addClass("done");
            }
            //Final Policy Issued
            var finalPolicyIssuedList = data.filter(function (x) { return x.FinalPolicyIssuedExists == 1; });
            maxDate = this.utility.findMax(finalPolicyIssuedList, "FinalPolicyIssued");
            if (maxDate !== null) {
                this.model.FinalPolicyIssuedDate = this.utility.getDate(maxDate);
                jQuery(".finalPolicyIssued").parent().addClass("done");
            }
        }
        else if (this.model.ProductCode == "COOP") {
            //Opened
            minDate = this.utility.findMin(data, "Opened");
            this.model.OpenedDate = this.utility.getDate(minDate);
            //Lien Search
            this.model.DepartmentalCompleteText = "Lien Search";
            var lienSearchList = data.filter(function (x) { return x.LienSearchExists == 1; });
            maxDate = this.utility.findMax(lienSearchList, "LienSearch");
            if (maxDate !== null) {
                this.model.DepartmentalCompleteDate = this.utility.getDate(maxDate);
                jQuery(".departmentalComplete").parent().addClass("done");
            }
            //UCC-1 Requested
            this.model.TitleCompleteText = "UCC-1 Requested";
            var ucc1RequestedList = data.filter(function (x) { return x.UCC1RequestedExists == 1; });
            maxDate = this.utility.findMax(ucc1RequestedList, "UCC1Requested");
            if (maxDate !== null) {
                this.model.TitleCompleteDate = this.utility.getDate(maxDate);
                jQuery(".titleComplete").parent().addClass("done");
            }
            //UCC-1 Recorded
            this.model.TitleClearedText = "UCC-1 Recorded";
            var ucc1RecordedList = data.filter(function (x) { return x.UCC1RecordedExists == 1; });
            maxDate = this.utility.findMax(ucc1RecordedList, "UCC1Recorded");
            if (maxDate !== null) {
                this.model.TitleClearedDate = this.utility.getDate(maxDate);
                jQuery(".titleCleared").parent().addClass("done");
            }
            //UCC-3 Requested
            this.model.TitleBillUpdateText = "UCC-3 Requested";
            var ucc3RequestedList = data.filter(function (x) { return x.UCC3RequestedExists == 1; });
            maxDate = this.utility.findMax(ucc3RequestedList, "UCC3Requested");
            if (maxDate !== null) {
                this.model.TitleBillUpdateDate = this.utility.getDate(maxDate);
                jQuery(".titleBillUpdate").parent().addClass("done");
            }
            //UCC-3 Recorded
            this.model.DocumentRecordedText = "UCC-3 Recorded";
            var ucc3RecordedList = data.filter(function (x) { return x.UCC3RecordedExists == 1; });
            maxDate = this.utility.findMax(ucc3RecordedList, "UCC3Recorded");
            if (maxDate !== null) {
                this.model.DocumentRecordedDate = this.utility.getDate(maxDate);
                jQuery(".documentRecorded").parent().addClass("done");
            }
            //No need of 7th tracker item incase of COOP
            jQuery(".finalPolicyIssued").parent().remove();
            jQuery(".documentRecorded").find(".bar").remove();
        }
    };
    MilestoneTrackerComponent = __decorate([
        core_1.Component({
            selector: 'milestone-tracker',
            templateUrl: '../dev/tpl/milestone-tracker.html',
            directives: [router_deprecated_1.ROUTER_DIRECTIVES],
            providers: [core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }),
                milestone_tracker_service_1.MilestoneTrackerService, logging_1.LoggingService
            ]
        }),
        __param(0, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(1, core_1.Inject(router_deprecated_1.Router)),
        __param(2, core_1.Inject(milestone_tracker_service_1.MilestoneTrackerService)),
        __param(3, core_1.Inject(router_deprecated_1.RouteParams)),
        __param(4, core_1.Inject(logging_1.LoggingService))
    ], MilestoneTrackerComponent);
    return MilestoneTrackerComponent;
}());
exports.MilestoneTrackerComponent = MilestoneTrackerComponent;
var MilestoneTracker = (function () {
    function MilestoneTracker(OrderNo, OrderStatus, ProductCode, OpenedText, OpenedDate, TitleCompleteText, TitleCompleteDate, DepartmentalCompleteText, DepartmentalCompleteDate, TitleClearedText, TitleClearedDate, TitleBillUpdateText, TitleBillUpdateDate, DocumentRecordedText, DocumentRecordedDate, FinalPolicyIssuedText, FinalPolicyIssuedDate, MileStoneTrackerList) {
        if (OrderNo === void 0) { OrderNo = null; }
        if (OrderStatus === void 0) { OrderStatus = null; }
        if (ProductCode === void 0) { ProductCode = ""; }
        if (OpenedText === void 0) { OpenedText = "Opened"; }
        if (OpenedDate === void 0) { OpenedDate = null; }
        if (TitleCompleteText === void 0) { TitleCompleteText = "Title Complete"; }
        if (TitleCompleteDate === void 0) { TitleCompleteDate = null; }
        if (DepartmentalCompleteText === void 0) { DepartmentalCompleteText = "Departmental Complete"; }
        if (DepartmentalCompleteDate === void 0) { DepartmentalCompleteDate = null; }
        if (TitleClearedText === void 0) { TitleClearedText = "Title Cleared"; }
        if (TitleClearedDate === void 0) { TitleClearedDate = null; }
        if (TitleBillUpdateText === void 0) { TitleBillUpdateText = "Title Bill Update"; }
        if (TitleBillUpdateDate === void 0) { TitleBillUpdateDate = null; }
        if (DocumentRecordedText === void 0) { DocumentRecordedText = "Document Recorded"; }
        if (DocumentRecordedDate === void 0) { DocumentRecordedDate = null; }
        if (FinalPolicyIssuedText === void 0) { FinalPolicyIssuedText = "Final Policy Issued"; }
        if (FinalPolicyIssuedDate === void 0) { FinalPolicyIssuedDate = null; }
        if (MileStoneTrackerList === void 0) { MileStoneTrackerList = new Array(); }
        this.OrderNo = OrderNo;
        this.OrderStatus = OrderStatus;
        this.ProductCode = ProductCode;
        this.OpenedText = OpenedText;
        this.OpenedDate = OpenedDate;
        this.TitleCompleteText = TitleCompleteText;
        this.TitleCompleteDate = TitleCompleteDate;
        this.DepartmentalCompleteText = DepartmentalCompleteText;
        this.DepartmentalCompleteDate = DepartmentalCompleteDate;
        this.TitleClearedText = TitleClearedText;
        this.TitleClearedDate = TitleClearedDate;
        this.TitleBillUpdateText = TitleBillUpdateText;
        this.TitleBillUpdateDate = TitleBillUpdateDate;
        this.DocumentRecordedText = DocumentRecordedText;
        this.DocumentRecordedDate = DocumentRecordedDate;
        this.FinalPolicyIssuedText = FinalPolicyIssuedText;
        this.FinalPolicyIssuedDate = FinalPolicyIssuedDate;
        this.MileStoneTrackerList = MileStoneTrackerList;
    }
    return MilestoneTracker;
}());
exports.MilestoneTracker = MilestoneTracker;
//# sourceMappingURL=milestone-tracker.component.js.map