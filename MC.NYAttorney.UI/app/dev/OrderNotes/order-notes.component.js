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
var order_notes_service_1 = require('./order-notes.service');
var left_navigation_component_1 = require('../common/left-navigation.component');
var header_detail_component_1 = require('../common/header-detail.component');
var reference_data_service_1 = require('../referenceData/reference-data.service');
var utility_1 = require('../common/utility');
var account_profile_service_1 = require('../accountProfile/account-profile.service');
var customLocalStorage_1 = require('../common/customLocalStorage');
core_1.enableProdMode();
var NotesComponent = (function () {
    function NotesComponent(_service, _appConfig, _router, _refService, _accountProfileService, _routeParams, _logservice) {
        this.model = new OrderNotesModelClass();
        this.isNoNoteFound = false;
        this.fromList = new Array();
        this.onFirstTime = true;
        this.loggedUser = "";
        this.noteTypeList = new Array();
        this.ImageList = new Array();
        this.noteFormVisible = false;
        this.noteTypeListInPopup = new Array();
        this.utility = new utility_1.Utility();
        this.screenName = "OrderNotes";
        this.active = true;
        this.submitted = false;
        this.NotesModelList = [];
        this.routeParams = _routeParams;
        this.httpService = _service;
        this.appConfig = _appConfig;
        this._refernceService = _refService;
        this.accountProfileService = _accountProfileService;
        this.noteTypeList = [];
        this.ImageList = ['PAYROL', 'ACCOUNTING', 'ACCOUNTINGISSUE', 'COUNSELING', 'COVERAGE', 'FOLLOWUP', 'GENERALNOTETOFILE', 'INITIALCALL', 'PAYMENT', 'PERFORMANCE', 'PROBLEMRESPONSE', 'ROUTINE', 'WORKFLOW'];
        this.clientTab = enumerations_1.enmTabs.OrderNotes;
        this.logService = _logservice;
    }
    NotesComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.validateOrder();
        if (JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName)) == null)
            this.accountProfileService.getPermissionsAgainstRole(this.screenName)
                .subscribe(function (data) {
                customLocalStorage_1.CustomLocalStorage.setItem(_this.screenName, JSON.stringify(data));
                _this.loadRolesAndPermissions(data);
            }, function (error) { return _this.logService.log(error); });
        else
            this.loadRolesAndPermissions(JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName)));
    };
    NotesComponent.prototype.loadRolesAndPermissions = function (data) {
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
    NotesComponent.prototype.addBtnForm = function () {
        var _this = this;
        this.model.Note = null;
        this.noteFormVisible = true;
        this.active = false;
        setTimeout(function () { return _this.active = true; }, 0);
    };
    NotesComponent.prototype.getCurrentUserID = function () {
        var contactId = this.utility.getContactId();
        if (contactId !== null)
            return contactId;
        return null;
    };
    NotesComponent.prototype.onSubmit = function () {
        var _this = this;
        this.model.NoteId = 0;
        this.submitted = true;
        this.model.LastModBy = this.getCurrentUserID();
        this.model.OrderNo = this.orderId;
        this.model.Note = this.model.Note.replace(/(?:\r\n|\r|\n)/g, '</br>');
        this.model.NoteType = "[SYSTEM]";
        this.model.ClientViewable = true;
        this.model.ItemNo = 1;
        this.model.Suffix = "OT";
        this.model.NoteSource = "C";
        this.child.showLoader();
        this.httpService.createNotes(this.model).subscribe(function (response) { return _this.successCreator(response); }, this.logError, function () { return _this.logService.log('Creation Call Sent'); });
    };
    NotesComponent.prototype.setNoteTypeList = function (data) {
        this.child.hideLoader();
        this.noteTypeListInPopup = data;
        this.noteTypeList = data;
        this.getNotes();
        this.findAndRemove(this.noteTypeListInPopup, 'cboEntry', '[ALL]');
        this.findAndRemove(this.noteTypeListInPopup, 'cboEntry', 'Please Select');
    };
    NotesComponent.prototype.findAndRemove = function (array, property, value) {
        array.forEach(function (result, index) {
            if (result[property] === value) {
                array.splice(index, 1);
            }
        });
    };
    NotesComponent.prototype.createPageNumberArray = function () {
        this.pageNumberList = new Array();
        for (var i = 1; i <= this.totalPages; i++)
            this.pageNumberList.push(i);
    };
    NotesComponent.prototype.validateOrder = function () {
        var orderNo = +this.routeParams.get("orderno");
        this.orderId = orderNo;
        this.fillNotesType();
    };
    NotesComponent.prototype.getNotes = function () {
        var _this = this;
        this.child.showLoader();
        this.httpService.getNotesByOrder(this.orderId)
            .subscribe(function (data) { return _this.setData(data); }, function (error) { return _this.returnResponse(error); }, function () { return _this.logService.log("API Call Finished Successfully!"); });
    };
    NotesComponent.prototype.fillNotesType = function () {
        var _this = this;
        this.child.showLoader();
        this._refernceService.getddlType('OrderNoteType')
            .subscribe(function (data) { return _this.setNoteTypeList(data); }, function (error) { _this.logService.log(error); }, function () { return _this.logService.log("API Call Finished Successfully!"); });
        this.child.hideLoader();
    };
    NotesComponent.prototype.filterNotes = function (sender) {
        this.searchNotes(sender.target.value);
    };
    NotesComponent.prototype.searchNotes = function (noteType) {
        this.NotesModelList = [];
        if (noteType == "[ALL]" && noteType !== "Please Select") {
            this.NotesModelList = this.NotesModelListCopy;
        }
        else if (noteType !== "[ALL]" && noteType !== "Please Select") {
            for (var index in this.NotesModelListCopy) {
                if (this.NotesModelListCopy[index]["NoteType"] == noteType) {
                    this.NotesModelListCopy[index]["LastModDate"] = moment(this.NotesModelListCopy[index]["LastModDate"]).format('MM/DD/YYYY');
                    this.NotesModelList.push(this.NotesModelListCopy[index]);
                }
            }
        }
    };
    NotesComponent.prototype.logError = function (err) {
        this.child.hideLoader();
        this.child.showSaveErrorNotification();
        console.error('There was an error: ' + err);
    };
    NotesComponent.prototype.addIcon = function (noteType) {
        var type = noteType.replace(/\s/g, '');
        if (this.ImageList.indexOf(type.toUpperCase()) > -1) {
            type = type.toUpperCase();
            return type;
        }
        else {
            return 'DEFAULT';
        }
    };
    NotesComponent.prototype.successCreator = function (res) {
        this.child.hideLoader();
        this.child.showSaveSuccessNotification();
        this.getNotes();
        this.isNoNoteFound = false;
        jQuery("#cancelBtn").click();
    };
    NotesComponent.prototype.setData = function (data) {
        this.child.hideLoader();
        this.NotesModelList = [];
        for (var index in data) {
            var date = data[index]["LastModDate"];
            data[index]["LastModDate"] = moment(data[index]["LastModDate"]).format('MM/DD/YYYY HH:mm A');
            this.NotesModelList.push(data[index]);
        }
        this.NotesModelListCopy = data;
        this.addPagination();
    };
    NotesComponent.prototype.addPagination = function () {
        if (this.NotesModelList) {
            this.rowsCopy = this.NotesModelList;
            this.pageNumber = 1;
            this.pageSize = this.appConfig.pageSize;
            this.totalRows = this.rowsCopy.length;
            this.rowsTemp = [];
            this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
            this.NotesModelList = this.rowsTemp;
            this.currentRowsCount = this.rowsTemp.length;
            this.onFirstTime = false;
            var totalPages = (this.totalRows + this.pageSize - 1) / this.pageSize;
            this.totalPages = parseInt(totalPages.toString());
            this.createPageNumberArray();
        }
        if (this.NotesModelList)
            this.logService.log(this.NotesModelList);
    };
    NotesComponent.prototype.returnResponse = function (err) {
        this.child.hideLoader();
        this.logService.log(err);
        if (err.statusText == "Ok") {
            this.isNoNoteFound = true;
            jQuery(".paginationBtn").prop("disabled", true);
        }
        else {
            this.child.showErrorNotification("Unexpected error occurred while retrieving order notes.", "Error !");
        }
    };
    NotesComponent.prototype.gotoPageNumberInput = function (sender) {
        this.goToPageNumber(sender.target.value);
    };
    NotesComponent.prototype.goToPageNumber = function (page) {
        this.pageNumber = page;
        this.rowsTemp = [];
        this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
        this.currentRowsCount = this.rowsTemp.length;
        this.NotesModelList = this.rowsTemp;
    };
    NotesComponent.prototype.Next = function () {
        this.pageNumber += 1;
        this.rowsTemp = [];
        this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
        this.currentRowsCount = this.rowsTemp.length;
        this.NotesModelList = this.rowsTemp;
    };
    NotesComponent.prototype.Previous = function () {
        this.pageNumber -= 1;
        this.rowsTemp = [];
        this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
        this.currentRowsCount = this.rowsTemp.length;
        this.NotesModelList = this.rowsTemp;
    };
    NotesComponent.prototype.First = function () {
        this.pageNumber = 1;
        this.rowsTemp = [];
        this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
        this.currentRowsCount = this.rowsTemp.length;
        this.NotesModelList = this.rowsTemp;
    };
    NotesComponent.prototype.Last = function () {
        this.pageNumber = this.totalPages;
        this.rowsTemp = [];
        this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
        this.currentRowsCount = this.rowsTemp.length;
        this.NotesModelList = this.rowsTemp;
    };
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], NotesComponent.prototype, "child", void 0);
    NotesComponent = __decorate([
        core_1.Component({
            selector: 'notes',
            templateUrl: '../../dev/tpl/order-notes.html',
            directives: [forms_1.NgForm, notifications_component_1.NotificationsComponent, left_navigation_component_1.LeftNavigationComponent, header_detail_component_1.HeaderDetailComponent],
            providers: [order_notes_service_1.OrderNotesService, reference_data_service_1.ReferenceDataService, account_profile_service_1.AccountProfileService,
                core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }), logging_1.LoggingService]
        }),
        __param(0, core_1.Inject(order_notes_service_1.OrderNotesService)),
        __param(1, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(2, core_1.Inject(router_deprecated_1.Router)),
        __param(3, core_1.Inject(reference_data_service_1.ReferenceDataService)),
        __param(4, core_1.Inject(account_profile_service_1.AccountProfileService)),
        __param(5, core_1.Inject(router_deprecated_1.RouteParams)),
        __param(6, core_1.Inject(logging_1.LoggingService))
    ], NotesComponent);
    return NotesComponent;
}());
exports.NotesComponent = NotesComponent;
var OrderNotesModelClass = (function () {
    function OrderNotesModelClass(NoteId, OrderNo, ItemNo, Xref_RowId, Suffix, NoteSource, EventId, NoteType, Note, SentTo, Priority, ClientViewable, VendorViewable, BorrowerViewable, ClientActionReq, LastModDate, LastModBy, SysTimeStamp, Inactive) {
        if (NoteId === void 0) { NoteId = null; }
        if (OrderNo === void 0) { OrderNo = null; }
        if (ItemNo === void 0) { ItemNo = null; }
        if (Xref_RowId === void 0) { Xref_RowId = null; }
        if (Suffix === void 0) { Suffix = null; }
        if (NoteSource === void 0) { NoteSource = null; }
        if (EventId === void 0) { EventId = null; }
        if (NoteType === void 0) { NoteType = null; }
        if (Note === void 0) { Note = null; }
        if (SentTo === void 0) { SentTo = null; }
        if (Priority === void 0) { Priority = null; }
        if (ClientViewable === void 0) { ClientViewable = null; }
        if (VendorViewable === void 0) { VendorViewable = null; }
        if (BorrowerViewable === void 0) { BorrowerViewable = null; }
        if (ClientActionReq === void 0) { ClientActionReq = null; }
        if (LastModDate === void 0) { LastModDate = null; }
        if (LastModBy === void 0) { LastModBy = null; }
        if (SysTimeStamp === void 0) { SysTimeStamp = null; }
        if (Inactive === void 0) { Inactive = null; }
        this.NoteId = NoteId;
        this.OrderNo = OrderNo;
        this.ItemNo = ItemNo;
        this.Xref_RowId = Xref_RowId;
        this.Suffix = Suffix;
        this.NoteSource = NoteSource;
        this.EventId = EventId;
        this.NoteType = NoteType;
        this.Note = Note;
        this.SentTo = SentTo;
        this.Priority = Priority;
        this.ClientViewable = ClientViewable;
        this.VendorViewable = VendorViewable;
        this.BorrowerViewable = BorrowerViewable;
        this.ClientActionReq = ClientActionReq;
        this.LastModDate = LastModDate;
        this.LastModBy = LastModBy;
        this.SysTimeStamp = SysTimeStamp;
        this.Inactive = Inactive;
    }
    return OrderNotesModelClass;
}());
//# sourceMappingURL=order-notes.component.js.map