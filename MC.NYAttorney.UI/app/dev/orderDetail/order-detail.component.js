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
/// <reference path="../common/utility.ts" />
var core_1 = require('@angular/core');
var app_config_1 = require('../app-config');
var router_deprecated_1 = require('@angular/router-deprecated');
var reference_data_service_1 = require('../referenceData/reference-data.service');
var notifications_component_1 = require('../notifications/notifications.component');
var logging_1 = require('../common/logging');
var order_detail_model_1 = require('./order-detail.model');
var order_detail_service_1 = require('./order-detail.service');
var grid_component_1 = require('../grid/grid.component');
var column_1 = require('../grid/column');
var utility_1 = require('../common/utility');
var account_profile_service_1 = require('../accountProfile/account-profile.service');
var left_navigation_component_1 = require('../common/left-navigation.component');
var header_detail_component_1 = require('../common/header-detail.component');
var customLocalStorage_1 = require('../common/customLocalStorage');
var enumerations_1 = require("../common/enumerations");
var OrderDetailComponent = (function () {
    function OrderDetailComponent(_orderService, _referenceData, _accountProfileService, _routeParams, _router, _logservice, _appConfig) {
        this.model = new order_detail_model_1.OrderDetail();
        this.utitlity = new utility_1.Utility();
        this.partyModel = new Party();
        this.isAddBorrowerLink = false;
        this.isAddBorrowerPanel = false;
        this.isBorrowerGrid = false;
        this.isEditMode = false;
        this.currentCollapsable = 1;
        this.utility = new utility_1.Utility();
        this.maxSeq = -1;
        this.ShowPartyDiv = 0;
        this.isRowEdited = false;
        this.borrowerCount = 0;
        this.OrderNo = "";
        this.OrderSource = "";
        this.LoanNo = "";
        this.ResidentType = "";
        this.NumberofUnits = "";
        this.YearPropertyAcquired = "";
        this.LoanCategory = null;
        this.LoanAmount = null;
        this.LoanRate = "";
        this.LoanTerm = "";
        this.LoanType = "";
        this.RateLockDate = ""; //Convert to date
        this.AnticipatedSettlementDate = ""; //convert to date
        this.EnteredBy = "";
        this.loanPurpose = "";
        this.screenName = "OrderDetail";
        this.displayBorrowerSSN = "";
        this.displayBorrowerPhone = "";
        this.displayBorrowerCell = "";
        this.displayAmount = "";
        this.isValidPropertyAcquiredDate = true;
        this.isValidRateLockDate = true;
        this.isValidAnticipatedSettlementDate = true;
        this.httpService = _orderService;
        this.referenceDataService = _referenceData;
        this.routeParams = _routeParams;
        this.router = _router;
        var orderNo = +this.routeParams.get("orderno");
        this.model.OrderMaster.OrderNo = orderNo.toString();
        this.accountProfileService = _accountProfileService;
        this.clientTab = enumerations_1.enmTabs.OrderDetail;
        this.logService = _logservice;
        this.maritalStatuses = [];
        this.appConfig = _appConfig;
    }
    OrderDetailComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.loadDatePicker();
        this.populateMaritalStatus();
        this.populatePartyType();
        this.populateMortgageType();
        this.populateResidentType();
        this.populateLoanPurpose();
        this.populateLoanProductTypes();
        this.getOrderDetails();
        if (JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName)) == null)
            this.accountProfileService.getPermissionsAgainstRole(this.screenName)
                .subscribe(function (data) {
                customLocalStorage_1.CustomLocalStorage.setItem(_this.screenName, JSON.stringify(data));
                _this.loadRolesAndPermissions(data);
            }, function (error) { return _this.logService.log(error); });
        else
            this.loadRolesAndPermissions(JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName)));
    };
    OrderDetailComponent.prototype.loadRolesAndPermissions = function (data) {
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
        this.borrowerGridColumns = this.getBorrowerGridColumns();
        var obj = JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName));
        for (var index in obj) {
            if (obj[index]["Parent"] == "OrderDetailBorrowerGrid") {
                if (!obj[index]["IsVisible"])
                    this.findAndRemove(this.borrowerGridColumns, "name", obj[index]["CtrlName"]);
            }
        }
    };
    OrderDetailComponent.prototype.populateMaritalStatus = function () {
        var _this = this;
        this.child.showLoader();
        this.httpService.getMaritalStatus()
            .subscribe(function (data) { return _this.loadMaritalStatus(data); }, function (error) {
            _this.child.hideLoader();
            _this.child.showErrorNotification("error in Marital Status DropDown call", "Error !");
        }, function () { return _this.logService.log("Marital Status loaded Successfully!"); });
    };
    OrderDetailComponent.prototype.getOrderDetails = function () {
        var _this = this;
        this.child.showLoader();
        this.httpService.getOrderDetails(this.model.OrderMaster.OrderNo)
            .subscribe(function (data) { return _this.loadOrderDetails(data); }, function (error) {
            _this.child.hideLoader();
            _this.child.showErrorNotification("error in Marital Status DropDown call", "Error !");
        }, function () { return _this.logService.log("Marital Status loaded Successfully!"); });
    };
    OrderDetailComponent.prototype.populateLoanPurpose = function () {
        var _this = this;
        this.child.showLoader();
        this.referenceDataService.getddlType('LenderLoanType')
            .subscribe(function (data) { return _this.loadLoanPurpose(data); }, function (error) { _this.child.hideLoader(); _this.child.showErrorNotification("error in Loan Purpose DropDown call", "Error !"); }, function () { return _this.logService.log("Loan Purpose loaded Successfully!"); });
    };
    OrderDetailComponent.prototype.loadLoanPurpose = function (data) {
        this.child.hideLoader();
        this.loanPurposes = data;
    };
    OrderDetailComponent.prototype.populateLoanProductTypes = function () {
        var _this = this;
        this.referenceDataService.getddlType('LoanProductType')
            .subscribe(function (data) { return _this.loadLoanProductTypes(data); }, function (error) {
            _this.child.hideLoader();
            _this.child.showErrorNotification(": error in Loan Product Type DropDown call", "Error !");
        }, function () { return _this.logService.log("Loan Product Types loaded Successfully!"); });
    };
    OrderDetailComponent.prototype.loadLoanProductTypes = function (data) {
        this.child.hideLoader();
        this.loanProductTypes = data;
    };
    OrderDetailComponent.prototype.loadOrderDetails = function (data) {
        this.child.hideLoader();
        this.model.PartyList = data.PartyList == null ? [] : data.PartyList; //data.PartyList;
        if (this.model.PartyList.length == 0) {
            this.maxSeq = 1;
        }
        else {
            this.maxSeq = data.PartyList[data.PartyList.length - 1].SequenceNo + 1;
        }
        this.model.OrderMaster = data.OrderMaster;
        this.model.OrderMaster.NonOwnerOccupied = data.OrderMaster.NonOwnerOccupied == true ? "true" : "false";
        this.mortgageType = this.model.OrderMaster.LoanCategory;
        this.model.OrderMaster.AnticipatedSettlementDate = this.model.OrderMaster.AnticipatedSettlementDate == null ? "" : (moment.utc(this.model.OrderMaster.AnticipatedSettlementDate).format('MM/DD/YYYY'));
        this.model.OrderMaster.RateLockDate = this.model.OrderMaster.RateLockDate == null ? "" : (moment.utc(this.model.OrderMaster.RateLockDate).format('MM/DD/YYYY'));
        this.model.OrderMaster.PropertyAcquiredDate = this.model.OrderMaster.PropertyAcquiredDate == null ? "" : (moment.utc(this.model.OrderMaster.PropertyAcquiredDate).format('MM/DD/YYYY'));
        this.displayAmount = this.utility.formatAmount(this.model.OrderMaster.LoanAmount, "$");
    };
    OrderDetailComponent.prototype.loadMaritalStatus = function (data) {
        this.child.hideLoader();
        this.maritalStatuses = data;
    };
    OrderDetailComponent.prototype.populatePartyType = function () {
        var _this = this;
        this.child.showLoader();
        this.referenceDataService.getddlType('PartyType')
            .subscribe(function (data) { return _this.loadPartyType(data); }, function (error) {
            _this.child.hideLoader();
            _this.child.showErrorNotification("error in Party Types DropDown call", "Error !");
        }, function () { return _this.logService.log("Party Types loaded Successfully!"); });
    };
    OrderDetailComponent.prototype.loadPartyType = function (data) {
        this.child.hideLoader();
        this.partyTypes = data;
    };
    OrderDetailComponent.prototype.populateMortgageType = function () {
        var _this = this;
        this.child.showLoader();
        this.referenceDataService.getddlType('HUDLoanType')
            .subscribe(function (data) { return _this.loadMortgageType(data); }, function (error) {
            _this.child.hideLoader();
            _this.child.showErrorNotification("error in Mortgage Types DropDown call", "Error");
        }, function () { return _this.logService.log("Mortgage Types loaded Successfully!"); });
    };
    OrderDetailComponent.prototype.loadMortgageType = function (data) {
        this.child.hideLoader();
        this.mortgageTypes = data;
    };
    OrderDetailComponent.prototype.populateResidentType = function () {
        var _this = this;
        this.child.showLoader();
        this.referenceDataService.getddlType('ResidenceType')
            .subscribe(function (data) { return _this.loadResidentType(data); }, function (error) {
            _this.child.hideLoader();
            _this.child.showErrorNotification("error in Resident Types DropDown call", "Error !");
        }, function () { return _this.logService.log("REsident Types loaded Successfully!"); });
    };
    OrderDetailComponent.prototype.loadResidentType = function (data) {
        this.child.hideLoader();
        this.residentTypes = data;
        this.residentType = "Please Select";
    };
    OrderDetailComponent.prototype.ClearParty = function () {
        this.partyModel = new Party();
        this.isRowEdited = false;
        this.displayBorrowerPhone = "";
        this.displayBorrowerCell = "";
        this.displayBorrowerSSN = "";
    };
    OrderDetailComponent.prototype.redirectToSummary = function () {
        this.router.navigate(['OrderSummary', { orderno: this.model.OrderMaster.OrderNo }]);
    };
    OrderDetailComponent.prototype.Clear = function () {
        this.model = new order_detail_model_1.OrderDetail();
        var orderNo = +this.routeParams.get("orderno");
        this.model.OrderMaster.OrderNo = orderNo.toString();
        this.getOrderDetails();
        this.mortgageType = "Please Select";
        this.residentType = "Please Select";
        this.ClearParty();
    };
    OrderDetailComponent.prototype.deleteBorrowerRow = function (model) {
        var strconfirm = confirm("Are you sure you want to delete?");
        if (strconfirm == true) {
            this.findAndRemove(this.model.PartyList, 'BorrowerId', model.BorrowerId);
            var jsonTempList = JSON.parse(JSON.stringify(this.model.PartyList));
            this.model.PartyList = JSON.parse(JSON.stringify(jsonTempList));
            if (this.model.PartyList.length == 0) {
                this.maxSeq = 1;
            }
            else {
                this.maxSeq = this.model.PartyList[this.model.PartyList.length - 1].SequenceNo + 1;
            }
            this.ToggleAddBorrower(false);
        }
    };
    OrderDetailComponent.prototype.findAndRemove = function (array, property, value) {
        array.forEach(function (result, index) {
            if (result[property] === value) {
                //Remove from array
                array.splice(index, 1);
            }
        });
    };
    OrderDetailComponent.prototype.getBorrowerGridColumns = function () {
        return [
            new column_1.Column('Type', 'Party Type'),
            new column_1.Column('FullName', 'Name'),
            new column_1.Column('HomePhone', 'Home Phone'),
            new column_1.Column('CellPhone', 'Cell Phone'),
            new column_1.Column('MaritalStatusText', 'Marital Status'),
            new column_1.Column('Email', 'Email'),
            new column_1.Column('EditOnly', ''),
            new column_1.Column('DeleteOnly', '')
        ];
    };
    OrderDetailComponent.prototype.findItem = function (array, property, value) {
        for (var index = 0; index < array.length; index++) {
            if (array[index][property] === value) {
                return index;
            }
        }
        return -1;
    };
    OrderDetailComponent.prototype.OnAddBorrower = function () {
        var _this = this;
        var indexFirstName;
        var indexLastName;
        var index;
        index = this.findItem(this.model.PartyList, 'BorrowerId', this.partyModel.BorrowerId);
        indexFirstName = this.findItem(this.model.PartyList, 'FullName', this.partyModel.FirstName);
        indexLastName = this.findItem(this.model.PartyList, 'FullName', this.partyModel.LastName);
        if (indexFirstName !== -1 && indexLastName !== -1 && !this.isRowEdited) {
            this.child.showErrorNotification('Borrower already added in list', 'Error!');
            return;
        }
        if (this.partyModel.HomePhone == "--")
            this.partyModel.HomePhone = "";
        if (this.partyModel.CellPhone == "--")
            this.partyModel.CellPhone = "";
        if (this.partyModel.SSN == "--")
            this.partyModel.SSN = "";
        var pattern = /^\d{3}-\d{3}-\d{4}$/g;
        if (this.partyModel.HomePhone !== null && this.partyModel.HomePhone !== "" && pattern.test(this.partyModel.HomePhone) == false) {
            alert('Invalid Phone');
            return;
        }
        pattern = /^\d{3}-\d{3}-\d{4}$/g;
        if (this.partyModel.CellPhone !== null && this.partyModel.CellPhone !== "" && pattern.test(this.partyModel.CellPhone) == false) {
            alert('Invalid Cell');
            return;
        }
        pattern = /^\d{3}-\d{2}-\d{4}$/g;
        if (this.partyModel.SSN !== null && this.partyModel.SSN !== "" && pattern.test(this.partyModel.SSN) == false) {
            alert('Invalid SSN');
            return;
        }
        pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        if (this.partyModel.Email !== null && this.partyModel.Email !== "" && pattern.test(this.partyModel.Email) == false) {
            alert('Invalid Email');
            return;
        }
        if (this.isRowEdited == false) {
            this.borrowerCount = this.borrowerCount + 1;
            this.partyModel.BorrowerId = (0 - this.borrowerCount);
        }
        this.partyModel.OrderSource = "Website";
        this.partyModel.EnteredBy = this.utitlity.getContactId();
        this.partyModel.LastModBy = this.utitlity.getContactId();
        this.partyModel.FullName = this.partyModel.Type == "Borrower" ? (this.partyModel.FirstName + ' ' + this.partyModel.LastName) : this.partyModel.LastName;
        var obj;
        obj = this.partyModel;
        obj.MaritalStatusText = this.getMaritalStatusText(this.partyModel.MaritalStatusId);
        obj.OrderNo = this.model.OrderMaster.OrderNo;
        if (obj.BorrowerId < 0) {
            obj.SequenceNo = this.maxSeq++;
        }
        if (this.isRowEdited == false) {
            this.model.PartyList.push(obj);
        }
        else {
            this.model.PartyList[index] = obj;
        }
        var jsonTempList = JSON.parse(JSON.stringify(this.model.PartyList));
        this.model.PartyList = JSON.parse(JSON.stringify(jsonTempList));
        this.ToggleAddBorrower(false);
        this.model.OrderMaster.OrderSource = "WebSite";
        this.model.OrderMaster.EnteredBy = this.utitlity.getContactId(); //"username";
        this.httpService.saveOrderDeatil(this.model)
            .subscribe(function (data) { return _this.saveHandler(data); }, function (error) {
            _this.child.showSaveErrorNotification();
            _this.child.hideLoader();
        }, function () { return _this.logService.log("API Call Finished Successfully!"); });
    };
    OrderDetailComponent.prototype.getMaritalStatusText = function (id) {
        for (var i = 0; i < this.maritalStatuses.length; i++) {
            if (id == this.maritalStatuses[i].Id) {
                return this.maritalStatuses[i].StatusCode;
            }
        }
    };
    OrderDetailComponent.prototype.OnSaveClick = function () {
        var _this = this;
        if (this.model.OrderMaster.NonOwnerOccupied == "null") {
            alert("Please select Resident Type");
        }
        else if (this.model.OrderMaster.LoanCategory == "null") {
            alert("Please select Mortgage Type");
        }
        else {
            this.model.OrderMaster.PropertyAcquiredDate = jQuery("#PropertyAcquiredDate").val();
            this.model.OrderMaster.RateLockDate = jQuery("#RateLockDate").val();
            this.model.OrderMaster.AnticipatedSettlementDate = jQuery("#AnticipatedSettlementDate").val();
            this.model.OrderMaster.OrderSource = "WebSite";
            this.model.OrderMaster.EnteredBy = this.utitlity.getContactId(); //"username";
            this.httpService.saveOrderDeatil(this.model)
                .subscribe(function (data) { return _this.saveHandler(data); }, function (error) {
                _this.child.showSaveErrorNotification();
                _this.child.hideLoader();
            }, function () { return _this.logService.log("API Call Finished Successfully!"); });
        }
    };
    //Masking Start
    OrderDetailComponent.prototype.blurPhone = function (sender) {
        //this.partyModel.HomePhone = sender.target.value;
        if (this.displayBorrowerPhone !== null && this.displayBorrowerPhone !== "") {
            this.displayBorrowerPhone = sender.target.value;
            this.displayBorrowerPhone = this.displayBorrowerPhone.substr(0, 12);
            this.partyModel.HomePhone = this.displayBorrowerPhone;
            this.displayBorrowerPhone = this.utility.formatPhoneCell(this.displayBorrowerPhone);
        }
        else
            this.partyModel.HomePhone = null;
    };
    OrderDetailComponent.prototype.focusPhone = function (sender) {
        if (this.partyModel.HomePhone !== null) {
            this.displayBorrowerPhone = this.partyModel.HomePhone;
        }
        else
            this.displayBorrowerPhone = "";
        ApplyMask();
    };
    OrderDetailComponent.prototype.blurCell = function (sender) {
        //this.partyModel.CellPhone = sender.target.value;
        if (this.displayBorrowerCell !== null && this.displayBorrowerCell !== "") {
            this.displayBorrowerCell = sender.target.value;
            this.displayBorrowerCell = this.displayBorrowerCell.substr(0, 12);
            this.partyModel.CellPhone = this.displayBorrowerCell;
            this.displayBorrowerCell = this.utility.formatPhoneCell(this.displayBorrowerCell);
        }
        else
            this.partyModel.CellPhone = null;
    };
    OrderDetailComponent.prototype.focusCell = function (sender) {
        if (this.partyModel.CellPhone !== null) {
            this.displayBorrowerCell = this.partyModel.CellPhone;
        }
        else
            this.displayBorrowerCell = "";
        ApplyMask();
    };
    OrderDetailComponent.prototype.blurSSN = function (sender) {
        if (this.displayBorrowerSSN !== null && this.displayBorrowerSSN !== "") {
            this.displayBorrowerSSN = sender.target.value;
            this.displayBorrowerSSN = this.displayBorrowerSSN.substr(0, 11);
            this.partyModel.SSN = this.displayBorrowerSSN;
            this.displayBorrowerSSN = this.displayBorrowerSSN.replace(this.displayBorrowerSSN.substring(0, this.displayBorrowerSSN.lastIndexOf("-") + 1), "***-**-");
        }
        else
            this.partyModel.SSN = null;
    };
    OrderDetailComponent.prototype.focusSSN = function (sender) {
        if (this.partyModel.SSN !== null) {
            this.displayBorrowerSSN = this.partyModel.SSN;
        }
        else
            this.displayBorrowerSSN = "";
        ApplyMask();
    };
    OrderDetailComponent.prototype.ShowParty = function () {
        this.ShowPartyDiv = 1;
    };
    OrderDetailComponent.prototype.PartyTypeChanged = function (event) {
        this.partyModel.Type = event.target.value;
        this.ClearParty();
    };
    OrderDetailComponent.prototype.editPartyRow = function (row) {
        this.ToggleAddBorrower(true);
        this.isRowEdited = true;
        this.partyModel = jQuery.extend({}, row);
        this.displayBorrowerPhone = row.HomePhone;
        if (this.partyModel.HomePhone !== null && this.partyModel.HomePhone !== "" && this.partyModel.HomePhone.indexOf("-") < 0)
            this.partyModel.HomePhone = row.HomePhone.substring(0, 3) + "-" + row.HomePhone.substring(3, 6) + "-" + row.HomePhone.substr(6);
        this.displayBorrowerCell = row.CellPhone;
        if (this.partyModel.CellPhone !== null && this.partyModel.CellPhone !== "" && this.partyModel.CellPhone.indexOf("-") < 0)
            this.partyModel.CellPhone = row.CellPhone.substring(0, 3) + "-" + row.CellPhone.substring(3, 6) + "-" + row.CellPhone.substr(6);
        this.displayBorrowerSSN = row.SSN;
        if (this.displayBorrowerSSN !== null && this.displayBorrowerSSN !== "") {
            if (this.partyModel.SSN !== null && this.partyModel.SSN.indexOf("-") < 0)
                this.partyModel.SSN = row.SSN.substring(0, 3) + "-" + row.SSN.substring(3, 5) + "-" + row.SSN.substr(5);
            this.displayBorrowerSSN = this.partyModel.SSN.replace(this.partyModel.SSN.substring(0, this.partyModel.SSN.lastIndexOf("-") + 1), "***-**-");
        }
    };
    OrderDetailComponent.prototype.saveHandler = function (data) {
        if (!data)
            this.child.showErrorNotification('Order creation failed', 'Error!');
        else {
            this.child.showSaveSuccessNotification();
            this.headerChild.getOrderHeader();
            this.Clear();
        }
    };
    OrderDetailComponent.prototype.ToggleAddBorrower = function (isEnableVisible) {
        this.isAddBorrowerLink = isEnableVisible;
        this.isAddBorrowerPanel = isEnableVisible;
        this.isBorrowerGrid = !isEnableVisible;
        this.isEditMode = false;
        this.ClearParty();
    };
    OrderDetailComponent.prototype.CancelAddParty = function () {
        this.ClearParty();
        this.ToggleAddBorrower(false);
    };
    OrderDetailComponent.prototype.blurLoanAmount = function (sender) {
        if (this.displayAmount !== null && this.displayAmount !== "") {
            this.displayAmount = sender.target.value;
            if (this.utility.containsDecimal(this.displayAmount)) {
                this.model.OrderMaster.LoanAmount = parseInt(this.displayAmount.replace(",", "").replace(" ", "").replace("$", ""));
                this.displayAmount = this.utility.formatAmount(this.model.OrderMaster.LoanAmount, "$");
            }
            else {
                this.displayAmount = "";
                this.model.OrderMaster.LoanAmount = null;
            }
        }
        else
            this.model.OrderMaster.LoanAmount = null;
    };
    OrderDetailComponent.prototype.focusLoanAmount = function (sender) {
        if (this.model.OrderMaster.LoanAmount !== null)
            this.displayAmount = this.model.OrderMaster.LoanAmount.toString();
        else
            this.displayAmount = "";
    };
    OrderDetailComponent.prototype.loadDatePicker = function () {
        var _this = this;
        setTimeout(function (x) {
            jQuery('.date')
                .datepicker().unbind('blur')
                .blur(function (y) { _this.datehandler(y); });
        }, 500);
    };
    OrderDetailComponent.prototype.datehandler = function (d) {
        var dateRegex = this.appConfig.DateRegex;
        if (!dateRegex.test(d.target.value) && d.target.value !== '') {
            //d.target.focus()
            d.target.value = '';
            this.setDateErrorMsg(d.target.id, false);
        }
        else {
            this.setDateErrorMsg(d.target.id, true);
        }
    };
    OrderDetailComponent.prototype.setDateErrorMsg = function (id, status) {
        if (id == 'PropertyAcquiredDate')
            this.isValidPropertyAcquiredDate = status;
        else if (id == 'RateLockDate')
            this.isValidRateLockDate = status;
        else if (id == 'AnticipatedSettlementDate')
            this.isValidAnticipatedSettlementDate = status;
    };
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], OrderDetailComponent.prototype, "child", void 0);
    __decorate([
        core_1.ViewChild(header_detail_component_1.HeaderDetailComponent)
    ], OrderDetailComponent.prototype, "headerChild", void 0);
    OrderDetailComponent = __decorate([
        core_1.Component({
            selector: 'order-detail',
            templateUrl: '../dev/tpl/order-detail.html',
            directives: [grid_component_1.GridComponent, notifications_component_1.NotificationsComponent, left_navigation_component_1.LeftNavigationComponent, header_detail_component_1.HeaderDetailComponent],
            providers: [core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }), reference_data_service_1.ReferenceDataService, order_detail_service_1.OrderDetailService, account_profile_service_1.AccountProfileService, logging_1.LoggingService]
        }),
        __param(0, core_1.Inject(order_detail_service_1.OrderDetailService)),
        __param(1, core_1.Inject(reference_data_service_1.ReferenceDataService)),
        __param(2, core_1.Inject(account_profile_service_1.AccountProfileService)),
        __param(3, core_1.Inject(router_deprecated_1.RouteParams)),
        __param(4, core_1.Inject(router_deprecated_1.Router)),
        __param(5, core_1.Inject(logging_1.LoggingService)),
        __param(6, core_1.Inject(app_config_1.APP_CONFIG))
    ], OrderDetailComponent);
    return OrderDetailComponent;
}());
exports.OrderDetailComponent = OrderDetailComponent;
var Party = (function () {
    function Party(OrderSource, EnteredBy, LastModBy, Type, FullName, FirstName, LastName, SequenceNo, HomePhone, CellPhone, Email, SSN, MaritalStatusId, MaritalStatusText, OrderNo, BorrowerId) {
        if (OrderSource === void 0) { OrderSource = "Website"; }
        if (EnteredBy === void 0) { EnteredBy = ""; }
        if (LastModBy === void 0) { LastModBy = ""; }
        if (Type === void 0) { Type = "Borrower"; }
        if (FullName === void 0) { FullName = ""; }
        if (FirstName === void 0) { FirstName = ""; }
        if (LastName === void 0) { LastName = ""; }
        if (SequenceNo === void 0) { SequenceNo = 0; }
        if (HomePhone === void 0) { HomePhone = ""; }
        if (CellPhone === void 0) { CellPhone = ""; }
        if (Email === void 0) { Email = ""; }
        if (SSN === void 0) { SSN = ""; }
        if (MaritalStatusId === void 0) { MaritalStatusId = 0; }
        if (MaritalStatusText === void 0) { MaritalStatusText = ""; }
        if (OrderNo === void 0) { OrderNo = ""; }
        if (BorrowerId === void 0) { BorrowerId = -1; }
        this.OrderSource = OrderSource;
        this.EnteredBy = EnteredBy;
        this.LastModBy = LastModBy;
        this.Type = Type;
        this.FullName = FullName;
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.SequenceNo = SequenceNo;
        this.HomePhone = HomePhone;
        this.CellPhone = CellPhone;
        this.Email = Email;
        this.SSN = SSN;
        this.MaritalStatusId = MaritalStatusId;
        this.MaritalStatusText = MaritalStatusText;
        this.OrderNo = OrderNo;
        this.BorrowerId = BorrowerId;
    }
    return Party;
}());
exports.Party = Party;
//# sourceMappingURL=order-detail.component.js.map