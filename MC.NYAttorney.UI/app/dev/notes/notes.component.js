var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('angular2/core');
var http_1 = require('angular2/http');
var router_1 = require('angular2/router');
var app_config_1 = require('../app-config');
//
var common_1 = require('angular2/common');
//import {VendorDetailComponent} from '../vendor/vendor-detail.component';
var notifications_component_1 = require('../notifications/notifications.component');
var notes_service_1 = require('./notes.service');
var reference_data_service_1 = require('../referenceData/reference-data.service');
//import { VendorAssociateMain } from '../vendorAssociate/vendorAssociate.model';
//import {VendorAssociateService} from '../vendorAssociate/vendor-associate.service';
var multi_select_component_1 = require('../multiSelect/multi-select.component');
var column_1 = require('../multiSelect/column');
core_1.enableProdMode();
var NotesComponent = (function () {
    function NotesComponent(_service, _appConfig, _refService, _router, 
        //@Inject(VendorAssociateService) _vendorAssociateServices,
        _routeParams) {
        this.model = new NotesModelClass();
        this.selectedNoteType = "[ALL]";
        this.isVendorViewable = false;
        this.isEmail = false;
        this.isNoNoteFound = false;
        this.noteTypeList = new Array();
        this.noteTypeListInPopup = new Array();
        this.sentToList = new Array();
        this.sentToInternalList = new Array();
        this.contactList = new Array();
        this.selectedSentTo = new Array();
        this.selectedEmails = new Array();
        this.noteFormVisible = false;
        this.noteEmailFormVisible = false;
        this.fromList = new Array();
        /*** onSubmit() : Call on form submit**/
        this.submitted = false;
        //this._vendorAssociateService = _vendorAssociateServices;
        //this.vendorTab = enmVendorDetail.Notes;
        this.routeParams = _routeParams;
        this.httpService = _service;
        this._refernceService = _refService;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/Notes/";
        this.lstATitle = "Available Contacts";
        this.lstBTitle = "Selected Contacts";
        this.contactsColumns = this.getContactsColumns();
        this.selectedEmails = [];
    }
    NotesComponent.prototype.ngOnInit = function () {
    };
    NotesComponent.prototype.ngAfterViewInit = function () {
        this.validateVendor();
    };
    NotesComponent.prototype.validateVendor = function () {
        var vendorId = +this.routeParams.get("vId");
        this.vendorId = vendorId;
        this.vendorId = 36578; //This line needs to be commented later on
        this.getNotes();
        this.fillNotesType();
        this.fillFromList();
        this.getVendorAssociateContactList();
    };
    NotesComponent.prototype.getNotes = function () {
        var _this = this;
        this.child.showLoader();
        this.httpService.getNotesByVendor(this.vendorId)
            .subscribe(function (data) { return _this.setData(data); }, function (error) { return _this.returnResponse(error); }, function () { return console.log("API Call Finished Successfully!"); });
    };
    NotesComponent.prototype.getVendorAssociateContactList = function () {
        var _this = this;
        this.child.showLoader();
        this.httpService.getVendorAssociateContactList(this.vendorId)
            .subscribe(function (data) {
            _this.fillSentTo(data);
        }, function (error) {
            _this.child.hideLoader();
            console.log(error);
        }, function () { return console.log("API Call Finished Successfully!"); });
    };
    NotesComponent.prototype.getInternalContacts = function () {
        var _this = this;
        this.child.showLoader();
        this.httpService.getInternalVendor(0, 0)
            .subscribe(function (data) {
            _this.fillInternalContacts(data);
        }, function (error) {
            _this.child.hideLoader();
            console.log(error);
        }, function () { return console.log("API Call Finished Successfully!"); });
    };
    NotesComponent.prototype.fillInternalContacts = function (data) {
        console.log("Internal Contacts");
        console.log(data);
        this.child.hideLoader();
        this.sentToInternalList = data;
        this.contactList = data;
    };
    NotesComponent.prototype.fillSentTo = function (data) {
        this.child.hideLoader();
        this.sentToList = data;
        this.contactList = data;
    };
    NotesComponent.prototype.contactTypeChange = function (sender) {
        var contactType = sender.target.value;
        if (contactType == 'Vendor') {
            //this.contactList = this.sentToList;
            this.getVendorAssociateContactList();
        }
        else {
            this.getInternalContacts();
        }
    };
    NotesComponent.prototype.selectTo = function () {
        jQuery("#triggerToList").click();
    };
    NotesComponent.prototype.setToListOnControl = function () {
        if (this.selectedSentTo.length > 0) {
            this.model.SentTo = this.selectedSentTo.join("; ");
        }
        jQuery("#closeSentToPopup").click();
        jQuery("#triggerEmailPopup").click();
    };
    NotesComponent.prototype.cancelToListAndBack = function () {
        this.selectedSentTo = [];
        jQuery("#ddlContactType").val("Vendor");
        jQuery("#triggerEmailPopup").click();
    };
    NotesComponent.prototype.getContactsColumns = function () {
        return [
            new column_1.MultiSelectColumn('FullName', 'Email', 'Email')
        ];
    };
    NotesComponent.prototype.getContactsFromList = function (list) {
        this.selectedSentTo = [];
        if (list && list.length > 0) {
            for (var index in list) {
                this.selectedSentTo.push(list[index]["Email"]);
            }
        }
    };
    NotesComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        if (!this.isEmail) {
            this.model.LastModBy = "Dev_User";
            this.model.XRefId = this.vendorId;
            this.child.showLoader();
            this.httpService.createNotesByVendor(this.model).subscribe(function (response) { return _this.successCreator(response); }, this.logError, function () { return console.log('Creation Call Sent'); });
        }
        else {
            this.noteEmailFormVisible = true;
            this.triggerEmailPopup();
        }
    };
    NotesComponent.prototype.onEmailSubmit = function () {
        var _this = this;
        this.model.LastModBy = "Dev_User";
        this.model.XRefId = this.vendorId;
        var f = new FormData();
        if (this.model.file != null && this.model.file != 'undefined') {
            for (var i = 0; i < this.model.file.length; i++) {
                f.append(this.model.file[i].name, this.model.file[i]);
            }
        }
        if (this.model.ClientViewable == null)
            this.model.ClientViewable = false;
        f.append('ClientViewable', this.model.ClientViewable);
        f.append('LastModDate', this.model.LastModDate);
        f.append('LastModBy', this.model.LastModBy);
        f.append('Note', this.model.Note);
        f.append('NoteType', this.model.NoteType);
        f.append('Priority', this.model.Priority);
        f.append('SentTo', this.model.SentTo);
        f.append('Suffix', this.model.Suffix);
        f.append('VendorViewable', this.model.VendorViewable);
        f.append('XRefId', this.model.XRefId);
        this.child.showLoader();
        this.child.showLoader();
        jQuery.ajax({
            url: this.apiEndpoint + '/SaveNotesWithAttachment',
            data: f,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (d) { return _this.successCreator(d); },
            error: function (d) { return _this.logError; }
        });
    };
    NotesComponent.prototype.logError = function (err) {
        this.child.hideLoader();
        this.child.showSaveErrorNotification();
        console.error('There was an error: ' + err);
    };
    NotesComponent.prototype.successCreator = function (res) {
        this.triggerCancelButton();
        this.triggerEmailCancelButton();
        this.child.hideLoader();
        this.child.showSaveSuccessNotification();
        this.getNotes();
        this.isNoNoteFound = false;
        this.resetForm();
    };
    NotesComponent.prototype.addBtnForm = function () {
        this.noteFormVisible = true;
        this.selectedEmails = [];
        this.contactList = this.sentToList;
        jQuery("#ddlContactType").val("Vendor");
    };
    NotesComponent.prototype.resetForm = function () {
        this.noteFormVisible = false;
        this.noteEmailFormVisible = false;
        this.isEmail = false;
        this.model = new NotesModelClass();
    };
    NotesComponent.prototype.VendorViewable = function (vendorViewable) {
        this.model.VendorViewable = vendorViewable;
    };
    NotesComponent.prototype.setData = function (data) {
        this.child.hideLoader();
        this.NotesModelList = [];
        for (var index in data) {
            data[index]["LastModDate"] = moment(data[index]["LastModDate"]).format('MM/DD/YYYY');
            this.NotesModelList.push(data[index]);
        }
        this.NotesModelListCopy = data;
    };
    NotesComponent.prototype.fillNotesType = function () {
        var _this = this;
        //Main Component Methods
        this.child.showLoader();
        this._refernceService.getddlType('VendorNoteType')
            .subscribe(function (data) { return _this.setNoteTypeList(data); }, function (error) { return _this.child.hideLoader(); }, function () { return console.log("API Call Finished Successfully!"); });
    };
    NotesComponent.prototype.fillFromList = function () {
        var _this = this;
        //Main Component Methods
        this.child.showLoader();
        this._refernceService.getddlType('FromEmails')
            .subscribe(function (data) { return _this.setFromList(data); }, function (error) { return _this.child.hideLoader(); }, function () { return console.log("API Call Finished Successfully!"); });
    };
    NotesComponent.prototype.setFromList = function (data) {
        this.child.hideLoader();
        this.fromList = data;
    };
    NotesComponent.prototype.findAndRemove = function (array, property, value) {
        array.forEach(function (result, index) {
            if (result[property] === value) {
                array.splice(index, 1);
            }
        });
    };
    NotesComponent.prototype.setNoteTypeList = function (data) {
        this.child.hideLoader();
        this.noteTypeList = data;
        this.noteTypeListInPopup = data;
        this.findAndRemove(this.noteTypeListInPopup, 'cboEntry', '[ALL]');
        this.findAndRemove(this.noteTypeListInPopup, 'cboEntry', 'Please Select');
        this.findAndRemove(this.noteTypeList, 'cboEntry', 'Please Select');
    };
    NotesComponent.prototype.filterNotes = function (sender) {
        var noteType = sender.target.value;
        this.selectedNoteType = noteType;
        this.searchNotes(this.selectedNoteType, this.isVendorViewable);
    };
    NotesComponent.prototype.vendorViewableSearch = function (checked) {
        this.isVendorViewable = checked;
        this.searchNotes(this.selectedNoteType, this.isVendorViewable);
    };
    NotesComponent.prototype.searchNotes = function (noteType, vendorViewable) {
        this.NotesModelList = [];
        if (noteType == "[ALL]" && this.isVendorViewable) {
            for (var index in this.NotesModelListCopy) {
                if (this.NotesModelListCopy[index]["VendorViewable"]) {
                    this.NotesModelListCopy[index]["LastModDate"] = moment(this.NotesModelListCopy[index]["LastModDate"]).format('MM/DD/YYYY');
                    this.NotesModelList.push(this.NotesModelListCopy[index]);
                }
            }
        }
        else if (noteType == "[ALL]" && !this.isVendorViewable) {
            for (var index in this.NotesModelListCopy) {
                this.NotesModelListCopy[index]["LastModDate"] = moment(this.NotesModelListCopy[index]["LastModDate"]).format('MM/DD/YYYY');
                this.NotesModelList.push(this.NotesModelListCopy[index]);
            }
        }
        else if (noteType != "[ALL]" && !this.isVendorViewable) {
            for (var index in this.NotesModelListCopy) {
                if (this.NotesModelListCopy[index]["NoteType"] == noteType) {
                    this.NotesModelListCopy[index]["LastModDate"] = moment(this.NotesModelListCopy[index]["LastModDate"]).format('MM/DD/YYYY');
                    this.NotesModelList.push(this.NotesModelListCopy[index]);
                }
            }
        }
        else if (noteType != "[ALL]" && this.isVendorViewable) {
            for (var index in this.NotesModelListCopy) {
                if (this.NotesModelListCopy[index]["NoteType"] == noteType && this.NotesModelListCopy[index]["VendorViewable"]) {
                    this.NotesModelListCopy[index]["LastModDate"] = moment(this.NotesModelListCopy[index]["LastModDate"]).format('MM/DD/YYYY');
                    this.NotesModelList.push(this.NotesModelListCopy[index]);
                }
            }
        }
    };
    NotesComponent.prototype.EmailNote = function (isEmailNote) {
        this.changeSubmitButtonText(isEmailNote);
    };
    NotesComponent.prototype.cancel = function () {
        this.resetForm();
    };
    NotesComponent.prototype.returnResponse = function (err) {
        this.child.hideLoader();
        console.log(err);
        if (err.statusText == "Ok") {
            this.isNoNoteFound = true;
        }
        else {
            this.child.showErrorNotification("Unexpected error occurred while retrieving vendor notes.", "Error !");
        }
    };
    NotesComponent.prototype.triggerCancelButton = function () {
        jQuery("#cancelBtn").click();
    };
    NotesComponent.prototype.triggerEmailCancelButton = function () {
        jQuery("#cancelEmailBtn").click();
    };
    NotesComponent.prototype.triggerEmailPopup = function () {
        this.triggerCancelButton();
        var subject = 'New ' + this.model.NoteType + ' For Vendor ' + this.vendorId;
        jQuery("#subject").val(subject);
        jQuery("#triggerEmailPopup").click();
    };
    NotesComponent.prototype.changeSubmitButtonText = function (bit) {
        this.isEmail = bit;
        if (bit)
            jQuery("#submitBtn").html("Send Email");
        else
            jQuery("#submitBtn").html("Save Changes");
    };
    NotesComponent.prototype.fileChange = function (obj) {
        var uploadedFile = obj.target.files;
        this.model.file = uploadedFile;
    };
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], NotesComponent.prototype, "child", void 0);
    NotesComponent = __decorate([
        core_1.Component({
            selector: 'notes',
            templateUrl: '../../dev/tpl/notes.html',
            directives: [common_1.NgForm, notifications_component_1.NotificationsComponent, multi_select_component_1.MultiSelectComponent],
            providers: [http_1.HTTP_PROVIDERS, notes_service_1.NotesService, reference_data_service_1.ReferenceDataService,
                core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG })]
        }),
        __param(0, core_1.Inject(notes_service_1.NotesService)),
        __param(1, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(2, core_1.Inject(reference_data_service_1.ReferenceDataService)),
        __param(3, core_1.Inject(router_1.Router)),
        __param(4, core_1.Inject(router_1.RouteParams))
    ], NotesComponent);
    return NotesComponent;
})();
exports.NotesComponent = NotesComponent;
var NotesModelClass = (function () {
    function NotesModelClass(NoteId, XRefId, Suffix, NoteType, Note, ClientViewable, VendorViewable, SentTo, Priority, LastModDate, LastModBy, SysTimeStamp, Inactive) {
        if (NoteId === void 0) { NoteId = null; }
        if (XRefId === void 0) { XRefId = null; }
        if (Suffix === void 0) { Suffix = null; }
        if (NoteType === void 0) { NoteType = null; }
        if (Note === void 0) { Note = null; }
        if (ClientViewable === void 0) { ClientViewable = null; }
        if (VendorViewable === void 0) { VendorViewable = null; }
        if (SentTo === void 0) { SentTo = null; }
        if (Priority === void 0) { Priority = null; }
        if (LastModDate === void 0) { LastModDate = null; }
        if (LastModBy === void 0) { LastModBy = null; }
        if (SysTimeStamp === void 0) { SysTimeStamp = null; }
        if (Inactive === void 0) { Inactive = null; }
        this.NoteId = NoteId;
        this.XRefId = XRefId;
        this.Suffix = Suffix;
        this.NoteType = NoteType;
        this.Note = Note;
        this.ClientViewable = ClientViewable;
        this.VendorViewable = VendorViewable;
        this.SentTo = SentTo;
        this.Priority = Priority;
        this.LastModDate = LastModDate;
        this.LastModBy = LastModBy;
        this.SysTimeStamp = SysTimeStamp;
        this.Inactive = Inactive;
    }
    return NotesModelClass;
})();
//# sourceMappingURL=notes.component.js.map