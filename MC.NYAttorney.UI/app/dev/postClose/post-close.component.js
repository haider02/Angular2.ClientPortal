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
var utility_1 = require('../common/utility');
var account_profile_service_1 = require('../accountProfile/account-profile.service');
var post_close_service_1 = require('./post-close.service');
var post_close_model_1 = require('./post-close.model');
var left_navigation_component_1 = require('../common/left-navigation.component');
var header_detail_component_1 = require('../common/header-detail.component');
var enumerations_1 = require("../common/enumerations");
var tree_view_component_1 = require("../treeView/tree-view.component");
var order_document_model_1 = require('../orderDocument/order-document.model');
var tree_node_model_1 = require('../treeView/tree-node.model');
var order_document_service_1 = require('../orderDocument/order-document.service');
var pdf_viewer_component_1 = require('../pdfViewer/pdf-viewer.component');
var customLocalStorage_1 = require('../common/customLocalStorage');
var logging_1 = require('../common/logging');
var PostCloseComponent = (function () {
    function PostCloseComponent(_appConfig, _referenceData, _router, _routeParams, _service, _docservice, _accountProfileService, _logservice) {
        this.active = true;
        this.utility = new utility_1.Utility();
        this.model = new post_close_model_1.PostClose();
        this.treeViewList = new tree_node_model_1.TreeNodeModel(0, '', false, '');
        this.islocked = false;
        this.isDirSelected = true;
        this.SelectedViewEnum = 0;
        this.visibleMergeAllIcon = false;
        this.screenName = "PostClose";
        this.appConfig = _appConfig;
        this.referenceDataService = _referenceData;
        this.router = _router;
        this.routeParams = _routeParams;
        this.httpService = _service;
        this.clientTab = enumerations_1.enmTabs.PostClose;
        this.documentService = _docservice;
        this.accountProfileService = _accountProfileService;
        this.logService = _logservice;
    }
    PostCloseComponent.prototype.ngOnInit = function () {
        this.routetoLogin();
    };
    PostCloseComponent.prototype.ngOnChanges = function () {
    };
    PostCloseComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.child.showLoader();
        if (this.utility.getClientId() !== null) {
            this.orderNo = +this.routeParams.get("orderno");
            this.model.OrderNo = this.orderNo;
            this.rowIds = [];
            this.getRecordingDetails();
            this.getLoanPolicyDetails();
            this.getPostCloseDocuments();
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
    PostCloseComponent.prototype.loadRolesAndPermissions = function (data) {
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
        this.recordingDetailGridColumns = this.getRecordingDetailGridColumns();
        var obj = JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName));
        for (var index in obj) {
            if (obj[index]["Parent"] == "PostCloseRecordingDetail") {
                if (!obj[index]["IsVisible"])
                    this.findAndRemove(this.recordingDetailGridColumns, "name", obj[index]["CtrlName"]);
            }
        }
    };
    PostCloseComponent.prototype.findAndRemove = function (array, property, value) {
        array.forEach(function (result, index) {
            if (result[property] === value) {
                //Remove from array
                array.splice(index, 1);
            }
        });
    };
    PostCloseComponent.prototype.getCurrentDateTime = function () {
        return moment().format('MM/DD/YYYY');
    };
    PostCloseComponent.prototype.getDate = function (date) {
        if (date == null)
            return null;
        return moment(date).format("MM/DD/YYYY");
    };
    PostCloseComponent.prototype.getDateTime = function (dateTime) {
        if (dateTime == null)
            return null;
        return moment(dateTime).format("MM/DD/YYYY  HH:mm A");
    };
    PostCloseComponent.prototype.routetoLogin = function () {
        if (customLocalStorage_1.CustomLocalStorage.getItem("user_ContactId") == null || customLocalStorage_1.CustomLocalStorage.getItem("id_token") == null || customLocalStorage_1.CustomLocalStorage.getItem("refresh_token") == null) {
            this.router.navigate(['Login']);
        }
    };
    PostCloseComponent.prototype.getRecordingDetails = function () {
        var _this = this;
        this.httpService.getRecordingDetails(this.model.OrderNo)
            .subscribe(function (data) { return _this.loadRecordingDetails(data); }, function (error) { return _this.logService.log(error + ": error in Recording Detail call"); }, function () { return _this.logService.log("Recording Detail loaded Successfully!"); });
    };
    PostCloseComponent.prototype.loadRecordingDetails = function (data) {
        this.model.RecordingDetailList = data;
    };
    PostCloseComponent.prototype.getLoanPolicyDetails = function () {
        var _this = this;
        this.httpService.getLoanPolicyDetails(this.model.OrderNo)
            .subscribe(function (data) { return _this.loadLoanPolicyDetails(data); }, function (error) { return _this.logService.log(error + ": error in Loan Policy Details call"); }, function () { return _this.logService.log("Loan Policy Details loaded Successfully!"); });
    };
    PostCloseComponent.prototype.loadLoanPolicyDetails = function (data) {
        this.model.LoanPolicyList = data;
        if (data.length > 0) {
            this.model.LoanPolicyIssueDate = this.getDate(data[0].EffectiveDate);
            this.model.PolicyNumber = data[0].LoanPolicyNo;
        }
    };
    PostCloseComponent.prototype.getPostCloseDocuments = function () {
        var _this = this;
        this.httpService.getPostCloseDocuments(this.model.OrderNo)
            .subscribe(function (data) { return _this.loadPostCloseDocuments(data); }, function (error) { return _this.logService.log(error + ": error in Post Close Documents call"); }, function () { return _this.logService.log("Post Close Documents loaded Successfully!"); });
    };
    PostCloseComponent.prototype.loadPostCloseDocuments = function (data) {
        this.model.PostCloseDocumentList = data;
        this.treeViewList = this.formatData(data);
        if (data.length > 0)
            this.visibleMergeAllIcon = true;
        else
            this.visibleMergeAllIcon = false;
        this.child.hideLoader();
    };
    PostCloseComponent.prototype.getRecordingDetailGridColumns = function () {
        return [
            new column_1.Column('DocumentType', 'Document Type'),
            new column_1.Column('Status', 'Status'),
            new column_1.Column('RecordingDetails', 'Recording Details')
        ];
    };
    PostCloseComponent.prototype.formatData = function (data) {
        var dictionary = {};
        var temp = new tree_node_model_1.TreeNodeModel(-1, "", false, "");
        var main = new tree_node_model_1.TreeNodeModel(1, "Post Close Documents", false, "");
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
            doc.DocumentFolder = data[counter].DocumentType;
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
    PostCloseComponent.prototype.nodeSelection_Clicked = function (object) {
        var _this = this;
        this.removeSelection(this.treeViewList);
        this.islocked = object.islocked;
        if (object.islocked)
            return;
        //this.isEditMode = false;
        object.isClicked = false;
        //this.nodeSelected = object;
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
    PostCloseComponent.prototype.removeSelection = function (dir) {
        var _this = this;
        if (dir !== null && dir.childNodes !== null) {
            dir.childNodes.forEach(function (d) {
                d.isClicked = false;
                _this.removeSelection(d);
            });
        }
    };
    PostCloseComponent.prototype.docMerge_Click = function () {
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
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], PostCloseComponent.prototype, "child", void 0);
    PostCloseComponent = __decorate([
        core_1.Component({
            selector: 'post-close',
            templateUrl: '../dev/tpl/post-close.html',
            inputs: ['state'],
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, notifications_component_1.NotificationsComponent, grid_component_1.GridComponent, state_component_1.StateComponent, city_component_1.CityComponent, county_component_1.CountyComponent,
                left_navigation_component_1.LeftNavigationComponent,
                header_detail_component_1.HeaderDetailComponent,
                tree_view_component_1.DirectoryViewComponent,
                pdf_viewer_component_1.PdfViewerComponent
            ],
            providers: [core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }), reference_data_service_1.ReferenceDataService,
                city_service_1.CityService,
                post_close_service_1.PostCloseService,
                order_document_service_1.DocumentService,
                account_profile_service_1.AccountProfileService,
                logging_1.LoggingService
            ]
        }),
        __param(0, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(1, core_1.Inject(reference_data_service_1.ReferenceDataService)),
        __param(2, core_1.Inject(router_deprecated_1.Router)),
        __param(3, core_1.Inject(router_deprecated_1.RouteParams)),
        __param(4, core_1.Inject(post_close_service_1.PostCloseService)),
        __param(5, core_1.Inject(order_document_service_1.DocumentService)),
        __param(6, core_1.Inject(account_profile_service_1.AccountProfileService)),
        __param(7, core_1.Inject(logging_1.LoggingService))
    ], PostCloseComponent);
    return PostCloseComponent;
}());
exports.PostCloseComponent = PostCloseComponent;
//# sourceMappingURL=post-close.component.js.map