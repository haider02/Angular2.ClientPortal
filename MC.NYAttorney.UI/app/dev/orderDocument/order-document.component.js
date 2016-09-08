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
//import {HTTP_PROVIDERS}    from '@angular/http';
var router_deprecated_1 = require('@angular/router-deprecated');
//
var order_document_service_1 = require('./order-document.service');
var reference_data_service_1 = require('../referenceData/reference-data.service');
var pdf_viewer_component_1 = require('../pdfViewer/pdf-viewer.component');
var tree_view_component_1 = require("../treeView/tree-view.component");
var order_document_model_1 = require('./order-document.model');
var tree_node_model_1 = require('../treeView/tree-node.model');
var logging_1 = require('../common/logging');
var app_config_1 = require('../app-config');
var enumerations_1 = require("../common/enumerations");
var notifications_component_1 = require('../notifications/notifications.component');
var multi_select_component_1 = require('../multiSelect/multi-select.component');
var left_navigation_component_1 = require('../common/left-navigation.component');
var header_detail_component_1 = require('../common/header-detail.component');
var utility_1 = require('../common/utility');
var account_profile_service_1 = require('../accountProfile/account-profile.service');
var customLocalStorage_1 = require('../common/customLocalStorage');
var OrderDocumentComponent = (function () {
    /** --Constructor--
    *   _service: Service object injection
    *   _appConfig: Config object injection
    **/
    function OrderDocumentComponent(_service, _appConfig, _referenceDataService, _accountProfileService, _routeParams, _router, _logservice) {
        var _this = this;
        this.isDirSelected = true;
        this.isEditMode = false;
        this.isDeleteClicked = false;
        this.isLockClicked = false;
        this.isUnlockClicked = false;
        this.isMergeClicked = false;
        this.SelectedViewEnum = 0;
        this.isCheckboxEnabled = 0;
        this.treeViewList = new tree_node_model_1.TreeNodeModel(0, '', false, '');
        this.temp = {};
        this.ProductList = [];
        this.documentType = [];
        this.productList = [];
        this.folderTypeList = [{ TypeId: -1, TypeName: "" }, { TypeId: 2, TypeName: "Other" }];
        this.docTypesList = [{ TypeId: -1, TypeName: "" }, { TypeId: 2, TypeName: "Other" }];
        this.documentModel = new order_document_model_1.DocumentModel();
        this.selectedNodes = new Array();
        this.selectedDocNodes = new Array();
        this.isUploadedFromWeb = false;
        this.fromEmail = "Please Select";
        this.sentToCSV = '';
        this.emailModel = new EmailModel();
        this.sentToInternalList = [];
        this.contactList = [];
        this.sentToList = [];
        this.fromList = new Array();
        this.utility = new utility_1.Utility();
        this.screenName = "OrderDocument";
        this.viewDeleteButton = true;
        this.visibleMergeAllIcon = false;
        /**
        *   nodeSelection_Clicked, emited my child component/on tree node selection
        **/
        this.islocked = false;
        this.appConfig = _appConfig;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/Document";
        this.logService = _logservice;
        this.documentService = _service;
        this.routeParams = _routeParams;
        this.referenceDataService = _referenceDataService;
        this.clientTab = enumerations_1.enmTabs.OrderDocuments;
        this.accountProfileService = _accountProfileService;
        this.referenceDataService.getDocumentFolders()
            .subscribe(function (data) { return _this.setDocumentFolders(data); }, function (error) { }, function () { });
        this.referenceDataService.getDocumentTypesSelectAllByProdCat("O")
            .subscribe(function (data) { return _this.setDocumentTypesSelectAllByProdCat(data); }, function (error) { }, function () { });
    }
    OrderDocumentComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.validateorder();
        ApplyMask();
        if (JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName)) == null)
            this.accountProfileService.getPermissionsAgainstRole(this.screenName)
                .subscribe(function (data) {
                customLocalStorage_1.CustomLocalStorage.setItem(_this.screenName, JSON.stringify(data));
                _this.loadRolesAndPermissions(data);
            }, function (error) { return _this.logService.log(error); });
        else
            this.loadRolesAndPermissions(JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName)));
    };
    OrderDocumentComponent.prototype.loadRolesAndPermissions = function (data) {
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
    OrderDocumentComponent.prototype.validateorder = function () {
        var orderno = +this.routeParams.get("orderno");
        if (orderno > 0) {
            this.orderNo = orderno;
            this.loadDocuments(orderno);
            this.getOrderDetail();
        }
    };
    OrderDocumentComponent.prototype.getOrderDetail = function () {
        var _this = this;
        this.documentService.GetOrderDetail(this.orderNo)
            .subscribe(function (data) { return _this.setOrderDetailsItems(data); }, function (error) { _this.logService.log(error); }, function () { });
    };
    /**
    *   product type list set/success handler
    **/
    OrderDocumentComponent.prototype.setOrderDetailsItems = function (data) {
        this.productList = [];
        this.productList = data;
    };
    /**
    *   document type list set/success handler
    **/
    OrderDocumentComponent.prototype.setDocumentFolders = function (data) {
        //if (data && data.length > 0) {
        //    data.splice(0, 0, { RowId: null, cboEntry: 'Please select' });
        //} else {
        //    data.splice(0, 0, { RowId: null, cboEntry: 'Not available' });
        //} 
        this.folderTypeList = data;
    };
    /**
    *   document type list set/success handler
    **/
    OrderDocumentComponent.prototype.setDocumentTypesSelectAllByProdCat = function (data) {
        //if (data && data.length > 0) {
        //    data.splice(0, 0, { RowID: "", Description: 'Please select' });
        //} else {
        //    data.splice(0, 0, { RowID: null, Description: 'Not available' });
        //} 
        this.documentModel.DocTypeID = 0;
        this.docTypesList = data;
    };
    /**
    *   Document list set/success handler
    **/
    OrderDocumentComponent.prototype.setDocumentList = function (data) {
        if (data.length < 1)
            this.viewDeleteButton = false;
        else
            this.viewDeleteButton = true;
        if (data.length > 0)
            this.visibleMergeAllIcon = true;
        else
            this.visibleMergeAllIcon = false;
        this.notificationHelper.hideLoader();
        this.treeViewList = this.formatData(data);
    };
    /**
    *   Constructs data as required tree form
    **/
    OrderDocumentComponent.prototype.formatData = function (data) {
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
            ch.UploadBy = doc.UploadBy;
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
    /**
    *   to get required data, in initilization of component
    **/
    OrderDocumentComponent.prototype.ngOnInit = function () {
    };
    OrderDocumentComponent.prototype.nodeSelection_Clicked = function (object) {
        var _this = this;
        this.removeSelection(this.treeViewList);
        this.islocked = object.islocked;
        if (object.islocked)
            return;
        this.isEditMode = false;
        object.isClicked = false;
        //this.nodeSelected = object;        
        this.nodeSelected = object;
        if (this.SelectedViewEnum !== 3) {
            if (object.childNodes == null || (object.childNodes !== null && object.childNodes.length == 0)) {
                if (this.nodeSelected.UploadBy == this.getCurrentUserID())
                    this.isDirSelected = false;
                else
                    this.isDirSelected = true;
                object.FilePath = object.FilePath.trim();
                this.documentService.GetDocPath(object.RowId)
                    .subscribe(function (data) {
                    if (_this.nodeSelected.FilePath.substr(object.FilePath.length - 4) == '.pdf') {
                        _this.SelectedViewEnum = 5;
                    }
                    else {
                        _this.SelectedViewEnum = 6;
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
    /**
    *   Add documents event,
    **/
    OrderDocumentComponent.prototype.documentAdd_Clicked = function () {
        this.removeTooltip();
        this.isUploadedFromWeb = true;
        this.showCheckBox(this.treeViewList, false);
        this.isEditMode = false;
        this.isDirSelected = true;
        this.SelectedViewEnum = 1;
        this.documentModel = new order_document_model_1.DocumentModel();
    };
    /**
    *   Edit documents event,
    **/
    OrderDocumentComponent.prototype.documentEdit_Clicked = function () {
        this.removeTooltip();
        this.isEditMode = true;
        this.SelectedViewEnum = 1;
        this.documentModel = new order_document_model_1.DocumentModel();
        var tempDoc = new order_document_model_1.DocumentModel();
        //this.documentModel.file = null;
        if (this.nodeSelected.UploadfromWeb)
            this.isUploadedFromWeb = true;
        else
            this.isUploadedFromWeb = false;
        tempDoc.ID2 = this.nodeSelected.ID2;
        tempDoc.DocTypeID = this.nodeSelected.DocTypeID;
        tempDoc.DocumentFolder = this.nodeSelected.DocumentFolder;
        //tempDoc.Description = this.nodeSelected.Description;
        tempDoc.RowId = this.nodeSelected.RowId;
        tempDoc.Description = this.nodeSelected.DocDescription;
        this.documentModel = tempDoc;
        //setTimeout(x=> { this.documentModel.DocTypeID = this.nodeSelected.DocTypeID }, 100); 
    };
    /**
    *   Merge documents event, shows check boxes tree
    **/
    OrderDocumentComponent.prototype.documentMerge_Clicked = function () {
        this.removeTooltip();
        this.showCheckBoxWithUnlockedAndPDF(this.treeViewList, true);
        this.selectedNodes = new Array();
        this.SelectedViewEnum = 3;
        this.isMergeClicked = true;
        this.documentModel = new order_document_model_1.DocumentModel();
        //this.isCheckboxEnabled = 1; 
    };
    OrderDocumentComponent.prototype.getCurrentUserID = function () {
        var contactId = this.utility.getContactId(); //CustomLocalStorage.getItem("user_ContactId");
        if (contactId !== null)
            return contactId;
        //else    
        //   this.router.navigate(['Login']);        
        //return "DevUser";
        return null;
    };
    /**
    *   save order clicked
    **/
    OrderDocumentComponent.prototype.saveorderDocument_Click = function () {
        var _this = this;
        this.removeTooltip();
        this.isDirSelected = true;
        this.documentModel.ID1 = this.orderNo;
        //this.documentModel.EnteredBy = this.orderNo;
        this.documentModel.UploadfromWeb = true;
        this.documentModel.UploadBy = this.getCurrentUserID();
        if (this.isEditMode) {
            this.notificationHelper.showLoader();
            this.documentService.updateDocument(this.documentModel)
                .subscribe(function (data) {
                _this.notificationHelper.showSaveSuccessNotification();
                _this.SuccessHandler(data);
            }, function (error) {
                _this.notificationHelper.hideLoader();
                _this.notificationHelper.showSaveErrorNotification();
            }, function () { });
        }
        else {
            if (this.documentModel.file
                && (this.documentModel.DocumentFolder.toLowerCase() !== "please select" || this.documentModel.DocumentFolder !== "")
                && this.documentModel.Description !== "") {
                this.notificationHelper.showLoader();
                this.saveUploadDocument(this.documentModel);
            }
            else {
                if (this.documentModel.DocumentFolder.toLowerCase() == "please select" || this.documentModel.DocumentFolder == "")
                    alert('Please select folder from dropdown');
                else if (!this.documentModel.file)
                    alert('please select file to upload');
                else if (this.documentModel.Description == "") { }
            }
        }
    };
    OrderDocumentComponent.prototype.SuccessHandler = function (data) {
        this.notificationHelper.hideLoader();
        if (data == -1) {
            //this.displayErrorMsg = true;
            this.notificationHelper.showSaveErrorNotification();
        }
        else {
            //this.displaySuccessMsg = true; 
            this.notificationHelper.showSaveSuccessNotification();
            this.validateorder();
            this.SelectedViewEnum = 0;
        }
    };
    /**
    *   load order documents
    **/
    OrderDocumentComponent.prototype.loadDocuments = function (orderNo) {
        var _this = this;
        this.notificationHelper.showLoader();
        this.documentService.getDocuments(orderNo)
            .subscribe(function (data) { return _this.setDocumentList(data); }, function (error) {
            _this.notificationHelper.hideLoader();
        }, function () { });
    };
    /**
    *   cancel order doc merge clicked
    **/
    OrderDocumentComponent.prototype.canvelorderDocMerge_Click = function () {
        this.removeTooltip();
        this.isMergeClicked = false;
        this.showCheckBox(this.treeViewList, false);
        this.deSelectCheckBox(this.treeViewList, false);
        this.SelectedViewEnum = 0;
    };
    /**
    *   cancel order doc merge clicked
    **/
    OrderDocumentComponent.prototype.saveorderDocMerge_Click = function () {
        var _this = this;
        this.removeTooltip();
        this.documentModel.ID1 = this.orderNo;
        this.documentModel.EnteredBy = JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem("LoggedInUserObject")); //this.appConfig.loggedInUser;
        this.getCheckedDocuments(this.treeViewList);
        if (this.selectedDocNodes.length >= 2) {
            if ((this.documentModel.DocumentFolder.toLowerCase() !== "please select" || this.documentModel.DocumentFolder !== "")
                && this.documentModel.Description !== "") {
                var mergDocModel = { MergeDocuments: this.selectedDocNodes, DocumentDetails: this.documentModel };
                this.documentService.mergeDocument(mergDocModel)
                    .subscribe(function (data) {
                    _this.validateorder();
                    _this.SelectedViewEnum = 0;
                    _this.showCheckBox(_this.treeViewList, false);
                    _this.deSelectCheckBox(_this.treeViewList, false);
                    _this.isMergeClicked = false;
                    _this.notificationHelper.showSuccessNotification('Document has been merged successfully', 'Success');
                }, function (error) {
                    _this.notificationHelper.hideLoader();
                    _this.notificationHelper.showErrorNotification('Documents could not be merged successfully', 'Failure');
                }, function () { });
            }
            else {
                if (this.documentModel.DocumentFolder.toLowerCase() == "please select" || this.documentModel.DocumentFolder == "")
                    alert('Please select folder from dropdown');
                else if (this.documentModel.Description == "") {
                    alert('Please enter description.');
                }
            }
        }
        else {
            this.notificationHelper.showErrorNotification('Please select minimum two documents.', 'Failure');
        }
    };
    /**
    *  show checked box tree for delete
    **/
    OrderDocumentComponent.prototype.showDeleteTree_Clicked = function () {
        this.removeTooltip();
        this.showCheckBoxWithUploadfromWeb(this.treeViewList, false);
        this.isDeleteClicked = true;
        this.SelectedViewEnum = 0;
    };
    /**
    *  reset tree
    **/
    OrderDocumentComponent.prototype.hideDeleteTree_Clicked = function () {
        this.removeTooltip();
        this.showCheckBox(this.treeViewList, false);
        this.deSelectCheckBox(this.treeViewList, false);
        this.isDeleteClicked = false;
        this.SelectedViewEnum = 0;
    };
    /**
    *  delete event
    **/
    OrderDocumentComponent.prototype.documentDel_Clicked = function () {
        var _this = this;
        this.removeTooltip();
        //this.getCheckedDocuments(this.treeViewList);
        this.getCheckedUnLockedDocuments(this.treeViewList);
        if (this.selectedDocNodes.length !== 0) {
            this.isDeleteClicked = false;
            this.isDirSelected = true;
            this.showCheckBox(this.treeViewList, false);
            this.deSelectCheckBox(this.treeViewList, false);
            if (confirm('Do you really want to delete the document?')) {
                this.documentService.deleteDocuments(this.selectedDocNodes)
                    .subscribe(function (data) {
                    _this.notificationHelper.showSuccessNotification('Documents deleted successfuly', 'Success');
                    _this.loadDocuments(_this.orderNo);
                }, function (error) {
                    _this.notificationHelper.hideLoader();
                    _this.notificationHelper.showErrorNotification('Document/s could not delete, please try again', 'Error!');
                }, function () { });
            }
            this.selectedDocNodes = new Array();
            this.SelectedViewEnum = 0;
        }
        else {
            this.notificationHelper.showWarningNotification('Please select document first', 'Warning');
        }
    };
    /**
    *  show checked boxes tree for lock
    **/
    OrderDocumentComponent.prototype.showLockTreeLock_Clicked = function () {
        this.removeTooltip();
        this.showCheckBoxWithUnlocked(this.treeViewList, true);
        this.isLockClicked = true;
        this.SelectedViewEnum = 0;
    };
    /**
    *  reset tree
    **/
    OrderDocumentComponent.prototype.hideLockTree_Clicked = function () {
        this.removeTooltip();
        this.isLockClicked = false;
        this.showCheckBox(this.treeViewList, false);
        this.deSelectCheckBox(this.treeViewList, false);
        this.SelectedViewEnum = 0;
    };
    /**
    *  Lock document tree clicked
    **/
    OrderDocumentComponent.prototype.documentLock_Clicked = function () {
        var _this = this;
        this.removeTooltip();
        this.getCheckedDocuments(this.treeViewList);
        if (this.selectedDocNodes.length !== 0) {
            this.isLockClicked = false;
            this.showCheckBox(this.treeViewList, false);
            this.deSelectCheckBox(this.treeViewList, false);
            this.notificationHelper.showLoader();
            this.documentService.lockDocuments(this.selectedDocNodes, true)
                .subscribe(function (data) {
                _this.notificationHelper.showSuccessNotification('Document/s locked successfully', 'Success');
                _this.loadDocuments(_this.orderNo);
            }, function (error) {
                _this.notificationHelper.hideLoader();
                _this.notificationHelper.showErrorNotification('Document/s cannot be locked, please try again', 'Error!');
            }, function () { });
            this.selectedDocNodes = new Array();
            this.SelectedViewEnum = 0;
        }
        else {
            this.notificationHelper.showWarningNotification('Please select document first', 'Warning');
        }
    };
    /**
    *  show checked boxes tree for lock
    **/
    OrderDocumentComponent.prototype.showUnlockTreeLock_Clicked = function () {
        this.removeTooltip();
        this.showCheckBoxWithUploadfromWeb(this.treeViewList, true);
        this.isUnlockClicked = true;
        this.SelectedViewEnum = 0;
    };
    /**
    *  reset tree
    **/
    OrderDocumentComponent.prototype.hideUnlockTree_Clicked = function () {
        this.removeTooltip();
        this.isUnlockClicked = false;
        this.showCheckBox(this.treeViewList, false);
        this.deSelectCheckBox(this.treeViewList, false);
        this.SelectedViewEnum = 0;
    };
    /**
    *  Lock document tree clicked
    **/
    OrderDocumentComponent.prototype.documentUnlock_Clicked = function () {
        var _this = this;
        this.removeTooltip();
        this.getCheckedDocuments(this.treeViewList);
        if (this.selectedDocNodes.length !== 0) {
            this.isUnlockClicked = false;
            this.showCheckBox(this.treeViewList, false);
            this.deSelectCheckBox(this.treeViewList, false);
            this.notificationHelper.showLoader();
            this.documentService.lockDocuments(this.selectedDocNodes, false)
                .subscribe(function (data) {
                _this.notificationHelper.showSuccessNotification('Document/s unlocked successfully', 'Success');
                _this.loadDocuments(_this.orderNo);
            }, function (error) {
                _this.notificationHelper.hideLoader();
                _this.notificationHelper.showErrorNotification('Document/s cannot be unlocked, please try again', 'Error!');
            }, function () { });
            this.selectedDocNodes = new Array();
            this.SelectedViewEnum = 0;
        }
        else {
            this.notificationHelper.showWarningNotification('Please select document first', 'Warning');
        }
    };
    /**
    *  Lock document tree clicked
    **/
    OrderDocumentComponent.prototype.canvelOrderDocAddUpdate_Click = function () {
        this.removeTooltip();
        this.SelectedViewEnum = 0;
        this.isDirSelected = true;
    };
    /**
    *  file selection clicked
    **/
    OrderDocumentComponent.prototype.fileChange = function (obj) {
        var uploadedFile = obj.target.files[0];
        this.documentModel.file = uploadedFile;
    };
    /**
    *  retirves selected nodes from tree
    **/
    OrderDocumentComponent.prototype.getCheckedDocuments = function (dir) {
        var _this = this;
        if (dir !== null && dir.childNodes !== null) {
            dir.childNodes.forEach(function (d) {
                if (d.childNodes == null || d.childNodes.length == 0)
                    if (d.checked) {
                        _this.selectedNodes.push(d);
                        var tdoc = new order_document_model_1.DocumentModel();
                        tdoc.ID2 = d.ID2;
                        tdoc.DocTypeID = d.DocTypeID;
                        tdoc.Description = d.Description;
                        tdoc.RowId = d.RowId;
                        tdoc.DocPath = d.FilePath;
                        _this.selectedDocNodes.push(tdoc);
                    }
                _this.getCheckedDocuments(d);
            });
        }
    };
    /**
   *  retirves Unlocked Documents
   **/
    OrderDocumentComponent.prototype.getCheckedUnLockedDocuments = function (dir) {
        var _this = this;
        if (dir !== null && dir.childNodes !== null) {
            dir.childNodes.forEach(function (d) {
                if (d.childNodes == null || d.childNodes.length == 0)
                    if (d.checked && !d.islocked) {
                        _this.selectedNodes.push(d);
                        var tdoc = new order_document_model_1.DocumentModel();
                        tdoc.ID2 = d.ID2;
                        tdoc.DocTypeID = d.DocTypeID;
                        tdoc.Description = d.Description;
                        tdoc.RowId = d.RowId;
                        _this.selectedDocNodes.push(tdoc);
                    }
                _this.getCheckedUnLockedDocuments(d);
            });
        }
    };
    /**
    *  removes selection from tree
    **/
    OrderDocumentComponent.prototype.removeSelection = function (dir) {
        var _this = this;
        if (dir !== null && dir.childNodes !== null) {
            dir.childNodes.forEach(function (d) {
                d.isClicked = false;
                _this.removeSelection(d);
            });
        }
    };
    /**
    *  show check boxes in tree
    **/
    OrderDocumentComponent.prototype.showCheckBox = function (dir, isShown) {
        var _this = this;
        if (dir !== null && dir.childNodes !== null) {
            dir.childNodes.forEach(function (d) {
                d.showCheckBox = isShown;
                _this.showCheckBox(d, isShown);
            });
        }
    };
    /**
    *  show check boxes in tree with unlock
    **/
    OrderDocumentComponent.prototype.showCheckBoxWithUnlocked = function (dir, isShown) {
        var _this = this;
        if (dir !== null && dir.childNodes !== null) {
            dir.childNodes.forEach(function (d) {
                if (!d.islocked)
                    d.showCheckBox = isShown;
                _this.showCheckBoxWithUnlocked(d, isShown);
            });
        }
    };
    /**
    *  show check boxes in tree with unlock
    **/
    OrderDocumentComponent.prototype.showCheckBoxWithUnlockedAndPDF = function (dir, isShown) {
        var _this = this;
        if (dir !== null && dir.childNodes !== null) {
            dir.childNodes.forEach(function (d) {
                if (!d.islocked && d.FilePath.search('.pdf') > 0)
                    d.showCheckBox = isShown;
                _this.showCheckBoxWithUnlockedAndPDF(d, isShown);
            });
        }
    };
    /**
    *  show check boxes in tree with locked
    **/
    OrderDocumentComponent.prototype.showCheckBoxWithUploadfromWeb = function (dir, isShown) {
        var _this = this;
        if (dir !== null && dir.childNodes !== null) {
            dir.childNodes.forEach(function (d) {
                if (d.UploadfromWeb && d.UploadBy == _this.getCurrentUserID())
                    d.showCheckBox = true;
                else
                    d.showCheckBox = false;
                _this.showCheckBoxWithUploadfromWeb(d, isShown);
            });
        }
    };
    /**
    *  reset checkboxes
    **/
    OrderDocumentComponent.prototype.deSelectCheckBox = function (dir, selectionStatus) {
        var _this = this;
        if (dir !== null && dir.childNodes !== null) {
            dir.childNodes.forEach(function (d) {
                d.checked = selectionStatus;
                _this.deSelectCheckBox(d, selectionStatus);
            });
        }
    };
    /*
    * remove tool tip using jquery
    */
    OrderDocumentComponent.prototype.removeTooltip = function () {
        //jQuery('.tooltip[role="tooltip"]').remove();
    };
    /*
    *
    */
    OrderDocumentComponent.prototype.saveUploadDocument = function (data) {
        var _this = this;
        this.notificationHelper.showLoader();
        var f = new FormData();
        f.append(data.file.name, data.file);
        f.append('BorrowerViewable', data.BorrowerViewable);
        f.append('EnteredBy', JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem("LoggedInUserObject")) /*this.appConfig.loggedInUser*/);
        f.append('BranchID', data.BranchID);
        f.append('ClientViewable', data.ClientViewable);
        f.append('Description', data.Description);
        f.append('DisbursementID', data.DisbursementID);
        f.append('DocDescription', data.DocDescription);
        f.append('DocPath', data.DocPath);
        f.append('DocSource', data.DocSource);
        f.append('DocType', data.DocType);
        f.append('DocTypeID', data.DocTypeID);
        f.append('DocumentFolder', data.DocumentFolder);
        f.append('EnteredDate', data.EnteredDate);
        f.append('EventId', data.EventId);
        f.append('FullDescription', data.FullDescription);
        f.append('ID1', data.ID1);
        f.append('ID2', data.ID2);
        f.append('IsLocked', data.IsLocked);
        f.append('Ordered', data.Ordered);
        f.append('ProductCategory', data.ProductCategory);
        f.append('RawDescription', data.RawDescription);
        f.append('RowId', data.RowId);
        f.append('uidDisbursement', data.uidDisbursement);
        f.append('uidHUDLine', data.uidHUDLine);
        f.append('VendorViewable', data.VendorViewable);
        f.append('UploadfromWeb', data.UploadfromWeb);
        f.append('UploadBy', data.UploadBy);
        this.notificationHelper.showLoader();
        this.documentService.SaveUploadDocument(f)
            .subscribe(function (data) { return _this.documentAddSuccess(data); }, function (error) { return _this.documentAddFaiure(error); }, function () { });
    };
    OrderDocumentComponent.prototype.documentAddSuccess = function (data) {
        if (data == -1) {
            this.notificationHelper.hideLoader();
            //this.displayErrorMsg = true;
            this.notificationHelper.showSaveErrorNotification();
        }
        else {
            //this.displaySuccessMsg = true;
            this.validateorder();
            this.SelectedViewEnum = 0;
            this.notificationHelper.showSuccessNotification('Document has been uploaded successfully', 'Success'); //.showSaveSuccessNotification();
        }
    };
    OrderDocumentComponent.prototype.documentAddFaiure = function (data) {
        //this.displayErrorMsg = true;
        this.notificationHelper.hideLoader();
        this.notificationHelper.showSaveErrorNotification();
    };
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], OrderDocumentComponent.prototype, "notificationHelper", void 0);
    OrderDocumentComponent = __decorate([
        core_1.Component({
            selector: 'order-document',
            templateUrl: '../dev/tpl/order-document.html',
            directives: [tree_view_component_1.DirectoryViewComponent, pdf_viewer_component_1.PdfViewerComponent, notifications_component_1.NotificationsComponent, multi_select_component_1.MultiSelectComponent, left_navigation_component_1.LeftNavigationComponent, header_detail_component_1.HeaderDetailComponent],
            providers: [
                core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }),
                reference_data_service_1.ReferenceDataService, order_document_service_1.DocumentService, account_profile_service_1.AccountProfileService, logging_1.LoggingService]
        }),
        __param(0, core_1.Inject(order_document_service_1.DocumentService)),
        __param(1, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(2, core_1.Inject(reference_data_service_1.ReferenceDataService)),
        __param(3, core_1.Inject(account_profile_service_1.AccountProfileService)),
        __param(4, core_1.Inject(router_deprecated_1.RouteParams)),
        __param(5, core_1.Inject(router_deprecated_1.Router)),
        __param(6, core_1.Inject(logging_1.LoggingService))
    ], OrderDocumentComponent);
    return OrderDocumentComponent;
}());
exports.OrderDocumentComponent = OrderDocumentComponent;
var EmailModel = (function () {
    function EmailModel(EmailToCSV, EmailFrom, Subject, Body, AttachmentsCSV, DocumentID) {
        if (EmailToCSV === void 0) { EmailToCSV = ''; }
        if (EmailFrom === void 0) { EmailFrom = 'Please Select'; }
        if (Subject === void 0) { Subject = ''; }
        if (Body === void 0) { Body = ''; }
        if (AttachmentsCSV === void 0) { AttachmentsCSV = ''; }
        if (DocumentID === void 0) { DocumentID = null; }
        this.EmailToCSV = EmailToCSV;
        this.EmailFrom = EmailFrom;
        this.Subject = Subject;
        this.Body = Body;
        this.AttachmentsCSV = AttachmentsCSV;
        this.DocumentID = DocumentID;
    }
    return EmailModel;
}());
exports.EmailModel = EmailModel;
//# sourceMappingURL=order-document.component.js.map