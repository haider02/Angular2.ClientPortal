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
var state_component_1 = require('../DropDowns/state/state.component');
var city_component_1 = require('../DropDowns/city/city.component');
var county_component_1 = require('../DropDowns/county/county.component');
var city_service_1 = require('../DropDowns/city/city.service');
var reference_data_service_1 = require('../referenceData/reference-data.service');
var logging_1 = require('../common/logging');
var order_entry_model_1 = require('./order-entry.model');
var order_entry_service_1 = require('./order-entry.service');
var notifications_component_1 = require('../notifications/notifications.component');
var customLocalStorage_1 = require('../common/customLocalStorage');
var grid_component_1 = require('../grid/grid.component');
var column_1 = require('../grid/column');
var utility_1 = require('../common/utility');
var account_profile_service_1 = require('../accountProfile/account-profile.service');
var OrderEntryComponent = (function () {
    function OrderEntryComponent(_appConfig, _referenceData, _routeParams, _router, _service, _accountProfileService, _logservice) {
        this.states = ['Alabama', 'Arizona', 'California', 'Colorado', 'Delaware'];
        this.cities = ['Lead', 'Recruite', 'Vendor'];
        this.model = new ClientClass();
        this.emailFound = false;
        this.submitted = false;
        this.cancelClick = false;
        this.selectedState = "";
        this.emailOrPhoneEmpty = true;
        this.utility = new utility_1.Utility();
        this.isPhoneEmpty = true;
        this.isPhoneDuplicate = true;
        this.isEmailEmpty = true;
        this.isEmailDuplicate = true;
        this.modelOrderEntryFetch = new order_entry_model_1.OrderEntryRequest();
        this.modelOrderEntrySave = new order_entry_model_1.OrderEntryDetailRequest();
        this.active = true;
        this.streetNo = "";
        this.streetName = "";
        this.Address2 = "";
        this.amount = null;
        this.loanNumber = "";
        this.borrowerFirstName = "";
        this.borrowerLastName = "";
        this.borrowerPhone = "";
        this.borrowerCell = "";
        this.borrowerEmail = "";
        this.borrowerSSN = "";
        this.instructions = "";
        this.transactionTypeList = new Array();
        this.borrowerList = new Array();
        this.selectedCounty = "";
        this.selectedCity = "";
        this.clientList = new Array();
        this.isAddBorrowerLink = false;
        this.isAddBorrowerPanel = false;
        this.isBorrowerGrid = false;
        this.isEditMode = false;
        this.borrowerId = 0;
        this.borrowerCount = 0;
        this.currentCollapsable = 1;
        this.screenName = "OrderEntry";
        this.displayBorrowerSSN = "";
        this.displayBorrowerPhone = "";
        this.displayBorrowerCell = "";
        this.displayAmount = "";
        this.appConfig = _appConfig;
        this.referenceDataService = _referenceData;
        this.accountProfileService = _accountProfileService;
        this.httpService = _service;
        this.router = _router;
        this.routeParams = _routeParams;
        this.model = new ClientClass();
        this.logService = _logservice;
    }
    OrderEntryComponent.prototype.ngOnInit = function () {
        this.transactionTypeGridColumns = this.getTransactionTypeGridColumns();
    };
    OrderEntryComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.populateTransactionType();
        this.populatePropertyType();
        this.populateLoanType();
        this.populateMaritalStatus();
        this.populateClients();
        if (JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName)) == null)
            this.accountProfileService.getPermissionsAgainstRole(this.screenName)
                .subscribe(function (data) {
                customLocalStorage_1.CustomLocalStorage.setItem(_this.screenName, JSON.stringify(data));
                _this.loadRolesAndPermissions(data);
            }, function (error) { return _this.logService.log(error); });
        else
            this.loadRolesAndPermissions(JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName)));
    };
    OrderEntryComponent.prototype.loadRolesAndPermissions = function (data) {
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
            if (obj[index]["Parent"] == "OrderEntryBorrowerGrid") {
                if (!obj[index]["IsVisible"])
                    this.findAndRemove(this.borrowerGridColumns, "name", obj[index]["CtrlName"]);
            }
        }
    };
    OrderEntryComponent.prototype.findItem = function (array, property, value) {
        for (var index = 0; index < array.length; index++) {
            if (array[index][property] === value) {
                return index;
            }
        }
        return -1;
    };
    OrderEntryComponent.prototype.findAndRemove = function (array, property, value) {
        array.forEach(function (result, index) {
            if (result[property] === value) {
                //Remove from array
                array.splice(index, 1);
            }
        });
    };
    OrderEntryComponent.prototype.getCurrentDateTime = function () {
        return moment().format('MM/DD/YYYY HH:mm');
    };
    OrderEntryComponent.prototype.getCurrentUserID = function () {
        var contactId = this.utility.getContactId();
        if (contactId !== null)
            return contactId;
        return null;
    };
    OrderEntryComponent.prototype.getClientID = function () {
        var clientId = this.utility.getClientId();
        if (clientId !== null) {
            this.modelOrderEntryFetch.ClientID = clientId;
            return this.modelOrderEntryFetch.ClientID;
        }
        return null;
    };
    OrderEntryComponent.prototype.selectedStateValue = function (selectedState) {
        this.logService.log(selectedState);
        this.selectedState = selectedState;
        this.model.state = selectedState;
        this.model.city = '';
    };
    OrderEntryComponent.prototype.SaveLeadEntry = function () {
        this.child.showLoader();
        jQuery("#cancel").prop('disabled', true);
        jQuery("#btnAdd").prop('disabled', true);
        this.successMessageDisplay = true;
    };
    OrderEntryComponent.prototype.onSubmit = function () {
        if (this.cancelClick == false) {
            if (this.isEmailEmpty == true && this.isPhoneEmpty == true) {
                this.emailOrPhoneEmpty = false;
                return;
            }
            this.emailOrPhoneEmpty = true;
            this.submitted = true;
            if (this.isEmailEmpty == false && this.isEmailDuplicate == true) {
                this.child.showWarningNotification('Duplicate Email Address, please enter different Email Address', 'Warning!');
                return;
            }
            if (this.isPhoneEmpty == false && this.isPhoneDuplicate == true) {
                this.child.showWarningNotification('Duplicate Phone, please enter different Phone', 'Warning!');
                return;
            }
            this.SaveLeadEntry();
        }
        else {
            this.cancelClick = false;
        }
    };
    OrderEntryComponent.prototype.Clear = function () {
        var _this = this;
        this.modelOrderEntryFetch = new order_entry_model_1.OrderEntryRequest();
        this.modelOrderEntrySave = new order_entry_model_1.OrderEntryDetailRequest();
        this.model = new ClientClass();
        this.transactionTypeList = new Array();
        this.borrowerList = new Array();
        this.tranType = "Please Select";
        this.propType = "Please Select";
        this.loanType = "Please Select";
        this.lenderId = 0;
        this.contactNames = null;
        this.displayAmount = "";
        this.streetNo = "";
        this.streetName = "";
        this.Address2 = "";
        this.loanType = "";
        this.amount = null;
        this.loanNumber = "";
        this.instructions = "";
        this.contactType = "Please Select";
        this.contactName = "Please Select";
        this.borrowerFirstName = "";
        this.borrowerLastName = "";
        this.borrowerPhone = "";
        this.borrowerCell = "";
        this.borrowerEmail = "";
        this.borrowerSSN = "";
        this.maritalStatus = "Please Select";
        this.active = false;
        setTimeout(function () { return _this.active = true; }, 0);
    };
    OrderEntryComponent.prototype.getVendorTypes = function (data) {
        this.vendorTypes = data;
        this.child.hideLoader();
    };
    OrderEntryComponent.prototype.GetCityAndState = function (data) {
        var _this = this;
        if (data !== null && data !== '' && data !== undefined) {
            this.child.showLoader();
            this.httpService.getStateCountyByZip(data)
                .subscribe(function (data) { return _this.getStateCountyByZip(data); }, function (error) {
                _this.child.hideLoader();
                _this.logService.log(error);
            }, function () { return _this.logService.log("API Call Finished Successfully!"); });
        }
    };
    OrderEntryComponent.prototype.getStateCountyByZip = function (data) {
        this.child.hideLoader();
        if (data) {
            this.model.state = data[0].StateAbbr;
            this.model.city = data[0].CityName;
            this.model.county = data[0].CountyName;
            this.logService.log(data);
        }
    };
    OrderEntryComponent.prototype.GetCitiesbyState = function (data) {
        this.filterCities = data;
    };
    OrderEntryComponent.prototype.GetCountybyState = function (data) {
        this.filtercounties = data;
    };
    OrderEntryComponent.prototype.selectedCountyValue = function (selectedCounty) {
        this.logService.log(selectedCounty);
        this.selectedCounty = selectedCounty;
        this.model.county = selectedCounty;
    };
    OrderEntryComponent.prototype.selectedCityValue = function (selectedCity) {
        this.logService.log(selectedCity);
        this.selectedCity = selectedCity;
        this.model.city = selectedCity;
    };
    OrderEntryComponent.prototype.IsPhoneDuplicate = function (phone) {
        if (phone !== null && phone !== '' && phone !== undefined) {
            this.isPhoneEmpty = false;
        }
        else
            this.isPhoneEmpty = true;
    };
    OrderEntryComponent.prototype.successGetPhone = function (data) {
        this.isPhoneDuplicate = data;
    };
    OrderEntryComponent.prototype.IsEmailDuplicate = function (emailAddress) {
        if (emailAddress !== null && emailAddress !== '' && emailAddress !== undefined) {
            this.isEmailEmpty = false;
        }
        else
            this.isEmailEmpty = true;
    };
    OrderEntryComponent.prototype.successGetEmail = function (data) {
        this.isEmailDuplicate = data;
    };
    OrderEntryComponent.prototype.ConfirmCancel = function () {
        this.cancelClick = true;
        if (confirm("Are you sure you want to discard these changes?"))
            this.Clear();
    };
    OrderEntryComponent.prototype.blurPhone = function (sender) {
        if (this.displayBorrowerPhone !== null && this.displayBorrowerPhone !== "") {
            this.displayBorrowerPhone = sender.target.value;
            this.displayBorrowerPhone = this.displayBorrowerPhone.substr(0, 12);
            this.borrowerPhone = this.displayBorrowerPhone;
            this.displayBorrowerPhone = this.utility.formatPhoneCell(this.displayBorrowerPhone);
        }
        else
            this.borrowerPhone = null;
    };
    OrderEntryComponent.prototype.focusPhone = function (sender) {
        if (this.borrowerPhone !== null)
            this.displayBorrowerPhone = this.borrowerPhone;
        else
            this.displayBorrowerPhone = "";
        ApplyMask();
    };
    OrderEntryComponent.prototype.blurCell = function (sender) {
        if (this.displayBorrowerCell !== null && this.displayBorrowerCell !== "") {
            this.displayBorrowerCell = sender.target.value;
            this.displayBorrowerCell = this.displayBorrowerCell.substr(0, 12);
            this.borrowerCell = this.displayBorrowerCell;
            this.displayBorrowerCell = this.utility.formatPhoneCell(this.displayBorrowerCell);
        }
        else
            this.borrowerCell = null;
    };
    OrderEntryComponent.prototype.focusCell = function (sender) {
        if (this.borrowerCell !== null)
            this.displayBorrowerCell = this.borrowerCell;
        else
            this.displayBorrowerCell = "";
        ApplyMask();
    };
    OrderEntryComponent.prototype.blurSSN = function (sender) {
        if (this.displayBorrowerSSN !== null && this.displayBorrowerSSN !== "") {
            this.displayBorrowerSSN = sender.target.value;
            this.displayBorrowerSSN = this.displayBorrowerSSN.substr(0, 11);
            this.borrowerSSN = this.displayBorrowerSSN;
            this.displayBorrowerSSN = this.displayBorrowerSSN.replace(this.displayBorrowerSSN.substring(0, this.displayBorrowerSSN.lastIndexOf("-") + 1), "***-**-");
        }
        else
            this.borrowerSSN = null;
    };
    OrderEntryComponent.prototype.focusSSN = function (sender) {
        if (this.borrowerSSN !== null)
            this.displayBorrowerSSN = this.borrowerSSN;
        else
            this.displayBorrowerSSN = "";
        ApplyMask();
    };
    OrderEntryComponent.prototype.blurLoanAmount = function (sender) {
        if (this.displayAmount !== null && this.displayAmount !== "") {
            this.displayAmount = sender.target.value;
            if (this.utility.containsDecimal(this.displayAmount)) {
                this.amount = parseInt(this.displayAmount.replace(",", "").replace(" ", "").replace("$", ""));
                this.displayAmount = this.utility.formatAmount(this.amount, "$");
            }
            else {
                this.displayAmount = "";
                this.amount = null;
            }
        }
        else
            this.amount = null;
    };
    OrderEntryComponent.prototype.focusLoanAmount = function (sender) {
        if (this.amount !== null)
            this.displayAmount = this.amount.toString();
        else
            this.displayAmount = "";
    };
    OrderEntryComponent.prototype.populateTransactionType = function () {
        var _this = this;
        this.child.showLoader();
        this.referenceDataService.getddlType('TransactionType')
            .subscribe(function (data) { return _this.loadTransactionType(data); }, function (error) {
            _this.child.hideLoader();
            _this.child.showErrorNotification("error in Transaction Type DropDown call", "Error !");
        }, function () { return _this.logService.log("Transaction Type loaded Successfully!"); });
    };
    OrderEntryComponent.prototype.loadTransactionType = function (data) {
        this.child.hideLoader();
        this.transactionTypes = data;
        this.tranType = "Please Select";
    };
    OrderEntryComponent.prototype.populateContactType = function () {
        var _this = this;
        this.child.showLoader();
        this.referenceDataService.getddlType('ContactType')
            .subscribe(function (data) { return _this.loadContactType(data); }, function (error) {
            _this.child.hideLoader();
            _this.logService.log(error + ": error in Contact Types DropDown call");
        }, function () { return _this.logService.log("Contact Types loaded Successfully!"); });
    };
    OrderEntryComponent.prototype.loadContactType = function (data) {
        this.child.hideLoader();
        this.contactTypes = data;
        this.contactType = "Please Select";
    };
    OrderEntryComponent.prototype.filterContacts = function (sender) {
        var _this = this;
        this.lenderId = sender.target.value;
        this.contactName = "";
        this.contactNames = null;
        setTimeout(function () { return _this.contactName = ""; }, 0);
        this.populateContactName();
    };
    OrderEntryComponent.prototype.populateContactName = function () {
        var _this = this;
        this.child.showLoader();
        this.httpService.getClientContactNames(this.lenderId, this.modelOrderEntryFetch.Suffix, this.modelOrderEntryFetch.ShowMultiLevels)
            .subscribe(function (data) { return _this.loadContactName(data); }, function (error) {
            _this.child.hideLoader();
            _this.child.showErrorNotification("error in Contact Names DropDown call", "Error !");
        }, function () { return _this.logService.log("Contact Names loaded Successfully!"); });
    };
    OrderEntryComponent.prototype.loadContactName = function (data) {
        this.child.hideLoader();
        this.contactNames = data;
        this.contactName = "Please Select";
    };
    OrderEntryComponent.prototype.populatePropertyType = function () {
        var _this = this;
        this.child.showLoader();
        this.referenceDataService.getddlType('ClientPropertyType')
            .subscribe(function (data) { return _this.loadPropertyType(data); }, function (error) {
            _this.child.hideLoader();
            _this.child.showErrorNotification("error in Property Types DropDown call", "Error !");
        }, function () { return _this.logService.log("Property Types loaded Successfully!"); });
    };
    OrderEntryComponent.prototype.loadPropertyType = function (data) {
        this.child.hideLoader();
        this.propertyTypes = data;
        this.propType = "Please Select";
    };
    OrderEntryComponent.prototype.populateLoanType = function () {
        var _this = this;
        this.child.showLoader();
        this.referenceDataService.getddlType('LenderLoanType')
            .subscribe(function (data) { return _this.loadLoanType(data); }, function (error) { _this.child.hideLoader(); _this.logService.log(error + ": error in Loan Types DropDown call"); }, function () { return _this.logService.log("Loan Types loaded Successfully!"); });
    };
    OrderEntryComponent.prototype.loadLoanType = function (data) {
        this.child.hideLoader();
        this.loanTypes = data;
        this.loanType = "Please Select";
    };
    OrderEntryComponent.prototype.populateMaritalStatus = function () {
        var _this = this;
        this.child.showLoader();
        this.httpService.getMaritalStatus()
            .subscribe(function (data) { return _this.loadMaritalStatus(data); }, function (error) { _this.child.hideLoader(); _this.logService.log(error + ": error in Marital Status DropDown call"); }, function () { return _this.logService.log("Marital Status loaded Successfully!"); });
    };
    OrderEntryComponent.prototype.loadMaritalStatus = function (data) {
        this.child.hideLoader();
        this.maritalStatuses = data;
        this.maritalStatus = "Please Select";
    };
    OrderEntryComponent.prototype.getTransactionTypeGridColumns = function () {
        return [
            new column_1.Column('DeleteOnly', 'Delete'),
            new column_1.Column('TransactionType', 'Transaction')
        ];
    };
    OrderEntryComponent.prototype.OnAddTransactionType = function () {
        var index;
        index = this.findItem(this.transactionTypeList, 'ProductCode', this.tranType);
        if (index !== -1) {
            this.child.showErrorNotification('Transaction already added in list', 'Error!');
            return;
        }
        var sTransaction = jQuery('#ddlTranType option:selected').text();
        var obj;
        obj = {
            TransactionType: sTransaction,
            ClientContactId: "",
            ProductCode: this.tranType,
            ProductCategory: sTransaction,
            BranchId: "",
            ClientRefNo: this.loanNumber,
            Status: "Order Unassigned",
            ManualAssignEnabled: 1,
            ShowOnOrderWIP: false,
            ClientBundleID: "",
            BundleDetailsID: "",
            Ordered: 0
        };
        this.transactionTypeList.push(obj);
        var jsonTempList = JSON.parse(JSON.stringify(this.transactionTypeList));
        this.transactionTypeList = JSON.parse(JSON.stringify(jsonTempList));
    };
    OrderEntryComponent.prototype.deleteTransactionTypeRow = function (model) {
        this.findAndRemove(this.transactionTypeList, 'ProductCode', model.ProductCode);
        var jsonTempList = JSON.parse(JSON.stringify(this.transactionTypeList));
        this.transactionTypeList = JSON.parse(JSON.stringify(jsonTempList));
    };
    OrderEntryComponent.prototype.getBorrowerGridColumns = function () {
        return [
            new column_1.Column('FirstName', 'First Name'),
            new column_1.Column('LastName', 'Last Name'),
            new column_1.Column('HomePhone', 'Home Phone'),
            new column_1.Column('CellPhone', 'Cell Phone'),
            new column_1.Column('Email', 'Email'),
            new column_1.Column('DeleteOnly', ''),
            new column_1.Column('EditOnly', '')
        ];
    };
    OrderEntryComponent.prototype.OnAddBorrower = function () {
        var index;
        index = this.findItem(this.borrowerList, 'BorrowerId', this.borrowerId);
        if (this.borrowerFirstName.trim().length == 0 || this.borrowerLastName.trim().length == 0) {
            alert('Please enter the required information');
            return;
        }
        if (index !== -1 && this.isEditMode == false) {
            alert('Borrower already added in list');
            return;
        }
        var pattern = /^\d{3}-\d{3}-\d{4}$/g;
        if (this.borrowerPhone !== null && this.borrowerPhone !== "" && pattern.test(this.borrowerPhone) == false) {
            alert('Invalid Phone');
            return;
        }
        pattern = /^\d{3}-\d{3}-\d{4}$/g;
        if (this.borrowerCell !== null && this.borrowerCell !== "" && pattern.test(this.borrowerCell) == false) {
            alert('Invalid Cell');
            return;
        }
        pattern = /^\d{3}-\d{2}-\d{4}$/g;
        if (this.borrowerSSN !== null && this.borrowerSSN !== "" && pattern.test(this.borrowerSSN) == false) {
            alert('Invalid SSN');
            return;
        }
        pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        if (this.borrowerEmail !== "" && pattern.test(this.borrowerEmail) == false) {
            alert('Invalid Email');
            return;
        }
        if (this.borrowerPhone == null)
            this.borrowerPhone = "";
        if (this.borrowerCell == null)
            this.borrowerCell = "";
        if (this.borrowerSSN == null)
            this.borrowerSSN = "";
        var borrowerPhoneWithoutDash = this.borrowerPhone.replace(/-/g, "");
        var borrowerCellWithoutDash = this.borrowerCell.replace(/-/g, "");
        var borrowerSSNWithoutDash = this.borrowerSSN.replace(/-/g, "");
        if (this.isEditMode == false) {
            this.borrowerCount = this.borrowerCount + 1;
            this.borrowerId = this.borrowerCount;
        }
        var marstatid = null;
        if (this.maritalStatus == "Please Select")
            marstatid = 0;
        else
            marstatid = this.maritalStatus;
        var obj;
        obj = {
            EnteredBy: "Website",
            LastModBy: this.getCurrentUserID(),
            Type: "Borrower",
            FullName: (this.borrowerFirstName || ' ' || this.borrowerLastName),
            FirstName: this.borrowerFirstName,
            LastName: this.borrowerLastName,
            HomePhone: borrowerPhoneWithoutDash,
            CellPhone: borrowerCellWithoutDash,
            Email: this.borrowerEmail,
            SSN: borrowerSSNWithoutDash,
            MaritalStatusId: marstatid,
            PhoneWithDash: this.borrowerPhone,
            CellWithDash: this.borrowerCell,
            SSNWithDash: this.borrowerSSN,
            BorrowerId: this.borrowerId
        };
        if (this.isEditMode == false) {
            this.borrowerList.push(obj);
        }
        else {
            this.borrowerList[index] = obj;
        }
        this.ToggleAddBorrower(false);
        var jsonTempList = JSON.parse(JSON.stringify(this.borrowerList));
        this.borrowerList = JSON.parse(JSON.stringify(jsonTempList));
    };
    OrderEntryComponent.prototype.deleteBorrowerRow = function (model) {
        var strconfirm = confirm("Are you sure you want to delete?");
        if (strconfirm == true) {
            this.findAndRemove(this.borrowerList, 'BorrowerId', model.BorrowerId);
            var jsonTempList = JSON.parse(JSON.stringify(this.borrowerList));
            this.borrowerList = JSON.parse(JSON.stringify(jsonTempList));
        }
    };
    OrderEntryComponent.prototype.editBorrowerRow = function (model) {
        this.ToggleAddBorrower(true);
        this.isEditMode = true;
        this.borrowerFirstName = model.FirstName;
        this.borrowerLastName = model.LastName;
        this.borrowerPhone = model.PhoneWithDash;
        this.borrowerCell = model.CellWithDash;
        this.borrowerSSN = model.SSNWithDash;
        this.maritalStatus = model.MaritalStatusId;
        this.borrowerEmail = model.Email;
        this.borrowerId = model.BorrowerId;
        this.displayBorrowerPhone = this.utility.formatPhoneCell(this.borrowerPhone);
        this.displayBorrowerCell = this.utility.formatPhoneCell(this.borrowerCell);
        this.displayBorrowerSSN = this.borrowerSSN;
        this.displayBorrowerSSN = this.displayBorrowerSSN.replace(this.displayBorrowerSSN.substring(0, this.displayBorrowerSSN.lastIndexOf("-") + 1), "***-**-");
    };
    OrderEntryComponent.prototype.onSave = function () {
        var _this = this;
        if (this.borrowerList.length == 0) {
            alert('Please enter Borrower Information');
            return;
        }
        this.child.showLoader();
        var transactionName = jQuery('#ddlTranType option:selected').text();
        transactionName = transactionName.trim();
        if (transactionName == "Refinance & Closing") {
            this.AddTransactionType(transactionName, "TTL");
            this.AddTransactionType(transactionName, "CWI");
        }
        else if (transactionName == "Refinance only") {
            this.AddTransactionType(transactionName, "TTL");
        }
        else if (transactionName == "Purchase & Closing") {
            this.AddTransactionType(transactionName, "PUR");
            this.AddTransactionType(transactionName, "CWI");
        }
        else if (transactionName == "Purchase only") {
            this.AddTransactionType(transactionName, "PUR");
        }
        else if (transactionName == "COOP & Closing") {
            this.AddTransactionType(transactionName, "COOP");
            this.AddTransactionType(transactionName, "CWI");
        }
        else if (transactionName == "COOP only") {
            this.AddTransactionType(transactionName, "COOP");
        }
        this.modelOrderEntrySave.EnteredBy = this.getCurrentUserID();
        this.modelOrderEntrySave.ClientId = this.lenderId; //this.getClientID();
        this.modelOrderEntrySave.PropertyType = this.propType;
        if (this.streetNo !== "" && this.streetName !== "")
            this.modelOrderEntrySave.HaveAddress = true;
        this.modelOrderEntrySave.StreetNo = this.streetNo;
        this.modelOrderEntrySave.StreetName = this.streetName;
        this.modelOrderEntrySave.Address2 = this.Address2;
        this.modelOrderEntrySave.City = this.model.city;
        this.modelOrderEntrySave.County = this.model.county;
        this.modelOrderEntrySave.State = this.model.state;
        if (this.model.zip !== "")
            this.modelOrderEntrySave.HaveZip = true;
        this.modelOrderEntrySave.Zip = this.model.zip;
        this.modelOrderEntrySave.LoanType = this.loanType;
        this.modelOrderEntrySave.LoanAmount = this.amount;
        this.modelOrderEntrySave.LoanNo = this.loanNumber;
        this.modelOrderEntrySave.Note = this.instructions;
        this.modelOrderEntrySave.ContactType = "Loan Officer"; //this.contactType;
        this.modelOrderEntrySave.ContactName = this.contactName;
        this.modelOrderEntrySave.TransactionTypeList = this.transactionTypeList;
        this.modelOrderEntrySave.BorrowerList = this.borrowerList;
        this.httpService.saveOrderEntry(this.modelOrderEntrySave)
            .subscribe(function (data) { return _this.saveHandler(data); }, function (error) {
            _this.child.showSaveErrorNotification();
            _this.child.hideLoader();
        }, function () { return _this.logService.log("API Call Finished Successfully!"); });
    };
    OrderEntryComponent.prototype.saveHandler = function (data) {
        this.child.hideLoader();
        if (data < 0)
            this.child.showErrorNotification('Order creation failed', 'Error!');
        else {
            this.child.showSuccessNotification('Order is successfully created with Order No ' + data, 'Success!');
            this.Clear();
        }
    };
    OrderEntryComponent.prototype.populateClients = function () {
        var _this = this;
        this.logService.log(this.getClientID());
        this.httpService.getClientList(this.getClientID())
            .subscribe(function (data) { return _this.loadClients(data); }, function (error) { return _this.logService.log(error + ": error in Lender DropDown call"); }, function () { return _this.logService.log("Lenders loaded Successfully!"); });
    };
    OrderEntryComponent.prototype.loadClients = function (data) {
        this.clientList = data;
        this.lenderId = 0;
    };
    OrderEntryComponent.prototype.Previous = function (previousId) {
        this.currentCollapsable = previousId;
    };
    OrderEntryComponent.prototype.Next = function (nextId) {
        this.currentCollapsable = nextId;
    };
    OrderEntryComponent.prototype.AddTransactionType = function (transactionName, transactionCode) {
        var obj;
        obj = {
            TransactionType: transactionName,
            ClientContactId: "",
            ProductCode: transactionCode,
            ProductCategory: transactionName,
            BranchId: "",
            ClientRefNo: this.loanNumber,
            Status: "Order Unassigned",
            ManualAssignEnabled: 1,
            ShowOnOrderWIP: false,
            ClientBundleID: "",
            BundleDetailsID: "",
            Ordered: 0
        };
        this.transactionTypeList.push(obj);
        var jsonTempList = JSON.parse(JSON.stringify(this.transactionTypeList));
        this.transactionTypeList = JSON.parse(JSON.stringify(jsonTempList));
    };
    OrderEntryComponent.prototype.ToggleAddBorrower = function (isEnableVisible) {
        this.isAddBorrowerLink = isEnableVisible;
        this.isAddBorrowerPanel = isEnableVisible;
        this.isBorrowerGrid = !isEnableVisible;
        this.isEditMode = false;
        this.borrowerId = -1;
        this.borrowerFirstName = "";
        this.borrowerLastName = "";
        this.borrowerPhone = "";
        this.borrowerCell = "";
        this.borrowerEmail = "";
        this.borrowerSSN = "";
        this.maritalStatus = "Please Select";
        this.displayBorrowerPhone = "";
        this.displayBorrowerCell = "";
        this.displayBorrowerSSN = "";
    };
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], OrderEntryComponent.prototype, "child", void 0);
    OrderEntryComponent = __decorate([
        core_1.Component({
            selector: 'order-entry',
            templateUrl: '../dev/tpl/order-entry.html',
            inputs: ['state'],
            directives: [state_component_1.StateComponent, city_component_1.CityComponent, county_component_1.CountyComponent, notifications_component_1.NotificationsComponent, grid_component_1.GridComponent /*, VendorMainInfo, VendorAdditionalAddressClass, ContactComponent*/],
            providers: [account_profile_service_1.AccountProfileService, city_service_1.CityService, core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }),
                reference_data_service_1.ReferenceDataService, order_entry_service_1.OrderEntryService, logging_1.LoggingService
            ]
        }),
        __param(0, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(1, core_1.Inject(reference_data_service_1.ReferenceDataService)),
        __param(2, core_1.Inject(router_deprecated_1.RouteParams)),
        __param(3, core_1.Inject(router_deprecated_1.Router)),
        __param(4, core_1.Inject(order_entry_service_1.OrderEntryService)),
        __param(5, core_1.Inject(account_profile_service_1.AccountProfileService)),
        __param(6, core_1.Inject(logging_1.LoggingService))
    ], OrderEntryComponent);
    return OrderEntryComponent;
}());
exports.OrderEntryComponent = OrderEntryComponent;
var ClientClass = (function () {
    function ClientClass(zip, city, county, state) {
        if (zip === void 0) { zip = null; }
        if (city === void 0) { city = null; }
        if (county === void 0) { county = null; }
        if (state === void 0) { state = null; }
        this.zip = zip;
        this.city = city;
        this.county = county;
        this.state = state;
    }
    return ClientClass;
}());
//# sourceMappingURL=order-entry.component.js.map