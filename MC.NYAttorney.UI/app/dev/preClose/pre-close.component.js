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
var grid_component_1 = require('../grid/grid.component');
var state_component_1 = require('../DropDowns/state/state.component');
var city_component_1 = require('../DropDowns/city/city.component');
var county_component_1 = require('../DropDowns/county/county.component');
var city_service_1 = require('../DropDowns/city/city.service');
var utility_1 = require('../common/utility');
var pre_close_service_1 = require('./pre-close.service');
var pre_close_model_1 = require('./pre-close.model');
var left_navigation_component_1 = require('../common/left-navigation.component');
var header_detail_component_1 = require('../common/header-detail.component');
var enumerations_1 = require("../common/enumerations");
var account_profile_service_1 = require('../accountProfile/account-profile.service');
var tree_view_component_1 = require("../treeView/tree-view.component");
var order_document_model_1 = require('../orderDocument/order-document.model');
var tree_node_model_1 = require('../treeView/tree-node.model');
var order_document_service_1 = require('../orderDocument/order-document.service');
var pdf_viewer_component_1 = require('../pdfViewer/pdf-viewer.component');
var customLocalStorage_1 = require('../common/customLocalStorage');
var logging_1 = require('../common/logging');
var PreCloseComponent = (function () {
    function PreCloseComponent(_appConfig, _referenceData, _router, _routeParams, _service, _docservice, _accountProfileService, _logservice) {
        this.active = true;
        this.utility = new utility_1.Utility();
        this.model = new pre_close_model_1.PreClose();
        this.treeViewList = new tree_node_model_1.TreeNodeModel(0, '', false, '');
        this.islocked = false;
        this.isDirSelected = true;
        this.SelectedViewEnum = 0;
        this.visibleMergeAllIcon = false;
        this.screenName = "PreClose";
        this.appConfig = _appConfig;
        this.referenceDataService = _referenceData;
        this.router = _router;
        this.routeParams = _routeParams;
        this.httpService = _service;
        this.clientTab = enumerations_1.enmTabs.PreClose;
        this.documentService = _docservice;
        this.accountProfileService = _accountProfileService;
        this.logService = _logservice;
    }
    PreCloseComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.child.showLoader();
        if (this.utility.getClientId() !== null) {
            this.orderNo = +this.routeParams.get("orderno");
            this.model.OrderNo = this.orderNo;
            this.rowIds = [];
            this.getSignatureRequirement();
            this.getPreCloseDetails();
            this.getPreCloseDocuments();
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
    PreCloseComponent.prototype.loadRolesAndPermissions = function (data) {
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
    PreCloseComponent.prototype.getCurrentUserID = function () {
        var contactId = this.utility.getContactId();
        if (contactId !== null)
            return contactId;
        return null;
    };
    PreCloseComponent.prototype.getClientID = function () {
        var clientId = this.utility.getClientId();
        if (clientId !== null) {
            return clientId;
        }
        return null;
    };
    PreCloseComponent.prototype.getSignatureRequirement = function () {
        var _this = this;
        this.httpService.getSignatureRequirement(this.model.OrderNo)
            .subscribe(function (data) { return _this.loadSignatureRequirement(data); }, function (error) { return _this.logService.log(error + ": error in Signature Requirement call"); }, function () { return _this.logService.log("Signature Requirement loaded Successfully!"); });
    };
    PreCloseComponent.prototype.loadSignatureRequirement = function (data) {
        this.model.SignatureRequirementList = data;
        if (data.length > 0) {
            this.model.SignatureRequirements = data[0];
        }
    };
    PreCloseComponent.prototype.getPreCloseDetails = function () {
        var _this = this;
        this.httpService.getPreCloseDetails(this.model.OrderNo)
            .subscribe(function (data) { return _this.loadPreCloseDetails(data); }, function (error) { return _this.logService.log(error + ": error in Pre Close Details call"); }, function () { return _this.logService.log("Pre Close Details loaded Successfully!"); });
    };
    PreCloseComponent.prototype.loadPreCloseDetails = function (data) {
        this.model.PreCloseDetailList = data;
        if (data.length > 0) {
            this.model.Status = data[0].Status;
            this.model.ScheduledCloseDate = this.utility.getDate(data[0].ScheduledCloseDate, "YYYY-MM-DD");
            this.model.CloserName = data[0].CloserName;
        }
    };
    PreCloseComponent.prototype.getPreCloseDocuments = function () {
        var _this = this;
        this.httpService.getPreCloseDocuments(this.model.OrderNo)
            .subscribe(function (data) { return _this.loadPreCloseDocuments(data); }, function (error) { return _this.logService.log(error + ": error in Pre Close Documents call"); }, function () { return _this.logService.log("Pre Close Documents loaded Successfully!"); });
    };
    PreCloseComponent.prototype.loadPreCloseDocuments = function (data) {
        this.model.PreCloseDocumentList = data;
        this.treeViewList = this.formatData(data);
        if (data.length > 0)
            this.visibleMergeAllIcon = true;
        else
            this.visibleMergeAllIcon = false;
        this.child.hideLoader();
    };
    PreCloseComponent.prototype.formatData = function (data) {
        var dictionary = {};
        var temp = new tree_node_model_1.TreeNodeModel(-1, "", false, "");
        var main = new tree_node_model_1.TreeNodeModel(1, "Main", false, "");
        main.expanded = true;
        var childs = new Array();
        var docList = new Array();
        for (var counter = 0; counter < data.length; counter++) {
            var doc = new order_document_model_1.DocumentModel();
            doc.BorrowerViewable = data[counter].BorrowerViewable;
            doc.BranchID = data[counter].BranchID;
            doc.ClientViewable = data[counter].ClientViewable;
            doc.Description = data[counter].Description;
            doc.DisbursementID = data[counter].DisbursementID;
            doc.DocDescription = data[counter].DocDescription;
            doc.DocPath = data[counter].DocPath;
            doc.DocSource = data[counter].DocSource;
            doc.DocType = data[counter].DocType;
            doc.DocTypeID = data[counter].DocTypeId;
            doc.DocumentFolder = data[counter].DocumentFolder;
            doc.EnteredDate = data[counter].EnteredDate;
            doc.EventId = data[counter].EventId;
            doc.FullDescription = data[counter].FullDescription;
            doc.ID1 = data[counter].ID1;
            doc.ID2 = data[counter].ID2;
            doc.IsLocked = data[counter].IsLocked;
            doc.Ordered = data[counter].Ordered;
            doc.ProductCategory = data[counter].ProductCategory;
            doc.RawDescription = data[counter].RawDescription;
            doc.RowId = data[counter].RowId;
            this.rowIds.push(data[counter].RowId);
            doc.uidDisbursement = data[counter].uidDisbursement;
            doc.uidHUDLine = data[counter].uidHUDLine;
            doc.VendorViewable = data[counter].VendorViewable;
            doc.UploadfromWeb = data[counter].UploadfromWeb;
            doc.UploadBy = data[counter].UploadBy;
            docList.push(doc);
            var ch = new tree_node_model_1.TreeNodeModel(0, '', true, '');
            ch.Description = doc.Description;
            if (doc.RawDescription !== null) {
                ch.nodeName = doc.RawDescription;
            }
            else {
                ch.nodeName = doc.DocDescription;
            }
            //ch.nodeName = doc.Description;
            ch.nodeId = doc.RowId;
            ch.isLeaf = true;
            ch.ID2 = doc.ID2;
            ch.DocTypeID = doc.DocTypeID;
            ch.RowId = doc.RowId;
            ch.DocumentFolder = doc.DocumentFolder;
            ch.islocked = doc.IsLocked;
            ch.FilePath = doc.DocPath;
            ch.UploadfromWeb = doc.UploadfromWeb;
            ch.DocDescription = doc.DocDescription;
            if (doc.DocumentFolder !== null || doc.DocumentFolder !== "") {
                if (dictionary[doc.DocumentFolder])
                    dictionary[doc.DocumentFolder].push(ch);
                else {
                    dictionary[doc.DocumentFolder] = [];
                    dictionary[doc.DocumentFolder].push(ch);
                }
            }
        }
        var subtree = new Array();
        main.childNodes = new Array();
        for (var propt in dictionary) {
            var doc = new order_document_model_1.DocumentModel();
            var ch = new tree_node_model_1.TreeNodeModel(0, '', false, '');
            ch.childNodes = (dictionary[propt]);
            ch.nodeName = propt;
            ch.nodeId = (dictionary[propt])[0].RowId;
            main.childNodes.push(ch);
        }
        temp.childNodes = new Array(); //
        temp.childNodes.push(main);
        return temp;
    };
    PreCloseComponent.prototype.nodeSelection_Clicked = function (object) {
        var _this = this;
        this.removeSelection(this.treeViewList);
        this.islocked = object.islocked;
        if (object.islocked)
            return;
        object.isClicked = false;
        this.nodeSelected = object;
        if (this.SelectedViewEnum !== 3) {
            if (object.childNodes == null || (object.childNodes !== null && object.childNodes.length == 0)) {
                this.isDirSelected = false;
                object.FilePath = object.FilePath.trim();
                this.documentService.GetDocPath(object.RowId)
                    .subscribe(function (data) {
                    if (_this.nodeSelected.FilePath.substr(object.FilePath.length - 4) == '.pdf') {
                        _this.SelectedViewEnum = 1;
                    }
                    var node = _this.nodeSelected;
                    node.FilePath = data;
                    _this.nodeSelected = node;
                }, function (error) { }, function () { });
            }
            else {
                this.isDirSelected = true;
                this.SelectedViewEnum = 0;
            }
        }
        object.isClicked = true;
    };
    PreCloseComponent.prototype.removeSelection = function (dir) {
        var _this = this;
        if (dir !== null && dir.childNodes !== null) {
            dir.childNodes.forEach(function (d) {
                d.isClicked = false;
                _this.removeSelection(d);
            });
        }
    };
    PreCloseComponent.prototype.docMerge_Click = function () {
        var _this = this;
        if (this.rowIds.length >= 2) {
            this.nodeSelected = new tree_node_model_1.TreeNodeModel(0, '', false, '');
            this.child.showLoader();
            this.documentService.mergeTitleDocument(this.rowIds)
                .subscribe(function (data) {
                _this.SelectedViewEnum = 1;
                _this.nodeSelected.FilePath = data;
                _this.child.hideLoader();
                jQuery("#download").attr("href", data);
                document.getElementById('download').click();
            }, function (error) {
                _this.SelectedViewEnum = 0;
                _this.child.hideLoader();
                _this.child.showErrorNotification('Documents could not be downloaded successfully', 'Failure');
            }, function () { });
        }
        else {
            this.child.showErrorNotification('Please select minimum two documents.', 'Failure');
        }
    };
    PreCloseComponent.prototype.onSave = function () {
        var _this = this;
        this.child.showLoader();
        this.model.UserName = this.getCurrentUserID();
        this.model.Client = this.getClientID();
        this.model.AnticipatedCloseDate = this.model.ScheduledCloseDate;
        this.model.AnticipatedCloseBy = this.model.CloserName;
        this.httpService.savePreClose(this.model)
            .subscribe(function (data) { return _this.saveHandler(data); }, function (error) {
            _this.child.showSaveErrorNotification();
            _this.child.hideLoader();
        }, function () { return _this.logService.log("API Call Finished Successfully!"); });
        this.successMessageDisplay = true;
    };
    PreCloseComponent.prototype.saveHandler = function (data) {
        this.child.hideLoader();
        if (data < 0)
            this.child.showErrorNotification('Pre Close Detail save failed', 'Error!');
        else {
            this.child.showSuccessNotification('Pre Close Detail saved successfully', 'Success!');
        }
    };
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], PreCloseComponent.prototype, "child", void 0);
    PreCloseComponent = __decorate([
        core_1.Component({
            selector: 'pre-close',
            templateUrl: '../dev/tpl/pre-close.html',
            inputs: ['state'],
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, notifications_component_1.NotificationsComponent, grid_component_1.GridComponent, state_component_1.StateComponent, city_component_1.CityComponent, county_component_1.CountyComponent,
                left_navigation_component_1.LeftNavigationComponent,
                header_detail_component_1.HeaderDetailComponent,
                tree_view_component_1.DirectoryViewComponent,
                pdf_viewer_component_1.PdfViewerComponent
            ],
            providers: [core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }), reference_data_service_1.ReferenceDataService,
                city_service_1.CityService,
                pre_close_service_1.PreCloseService,
                order_document_service_1.DocumentService,
                account_profile_service_1.AccountProfileService,
                logging_1.LoggingService
            ]
        }),
        __param(0, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(1, core_1.Inject(reference_data_service_1.ReferenceDataService)),
        __param(2, core_1.Inject(router_deprecated_1.Router)),
        __param(3, core_1.Inject(router_deprecated_1.RouteParams)),
        __param(4, core_1.Inject(pre_close_service_1.PreCloseService)),
        __param(5, core_1.Inject(order_document_service_1.DocumentService)),
        __param(6, core_1.Inject(account_profile_service_1.AccountProfileService)),
        __param(7, core_1.Inject(logging_1.LoggingService))
    ], PreCloseComponent);
    return PreCloseComponent;
}());
exports.PreCloseComponent = PreCloseComponent;
//# sourceMappingURL=pre-close.component.js.map