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
var enumerations_1 = require("../common/enumerations");
var logging_1 = require('../common/logging');
var forms_1 = require('@angular/forms');
var notifications_component_1 = require('../notifications/notifications.component');
var left_navigation_component_1 = require('../common/left-navigation.component');
var header_detail_component_1 = require('../common/header-detail.component');
var reference_data_service_1 = require('../referenceData/reference-data.service');
var order_title_model_1 = require('./order-title.model');
var order_title_service_1 = require('./order-title.service');
var pdf_viewer_component_1 = require('../pdfViewer/pdf-viewer.component');
var tree_view_component_1 = require("../treeView/tree-view.component");
var tree_node_model_1 = require('../treeView/tree-node.model');
var order_document_model_1 = require('../orderDocument/order-document.model');
var order_document_service_1 = require('../orderDocument/order-document.service');
var account_profile_service_1 = require('../accountProfile/account-profile.service');
var utility_1 = require('../common/utility');
var customLocalStorage_1 = require('../common/customLocalStorage');
core_1.enableProdMode();
var OrderTitleComponent = (function () {
    function OrderTitleComponent(_appConfig, _router, _refService, _orderDetailService, _docService, _routeParams, _accountProfileService, _logservice) {
        this.model = new order_title_model_1.OrderTitleDetails();
        this.treeViewList = new tree_node_model_1.TreeNodeModel(0, '', false, '');
        this.SelectedViewEnum = 0;
        this.loggedUser = "";
        this.documentModel = new order_document_model_1.DocumentModel();
        this.visibleMergeAllIcon = false;
        this.screenName = "OrderTitle";
        this.utility = new utility_1.Utility();
        this.islocked = false;
        this.routeParams = _routeParams;
        this.appConfig = _appConfig;
        this._refernceService = _refService;
        this.clientTab = enumerations_1.enmTabs.OrderTitle;
        this._service = _orderDetailService;
        this.documentService = _docService;
        this.accountProfileService = _accountProfileService;
        this.logService = _logservice;
    }
    OrderTitleComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.validateOrder();
        this.rowIds = [];
        if (JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName)) == null)
            this.accountProfileService.getPermissionsAgainstRole(this.screenName)
                .subscribe(function (data) {
                customLocalStorage_1.CustomLocalStorage.setItem(_this.screenName, JSON.stringify(data));
                _this.loadRolesAndPermissions(data);
            }, function (error) { return _this.logService.log(error); });
        else
            this.loadRolesAndPermissions(JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName)));
    };
    OrderTitleComponent.prototype.validateOrder = function () {
        var orderNo = +this.routeParams.get("orderno");
        this.orderId = orderNo;
        this.getTitleOrderDetail();
        this.loadDocuments(this.orderId);
    };
    OrderTitleComponent.prototype.loadDocuments = function (orderNo) {
        var _this = this;
        //this.child.showLoader();
        this._service.GetDocuments(orderNo)
            .subscribe(function (data) { return _this.setDocumentList(data); }, function (error) {
            //this.child.hideLoader();
            _this.visibleMergeAllIcon = false;
        });
    };
    OrderTitleComponent.prototype.loadRolesAndPermissions = function (data) {
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
    OrderTitleComponent.prototype.setDocumentList = function (data) {
        //this.child.hideLoader();
        this.treeViewList = this.formatData(data);
        if (data.length > 0)
            this.visibleMergeAllIcon = true;
        else
            this.visibleMergeAllIcon = false;
    };
    OrderTitleComponent.prototype.formatEmails = function (emails) {
        if (emails !== "undefined" && emails !== null && emails !== '')
            return jQuery("#emails").html(emails);
    };
    OrderTitleComponent.prototype.formatData = function (data) {
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
        temp.childNodes = new Array();
        temp.childNodes.push(main);
        return temp;
    };
    OrderTitleComponent.prototype.removeSelection = function (dir) {
        var _this = this;
        if (dir !== null && dir.childNodes !== null) {
            dir.childNodes.forEach(function (d) {
                d.isClicked = false;
                _this.removeSelection(d);
            });
        }
    };
    OrderTitleComponent.prototype.nodeSelection_Clicked = function (object) {
        var _this = this;
        this.removeSelection(this.treeViewList);
        this.islocked = object.islocked;
        object.isClicked = false;
        this.nodeSelected = object;
        if (object.RowId == 0 && object.DocumentFolder.toLowerCase().indexOf("lien") > -1) {
            this.SelectedViewEnum = 1;
            var node = this.nodeSelected;
            node.FilePath = object.FilePath;
            this.nodeSelected = node;
        }
        else {
            if (object.childNodes == null || (object.childNodes !== null && object.childNodes.length == 0)) {
                object.FilePath = object.FilePath.trim();
                this.child.showLoader();
                this.documentService.GetDocPath(object.RowId)
                    .subscribe(function (data) {
                    _this.child.hideLoader();
                    if (_this.nodeSelected.FilePath.substr(object.FilePath.length - 4) == '.pdf') {
                        _this.SelectedViewEnum = 1;
                    }
                    var node = _this.nodeSelected;
                    node.FilePath = data;
                    _this.nodeSelected = node;
                }, function (error) {
                    _this.child.hideLoader();
                    _this.child.showErrorNotification("File Not Found", "Error !");
                    _this.logService.log(error);
                });
            }
        }
        object.isClicked = true;
    };
    OrderTitleComponent.prototype.getTitleOrderDetail = function () {
        var _this = this;
        this._service.GetOrderTitleDetail(this.orderId)
            .subscribe(function (data) { return _this.setTitleOrderData(data); }, function (error) { return _this.logService.log(error + ": error in getTitleOrderDetail call"); }, function () { return _this.logService.log("getTitleOrderDetail Successfully!"); });
    };
    OrderTitleComponent.prototype.addTitleBillRequestEvent = function () {
        var _this = this;
        if (this.model.IsTitleBillRequestCompleteOrCancel > 0) {
            this.child.showErrorNotification('Title Bill is already requested and in progress', 'Error!');
        }
        else {
            this.child.showLoader();
            this._service.AddTitleBillReqEvent(this.orderId)
                .subscribe(function (data) { return _this.addBillRequestHandler(data); }, function (error) {
                _this.child.hideLoader();
                _this.child.showSaveErrorNotification();
            }, function () { return _this.logService.log("API Call Finished Successfully!"); });
        }
    };
    OrderTitleComponent.prototype.addTitleProduct = function () {
        var _this = this;
        this.child.showLoader();
        this._service.CPAddTitleProduct(this.orderId)
            .subscribe(function (data) { return _this.addTitleProductHandler(data); }, function (error) {
            _this.child.hideLoader();
            _this.child.showSaveErrorNotification();
        }, function () { return _this.logService.log("API Call Finished Successfully!"); });
    };
    OrderTitleComponent.prototype.addTitleProductHandler = function (data) {
        this.child.hideLoader();
        if (!data)
            this.child.showErrorNotification('Error while adding product', 'Error!');
        else {
            this.child.showSuccessNotification("Update Product Added.", "Success !");
        }
    };
    OrderTitleComponent.prototype.addBillRequestHandler = function (data) {
        this.child.hideLoader();
        if (!data)
            this.child.showErrorNotification('Error while adding Title Bill Request Event', 'Error!');
        else {
            this.child.showSuccessNotification("Title Bill Requested.", "Success !");
            this.getTitleOrderDetail();
        }
    };
    OrderTitleComponent.prototype.setTitleOrderData = function (data) {
        this.logService.log(data);
        this.model = data[0];
    };
    OrderTitleComponent.prototype.docMerge_Click = function () {
        var _this = this;
        if (this.rowIds.length >= 2) {
            this.nodeSelected = new tree_node_model_1.TreeNodeModel(0, '', false, '');
            this.child.showLoader();
            this.documentService.mergeTitleDocument(this.rowIds)
                .subscribe(function (data) {
                _this.SelectedViewEnum = 1;
                _this.nodeSelected.FilePath = data;
                _this.child.hideLoader();
                _this.child.showSuccessNotification('Document has been merged successfully', 'Success');
                jQuery("#download").attr("href", data);
                document.getElementById('download').click();
            }, function (error) {
                _this.SelectedViewEnum = 0;
                _this.child.hideLoader();
                _this.child.showErrorNotification('Documents could not be merged successfully', 'Failure');
            }, function () { });
        }
        else {
            this.child.showErrorNotification('Please select minimum two documents.', 'Failure');
        }
    };
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], OrderTitleComponent.prototype, "child", void 0);
    OrderTitleComponent = __decorate([
        core_1.Component({
            selector: 'order-title',
            templateUrl: '../../dev/tpl/order-title.html',
            directives: [forms_1.NgForm, notifications_component_1.NotificationsComponent, left_navigation_component_1.LeftNavigationComponent, pdf_viewer_component_1.PdfViewerComponent, header_detail_component_1.HeaderDetailComponent, tree_view_component_1.DirectoryViewComponent, pdf_viewer_component_1.PdfViewerComponent],
            providers: [reference_data_service_1.ReferenceDataService, order_title_service_1.OrderTitleService, order_document_service_1.DocumentService, account_profile_service_1.AccountProfileService, logging_1.LoggingService,
                core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG })]
        }),
        __param(0, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(1, core_1.Inject(router_deprecated_1.Router)),
        __param(2, core_1.Inject(reference_data_service_1.ReferenceDataService)),
        __param(3, core_1.Inject(order_title_service_1.OrderTitleService)),
        __param(4, core_1.Inject(order_document_service_1.DocumentService)),
        __param(5, core_1.Inject(router_deprecated_1.RouteParams)),
        __param(6, core_1.Inject(account_profile_service_1.AccountProfileService)),
        __param(7, core_1.Inject(logging_1.LoggingService))
    ], OrderTitleComponent);
    return OrderTitleComponent;
}());
exports.OrderTitleComponent = OrderTitleComponent;
//# sourceMappingURL=order-title.component.js.map