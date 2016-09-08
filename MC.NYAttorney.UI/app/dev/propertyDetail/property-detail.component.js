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
var column_1 = require('../grid/column');
var state_component_1 = require('../DropDowns/state/state.component');
var city_component_1 = require('../DropDowns/city/city.component');
var county_component_1 = require('../DropDowns/county/county.component');
var city_service_1 = require('../DropDowns/city/city.service');
var utility_1 = require('../common/utility');
var account_profile_service_1 = require('../accountProfile/account-profile.service');
var property_detail_service_1 = require('./property-detail.service');
var property_detail_model_1 = require('./property-detail.model');
var left_navigation_component_1 = require('../common/left-navigation.component');
var header_detail_component_1 = require('../common/header-detail.component');
var enumerations_1 = require("../common/enumerations");
var customLocalStorage_1 = require('../common/customLocalStorage');
var logging_1 = require('../common/logging');
var PropertyDetailComponent = (function () {
    function PropertyDetailComponent(_appConfig, _referenceData, _router, _routeParams, _service, _accountProfileService, _logservice) {
        this.active = true;
        this.selectedCounty = "";
        this.selectedCity = "";
        this.selectedState = "";
        this.model = new property_detail_model_1.PropertyDetail();
        this.utility = new utility_1.Utility();
        this.isPageLoadedFirstTime = true;
        this.propertyDetailList = new Array();
        this.isPropertyDetailVisible = false;
        this.isAddPropertyLink = false;
        //Grid Model Start
        this.isEditMode = false;
        this.gridRowId = 0;
        this.gridRowCount = 0;
        this.propertySelectedCounty = "";
        this.propertySelectedCity = "";
        this.propertySelectedState = "";
        this.buyerSelectedCounty = "";
        this.buyerSelectedCity = "";
        this.buyerSelectedState = "";
        this.sellerSelectedCounty = "";
        this.sellerSelectedCity = "";
        this.sellerSelectedState = "";
        //Seller -> Zip, City, State, County End
        this.screenName = "PropertyDetail";
        this.displayBorrowerPhone = "";
        this.displayBorrowerCell = "";
        this.appConfig = _appConfig;
        this.referenceDataService = _referenceData;
        this.router = _router;
        this.routeParams = _routeParams;
        this.httpService = _service;
        this.clientTab = enumerations_1.enmTabs.PropertyDetail;
        this.accountProfileService = _accountProfileService;
        this.logService = _logservice;
    }
    PropertyDetailComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.child.showLoader();
        this.model.XRefId = +this.routeParams.get("orderno");
        this.orderNo = this.model.XRefId.toString();
        this.populatePropertyType();
        this.populatePropertyDetail();
        if (JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName)) == null)
            this.accountProfileService.getPermissionsAgainstRole(this.screenName)
                .subscribe(function (data) {
                customLocalStorage_1.CustomLocalStorage.setItem(_this.screenName, JSON.stringify(data));
                _this.loadRolesAndPermissions(data);
            }, function (error) { return _this.logService.log(error); });
        else
            this.loadRolesAndPermissions(JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName)));
    };
    PropertyDetailComponent.prototype.loadRolesAndPermissions = function (data) {
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
        var obj = JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName));
        this.propertyDetailGridColumns = this.getPropertyDetailGridColumns();
        for (var index in obj) {
            if (obj[index]["Parent"] == "PropertyDetailGrid") {
                if (!obj[index]["IsVisible"])
                    this.findAndRemove(this.propertyDetailGridColumns, "name", obj[index]["CtrlName"]);
            }
        }
    };
    PropertyDetailComponent.prototype.findItem = function (array, property, value) {
        for (var index = 0; index < array.length; index++) {
            if (array[index][property] === value) {
                return index;
            }
        }
        return -1;
    };
    PropertyDetailComponent.prototype.findAndRemove = function (array, property, value) {
        array.forEach(function (result, index) {
            if (result[property] === value) {
                array.splice(index, 1);
            }
        });
    };
    PropertyDetailComponent.prototype.getCurrentDateTime = function () {
        return moment().format('MM/DD/YYYY');
    };
    PropertyDetailComponent.prototype.getCurrentUserID = function () {
        var contactId = this.utility.getContactId();
        if (contactId !== null)
            return contactId;
        return null;
    };
    //Zip, City, State, County Start
    PropertyDetailComponent.prototype.selectedStateValue = function (selectedState) {
        this.logService.log(selectedState);
        this.selectedState = selectedState;
        this.model.state = selectedState;
    };
    PropertyDetailComponent.prototype.GetCityAndState = function (data) {
        var _this = this;
        if (data !== null && data !== '' && data !== undefined) {
            this.child.showLoader();
            this.httpService.getStateCountyByZip(data)
                .subscribe(function (data) { return _this.getStateCountyByZip(data); }, function (error) {
                _this.child.hideLoader();
                _this.logService.log(error);
            }, function () { return _this.logService.log("API Call Finished Successfully!"); });
        }
        else {
            this.model.state = null;
            this.model.city = null;
            this.model.county = null;
        }
    };
    PropertyDetailComponent.prototype.getStateCountyByZip = function (data) {
        this.child.hideLoader();
        if (data) {
            this.model.state = data[0].StateAbbr;
            this.model.city = data[0].CityName;
            this.model.county = data[0].CountyName;
            this.logService.log(data);
        }
    };
    PropertyDetailComponent.prototype.GetCitiesbyState = function (data) {
        this.filterCities = data;
    };
    PropertyDetailComponent.prototype.GetCountybyState = function (data) {
        this.filtercounties = data;
    };
    PropertyDetailComponent.prototype.selectedCountyValue = function (selectedCounty) {
        this.logService.log(selectedCounty);
        this.selectedCounty = selectedCounty;
        this.model.county = selectedCounty;
    };
    PropertyDetailComponent.prototype.selectedCityValue = function (selectedCity) {
        this.logService.log(selectedCity);
        this.selectedCity = selectedCity;
        this.model.city = selectedCity;
    };
    //Zip, City, State, County End
    //Masking Start
    PropertyDetailComponent.prototype.blurPhone = function (sender) {
        //this.model.Phone = sender.target.value;
        if (this.displayBorrowerPhone !== null && this.displayBorrowerPhone !== "") {
            this.displayBorrowerPhone = sender.target.value;
            this.displayBorrowerPhone = this.displayBorrowerPhone.substr(0, 12);
            this.model.Phone = this.displayBorrowerPhone;
            this.displayBorrowerPhone = this.utility.formatPhoneCell(this.displayBorrowerPhone);
        }
        else
            this.model.Phone = null;
    };
    PropertyDetailComponent.prototype.focusPhone = function (sender) {
        if (this.model.Phone !== null)
            this.displayBorrowerPhone = this.model.Phone;
        else
            this.displayBorrowerPhone = "";
        ApplyMask();
    };
    PropertyDetailComponent.prototype.blurCell = function (sender) {
        //this.model.Cell = sender.target.value;
        if (this.displayBorrowerCell !== null && this.displayBorrowerCell !== "") {
            this.displayBorrowerCell = sender.target.value;
            this.displayBorrowerCell = this.displayBorrowerCell.substr(0, 12);
            this.model.Cell = this.displayBorrowerCell;
            this.displayBorrowerCell = this.utility.formatPhoneCell(this.displayBorrowerCell);
        }
        else
            this.model.Cell = null;
    };
    PropertyDetailComponent.prototype.focusCell = function (sender) {
        if (this.model.Cell !== null)
            this.displayBorrowerCell = this.model.Cell;
        else
            this.displayBorrowerCell = "";
        ApplyMask();
    };
    //Masking End
    PropertyDetailComponent.prototype.populatePropertyType = function () {
        var _this = this;
        this.child.showLoader();
        this.referenceDataService.getddlType('ClientPropertyType')
            .subscribe(function (data) { return _this.loadPropertyType(data); }, function (error) {
            _this.child.hideLoader();
            _this.logService.log(error + ": error in Property Types DropDown call");
        }, function () { return _this.logService.log("Property Types loaded Successfully!"); });
    };
    PropertyDetailComponent.prototype.loadPropertyType = function (data) {
        this.child.hideLoader();
        this.propertyTypes = data;
        this.model.PropertyType = "Please Select";
        this.getPropertyDetail();
    };
    PropertyDetailComponent.prototype.populatePropertyDetail = function () {
        var _this = this;
        this.child.showLoader();
        this.referenceDataService.getddlType('PropertyDetails')
            .subscribe(function (data) { return _this.loadPropertyDetail(data); }, function (error) {
            _this.child.hideLoader();
            _this.logService.log(error + ": error in Property Details DropDown call");
        }, function () { return _this.logService.log("Property Details loaded Successfully!"); });
    };
    PropertyDetailComponent.prototype.loadPropertyDetail = function (data) {
        this.child.hideLoader();
        this.findAndRemove(data, "cboEntry", "Please Select");
        this.allPropertyDetails = data;
        this.propertyDetails = data;
        this.model.PropertyDetail = data[0].cboEntry;
    };
    PropertyDetailComponent.prototype.getPropertyDetailGridColumns = function () {
        return [
            new column_1.Column('PropertyDetail', 'Type'),
            new column_1.Column('CreatedDate', 'Created Date'),
            new column_1.Column('CreatedBy', 'Created By'),
            new column_1.Column('DeleteOnly', ''),
            new column_1.Column('EditOnly', '')
        ];
    };
    PropertyDetailComponent.prototype.onAddPropertyLink = function () {
        this.isPropertyDetailVisible = true;
        this.isAddPropertyLink = true;
        this.isEditMode = false;
    };
    PropertyDetailComponent.prototype.onCancelPropertyDetail = function () {
        this.isPropertyDetailVisible = false;
        this.isAddPropertyLink = false;
        this.clear();
    };
    PropertyDetailComponent.prototype.onSavePropertyDetail = function () {
        var index;
        index = this.findItem(this.propertyDetailList, 'PropertyDetail', this.model.PropertyDetail);
        if (index !== -1 && this.isEditMode == false) {
            //this.child.showErrorNotification('Borrower already added in list', 'Error!');
            alert('Property Detail already added in list');
            return;
        }
        var pattern = /^\d{3}-\d{3}-\d{4}$/g;
        if (this.model.Phone !== null && this.model.Phone !== "" && pattern.test(this.model.Phone) == false) {
            alert('Invalid Phone');
            return;
        }
        pattern = /^\d{3}-\d{3}-\d{4}$/g;
        if (this.model.Cell !== null && this.model.Cell !== "" && pattern.test(this.model.Cell) == false) {
            alert('Invalid Cell');
            return;
        }
        pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        if (this.model.Email !== "" && pattern.test(this.model.Email) == false) {
            alert('Invalid Email');
            return;
        }
        if (this.model.PropertyDetail == "Address Information") {
            if (this.model.PropertyAddress1 == null || this.model.PropertyAddress1.toString().trim() == "") {
                alert('Please enter Address 1');
                return;
            }
            if (this.model.PropertyZip == null || this.model.PropertyZip.toString().trim() == "") {
                alert('Please enter Zip');
                return;
            }
            if (this.model.PropertyCity == null || this.model.PropertyCity.toString().trim() == "") {
                alert('Please enter City');
                return;
            }
            if (this.model.PropertyState == null || this.model.PropertyState.toString().trim() == "") {
                alert('Please select State');
                return;
            }
            if (this.model.PropertyCounty == null || this.model.PropertyCounty.toString().trim() == "") {
                alert('Please select County');
                return;
            }
        }
        if (this.model.PropertyDetail == "CO-OP Information" || this.model.PropertyDetail == "CONDO/PUD Information") {
            if (this.model.InformationName.toString().trim() == "") {
                if (this.model.PropertyDetail == "CO-OP Information")
                    alert('Please enter CO-OP Name');
                else if (this.model.PropertyDetail == "CONDO/PUD Information")
                    alert('Please enter Association Name');
                return;
            }
            if (this.model.ManagingAgentName.toString().trim() == "") {
                alert('Please enter Managing Agent\'s Name');
                return;
            }
            if (this.displayBorrowerPhone == null || this.displayBorrowerPhone.trim() == "") {
                alert('Please enter Phone');
                return;
            }
            if (this.model.Email.trim() == "") {
                alert('Please enter Email');
                return;
            }
            if (this.model.PropertyDetail == "CO-OP Information" && this.model.IsLeaseAssigned == true) {
                if (this.model.LeaseDate == null || this.model.LeaseDate == "") {
                    alert('Please enter Lease Date');
                    return;
                }
                if (this.utility.isDateTime(this.model.LeaseDate, "YYYY-MM-DD") == false) {
                    alert('Invalid Lease Date');
                    return;
                }
                if (this.model.ExpirationDate == null || this.model.ExpirationDate == "") {
                    alert('Please enter Expiration Date');
                    return;
                }
                if (this.utility.isDateTime(this.model.ExpirationDate, "YYYY-MM-DD") == false) {
                    alert('Invalid Expiration Date');
                    return;
                }
            }
        }
        //if (this.model.PropertyDetail == "CONDO/PUD Information") {
        //    if (this.model.InformationName.toString().trim() == "") {
        //        alert('Please enter Association Name');
        //        return;
        //    }
        //}
        if (this.model.Phone == null)
            this.model.Phone = "";
        if (this.model.Cell == null)
            this.model.Cell = "";
        var PhoneWithoutDash = this.model.Phone.replace(/-/g, "");
        var CellWithoutDash = this.model.Cell.replace(/-/g, "");
        var Suffix = "";
        var AddressType = "";
        if (this.model.PropertyDetail == "Address Information") {
            Suffix = "PA";
            AddressType = "PropertyAdditionalAddress";
        }
        else if (this.model.PropertyDetail == "CONDO/PUD Information") {
            Suffix = "CA";
            AddressType = "CondoAddress";
        }
        else if (this.model.PropertyDetail == "CO-OP Information") {
        }
        if (this.isEditMode == false) {
            this.gridRowCount = this.gridRowCount + 1;
            this.gridRowId = this.gridRowCount;
        }
        var obj;
        obj = {
            RowId: this.gridRowId,
            CreatedDate: this.getCurrentDateTime(),
            CreatedBy: customLocalStorage_1.CustomLocalStorage.getItem("user_FullName"),
            IsActive: true,
            XRefId: this.model.XRefId,
            PropertyDetail: this.model.PropertyDetail,
            InformationName: this.model.InformationName,
            ManagingAgentName: this.model.ManagingAgentName,
            PhoneWithDash: this.model.Phone,
            CellWithDash: this.model.Cell,
            Phone: PhoneWithoutDash,
            Cell: CellWithoutDash,
            Email: this.model.Email,
            StockCertificateNumber: this.model.StockCertificateNumber,
            SharesCount: this.model.SharesCount,
            IsLeaseAssigned: this.model.IsLeaseAssigned,
            LeaseDate: this.model.LeaseDate,
            ExpirationDate: this.model.ExpirationDate,
            PropertyAddressSuffix: Suffix,
            PropertyAddressType: AddressType,
            PropertyAddress1: this.model.PropertyAddress1,
            PropertyAddress2: this.model.PropertyAddress2,
            PropertyCity: this.model.PropertyCity,
            PropertyState: this.model.PropertyState,
            PropertyZip: this.model.PropertyZip,
            PropertyCounty: this.model.PropertyCounty,
            BuyerAddressSuffix: this.model.BuyerAddressSuffix,
            BuyerAddressType: this.model.BuyerAddressType,
            BuyerAddress1: this.model.BuyerAddress1,
            BuyerAddress2: this.model.BuyerAddress2,
            BuyerCity: this.model.BuyerCity,
            BuyerState: this.model.BuyerState,
            BuyerZip: this.model.BuyerZip,
            BuyerCounty: this.model.BuyerCounty,
            SellerAddressSuffix: this.model.SellerAddressSuffix,
            SellerAddressType: this.model.SellerAddressType,
            SellerAddress1: this.model.SellerAddress1,
            SellerAddress2: this.model.SellerAddress2,
            SellerCity: this.model.SellerCity,
            SellerState: this.model.SellerState,
            SellerZip: this.model.SellerZip,
            SellerCounty: this.model.SellerCounty
        };
        if (this.isEditMode == false) {
            this.propertyDetailList.push(obj);
        }
        else {
            this.propertyDetailList[index] = obj;
        }
        var jsonTempList = JSON.parse(JSON.stringify(this.propertyDetailList));
        this.propertyDetailList = JSON.parse(JSON.stringify(jsonTempList));
        this.isAddPropertyLink = false;
        this.isPropertyDetailVisible = false;
        this.isEditMode = false;
        this.gridRowId = -1;
        this.clear();
    };
    PropertyDetailComponent.prototype.deletePropertyDetailRow = function (model) {
        var strconfirm = confirm("Are you sure you want to delete?");
        if (strconfirm == true) {
            var index = this.findItem(this.propertyDetailList, 'RowId', model.RowId);
            if (index !== -1) {
                this.propertyDetailList.splice(index, 1);
                var jsonTempList = JSON.parse(JSON.stringify(this.propertyDetailList));
                this.propertyDetailList = JSON.parse(JSON.stringify(jsonTempList));
            }
            this.onCancelPropertyDetail();
        }
    };
    PropertyDetailComponent.prototype.editPropertyDetailRow = function (row) {
        this.isAddPropertyLink = true;
        this.isPropertyDetailVisible = true;
        this.isEditMode = true;
        this.gridRowId = row.RowId;
        this.model.PropertyDetail = row.PropertyDetail;
        this.model.InformationName = row.InformationName;
        this.model.ManagingAgentName = row.ManagingAgentName;
        this.model.Phone = row.PhoneWithDash;
        this.displayBorrowerPhone = this.utility.formatPhoneCell(this.model.Phone);
        this.model.Cell = row.CellWithDash;
        this.displayBorrowerCell = this.utility.formatPhoneCell(this.model.Cell);
        this.model.Email = row.Email;
        this.model.StockCertificateNumber = row.StockCertificateNumber;
        this.model.SharesCount = row.SharesCount;
        this.model.IsLeaseAssigned = row.IsLeaseAssigned;
        this.model.LeaseDate = row.LeaseDate == null ? "" : (moment.utc(row.LeaseDate).format('YYYY-MM-DD'));
        this.model.ExpirationDate = row.ExpirationDate == null ? "" : (moment.utc(row.ExpirationDate).format('YYYY-MM-DD'));
        this.model.PropertyAddress1 = row.PropertyAddress1;
        this.model.PropertyAddress2 = row.PropertyAddress2;
        this.model.PropertyCity = row.PropertyCity;
        this.model.PropertyState = row.PropertyState;
        this.model.PropertyZip = row.PropertyZip;
        this.model.PropertyCounty = row.PropertyCounty;
        this.model.BuyerAddress1 = row.BuyerAddress1;
        this.model.BuyerAddress2 = row.BuyerAddress2;
        this.model.BuyerCity = row.BuyerCity;
        this.model.BuyerState = row.BuyerState;
        this.model.BuyerZip = row.BuyerZip;
        this.model.BuyerCounty = row.BuyerCounty;
        this.model.SellerAddress1 = row.SellerAddress1;
        this.model.SellerAddress2 = row.SellerAddress2;
        this.model.SellerCity = row.SellerCity;
        this.model.SellerState = row.SellerState;
        this.model.SellerZip = row.SellerZip;
        this.model.SellerCounty = row.SellerCounty;
    };
    PropertyDetailComponent.prototype.formatDate = function (date) {
        var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [year, month, day].join('-');
    };
    PropertyDetailComponent.prototype.ToggleAddProperty = function (isEnableVisible) {
        this.isAddPropertyLink = isEnableVisible;
        this.isPropertyDetailVisible = isEnableVisible;
        this.isEditMode = false;
        this.gridRowId = -1;
        this.model = new property_detail_model_1.PropertyDetail();
    };
    PropertyDetailComponent.prototype.resetPropertyFields = function () {
        //this.model.Address1 = "";
        //this.model.Address1Name = "";
        //this.model.Address2 = "";
        //this.model.zip = "";
        //this.model.state = "";
        //this.model.county = "";
        //this.model.city = "";
        this.propertyDetailList = [];
        this.onCancelPropertyDetail();
    };
    PropertyDetailComponent.prototype.filterPropertyDetails = function (value) {
        var _this = this;
        if (!this.isPageLoadedFirstTime) {
            var confirmation = confirm("Changing Property Type will remove all related Property Details, Do you wish to continue?");
            if (confirmation) {
                this.resetPropertyFields();
                this.applyPropertyDetailsOperations(value);
                this.selectedPropertyType = value;
                this.model.PropertyDetail = "Address Information";
            }
            else {
                setTimeout(function (x) {
                    _this.model.PropertyType = _this.selectedPropertyType;
                }, 100);
            }
        }
        else {
            this.applyPropertyDetailsOperations(value);
            setTimeout(function (x) {
                _this.model.PropertyType = _this.selectedPropertyType;
            }, 100);
        }
    };
    PropertyDetailComponent.prototype.applyPropertyDetailsOperations = function (value) {
        this.model.PropertyType = value;
        var propertyType = value;
        this.propertyDetails = this.allPropertyDetails.slice(0);
        if (propertyType == "Cooperative")
            this.findAndRemove(this.propertyDetails, "cboEntry", "CONDO/PUD Information");
        else if (propertyType == "Condominium")
            this.findAndRemove(this.propertyDetails, "cboEntry", "CO-OP Information");
        else {
            this.findAndRemove(this.propertyDetails, "cboEntry", "CONDO/PUD Information");
            this.findAndRemove(this.propertyDetails, "cboEntry", "CO-OP Information");
        }
    };
    //Property -> Zip, City, State, County Start
    PropertyDetailComponent.prototype.selectedPropertyStateValue = function (selectedState) {
        this.logService.log(selectedState);
        this.propertySelectedState = selectedState;
        this.model.PropertyState = selectedState;
    };
    PropertyDetailComponent.prototype.GetPropertyCityAndState = function (data) {
        var _this = this;
        if (data !== null && data !== '' && data !== undefined) {
            this.child.showLoader();
            this.httpService.getStateCountyByZip(data)
                .subscribe(function (data) { return _this.getPropertyStateCountyByZip(data); }, function (error) {
                _this.child.hideLoader();
                _this.logService.log(error);
            }, function () { return _this.logService.log("API Call Finished Successfully!"); });
        }
    };
    PropertyDetailComponent.prototype.getPropertyStateCountyByZip = function (data) {
        this.child.hideLoader();
        if (data) {
            this.model.PropertyState = data[0].StateAbbr;
            this.model.PropertyCity = data[0].CityName;
            this.model.PropertyCounty = data[0].CountyName;
            this.logService.log(data);
        }
    };
    PropertyDetailComponent.prototype.GetPropertyCitiesbyState = function (data) {
        this.propertyFilterCities = data;
    };
    PropertyDetailComponent.prototype.GetPropertyCountybyState = function (data) {
        this.propertyFiltercounties = data;
    };
    PropertyDetailComponent.prototype.selectedPropertyCountyValue = function (selectedCounty) {
        this.logService.log(selectedCounty);
        this.propertySelectedCounty = selectedCounty;
        this.model.PropertyCounty = selectedCounty;
    };
    PropertyDetailComponent.prototype.selectedPropertyCityValue = function (selectedCity) {
        this.logService.log(selectedCity);
        this.propertySelectedCity = selectedCity;
        this.model.PropertyCity = selectedCity;
    };
    //Property -> Zip, City, State, County End
    PropertyDetailComponent.prototype.onSave = function () {
        var _this = this;
        if (this.model.PropertyType == null || this.model.PropertyType == "Please Select") {
            alert('Please Select Property Type');
            return;
        }
        for (var item in this.propertyDetailList) {
            this.propertyDetailList[item]["RowId"] = +item + 1;
            if (this.propertyDetailList[item]["ExpirationDate"] == "1900-01-01T00:00:00" || this.propertyDetailList[item]["ExpirationDate"] == null) {
                this.propertyDetailList[item]["ExpirationDate"] = "";
            }
            if (this.propertyDetailList[item]["LeaseDate"] == "1900-01-01T00:00:00" || this.propertyDetailList[item]["LeaseDate"] == null) {
                this.propertyDetailList[item]["LeaseDate"] = "";
            }
            this.propertyDetailList[item]["CreatedBy"] = customLocalStorage_1.CustomLocalStorage.getItem("user_FullName");
        }
        this.model.PropertyDetailList = this.propertyDetailList;
        this.child.showLoader();
        this.httpService.savePropertyDetail(this.model)
            .subscribe(function (data) { return _this.saveHandler(data); }, function (error) {
            //this.child.showSaveErrorNotification();
            _this.child.hideLoader();
        }, function () { return _this.logService.log("API Call Finished Successfully!"); });
        //this.successMessageDisplay = true;
    };
    PropertyDetailComponent.prototype.saveHandler = function (data) {
        this.child.hideLoader();
        if (data < 0)
            this.child.showErrorNotification('Property Detail save failed', 'Error!');
        else {
            this.child.showSuccessNotification('Property Detail saved successfully', 'Success!');
        }
    };
    //Buyer -> Zip, City, State, County Start
    PropertyDetailComponent.prototype.selectedBuyerStateValue = function (selectedState) {
        this.logService.log(selectedState);
        this.buyerSelectedState = selectedState;
        this.model.BuyerState = selectedState;
    };
    PropertyDetailComponent.prototype.GetBuyerCityAndState = function (data) {
        var _this = this;
        if (data !== null && data !== '' && data !== undefined) {
            this.httpService.getStateCountyByZip(data)
                .subscribe(function (data) { return _this.getBuyerStateCountyByZip(data); }, function (error) { return _this.logService.log(error); }, function () { return _this.logService.log("API Call Finished Successfully!"); });
        }
    };
    PropertyDetailComponent.prototype.getBuyerStateCountyByZip = function (data) {
        if (data) {
            this.model.BuyerState = data[0].StateAbbr;
            this.model.BuyerCity = data[0].CityName;
            this.model.BuyerCounty = data[0].CountyName;
            this.logService.log(data);
        }
    };
    PropertyDetailComponent.prototype.GetBuyerCitiesbyState = function (data) {
        this.buyerFilterCities = data;
    };
    PropertyDetailComponent.prototype.GetBuyerCountybyState = function (data) {
        this.buyerFiltercounties = data;
    };
    PropertyDetailComponent.prototype.selectedBuyerCountyValue = function (selectedCounty) {
        this.logService.log(selectedCounty);
        this.buyerSelectedCounty = selectedCounty;
        this.model.BuyerCounty = selectedCounty;
    };
    PropertyDetailComponent.prototype.selectedBuyerCityValue = function (selectedCity) {
        this.logService.log(selectedCity);
        this.buyerSelectedCity = selectedCity;
        this.model.BuyerCity = selectedCity;
    };
    //Buyer -> Zip, City, State, County End
    //Seller -> Zip, City, State, County Start
    PropertyDetailComponent.prototype.selectedSellerStateValue = function (selectedState) {
        this.logService.log(selectedState);
        this.sellerSelectedState = selectedState;
        this.model.SellerState = selectedState;
        //remove the line if City is not DropDown
        //this.model.sellerCity = '';
    };
    PropertyDetailComponent.prototype.GetSellerCityAndState = function (data) {
        var _this = this;
        if (data !== null && data !== '' && data !== undefined) {
            this.httpService.getStateCountyByZip(data)
                .subscribe(function (data) { return _this.getSellerStateCountyByZip(data); }, function (error) { return _this.logService.log(error); }, function () { return _this.logService.log("API Call Finished Successfully!"); });
        }
    };
    PropertyDetailComponent.prototype.getSellerStateCountyByZip = function (data) {
        if (data) {
            this.model.SellerState = data[0].StateAbbr;
            this.model.SellerCity = data[0].CityName;
            this.model.SellerCounty = data[0].CountyName;
            this.logService.log(data);
        }
    };
    PropertyDetailComponent.prototype.GetSellerCitiesbyState = function (data) {
        this.sellerFilterCities = data;
    };
    PropertyDetailComponent.prototype.GetSellerCountybyState = function (data) {
        this.sellerFiltercounties = data;
    };
    PropertyDetailComponent.prototype.selectedSellerCountyValue = function (selectedCounty) {
        this.logService.log(selectedCounty);
        this.sellerSelectedCounty = selectedCounty;
        this.model.SellerCounty = selectedCounty;
    };
    PropertyDetailComponent.prototype.selectedSellerCityValue = function (selectedCity) {
        this.logService.log(selectedCity);
        this.sellerSelectedCity = selectedCity;
        this.model.SellerCity = selectedCity;
    };
    //Seller -> Zip, City, State, County End
    PropertyDetailComponent.prototype.getPropertyDetail = function () {
        var _this = this;
        this.httpService.getPropertyDetail(this.model.XRefId)
            .subscribe(function (data) { return _this.loadPropertyDetailGrid(data); }, function (error) { return _this.logService.log(error + ": error in Property Detail call"); }, function () { return _this.logService.log("Property Detail loaded Successfully!"); });
    };
    PropertyDetailComponent.prototype.loadPropertyDetailGrid = function (data) {
        //this.model.PropertyDetailList = data;
        this.propertyDetailList = data;
        var index = this.findItem(this.propertyDetailList, 'PropertyAddressSuffix', 'PI');
        if (index !== -1) {
            this.model.PropertyType = this.propertyDetailList[index]["PropertyDetail"];
            this.model.Address1 = this.propertyDetailList[index]["PropertyAddress1"];
            this.model.Address1Name = this.propertyDetailList[index]["PropertyAddress1Name"];
            this.model.Address2 = this.propertyDetailList[index]["PropertyAddress2"];
            this.model.city = this.propertyDetailList[index]["PropertyCity"];
            this.model.state = this.propertyDetailList[index]["PropertyState"];
            this.model.zip = this.propertyDetailList[index]["PropertyZip"];
            this.model.county = this.propertyDetailList[index]["PropertyCounty"];
            this.selectedPropertyType = this.model.PropertyType;
            this.filterPropertyDetails(this.model.PropertyType);
            this.isPageLoadedFirstTime = false;
        }
        this.findAndRemove(this.propertyDetailList, "PropertyAddressSuffix", "PI");
        var prpdtl;
        prpdtl = {
            RowId: 0,
            CreatedDate: this.getCurrentDateTime(),
            CreatedBy: this.getCurrentUserID(),
            IsActive: true,
            XRefId: this.orderNo,
            PropertyDetail: "",
            InformationName: "",
            ManagingAgentName: "",
            PhoneWithDash: "",
            CellWithDash: "",
            Phone: "",
            Cell: "",
            Email: "",
            StockCertificateNumber: "",
            SharesCount: "",
            IsLeaseAssigned: "",
            LeaseDate: "",
            ExpirationDate: "",
            PropertyAddressSuffix: "",
            PropertyAddressType: "",
            PropertyAddress1: "",
            PropertyAddress1Name: "",
            PropertyAddress2: "",
            PropertyCity: "",
            PropertyState: "",
            PropertyZip: "",
            PropertyCounty: "",
            BuyerAddressSuffix: "",
            BuyerAddressType: "",
            BuyerAddress1: "",
            BuyerAddress2: "",
            BuyerCity: "",
            BuyerState: "",
            BuyerZip: "",
            BuyerCounty: "",
            SellerAddressSuffix: "",
            SellerAddressType: "",
            SellerAddress1: "",
            SellerAddress2: "",
            SellerCity: "",
            SellerState: "",
            SellerZip: "",
            SellerCounty: ""
        };
        //index = 0;
        var indexPA = -1;
        var indexBA = -1;
        var indexSA = -1;
        for (var item in this.propertyDetailList) {
            if (this.propertyDetailList[item]["PropertyDetail"] == "Address Information") {
                prpdtl.XRefId = this.orderNo;
                prpdtl.PropertyDetail = this.propertyDetailList[item]["PropertyDetail"];
                prpdtl.CreatedDate = this.propertyDetailList[item]["CreatedDate"];
                prpdtl.CreatedBy = this.propertyDetailList[item]["CreatedBy"];
                prpdtl.IsActive = true;
                prpdtl.RowId = this.propertyDetailList[item]["RowId"];
                prpdtl.InformationName = this.propertyDetailList[item]["InformationName"];
                prpdtl.ManagingAgentName = this.propertyDetailList[item]["ManagingAgentName"];
                prpdtl.PhoneWithDash = this.propertyDetailList[item]["PhoneWithDash"];
                prpdtl.CellWithDash = this.propertyDetailList[item]["CellWithDash"];
                prpdtl.Phone = this.propertyDetailList[item]["Phone"];
                prpdtl.Cell = this.propertyDetailList[item]["Cell"];
                prpdtl.Email = this.propertyDetailList[item]["Email"];
                prpdtl.StockCertificateNumber = this.propertyDetailList[item]["StockCertificateNumber"];
                prpdtl.SharesCount = this.propertyDetailList[item]["SharesCount"];
                prpdtl.IsLeaseAssigned = this.propertyDetailList[item]["IsLeaseAssigned"];
                prpdtl.LeaseDate = this.propertyDetailList[item]["LeaseDate"];
                prpdtl.ExpirationDate = this.propertyDetailList[item]["ExpirationDate"];
                if (this.propertyDetailList[item]["PropertyAddressSuffix"] == "PA") {
                    prpdtl.PropertyAddressSuffix = this.propertyDetailList[item]["PropertyAddressSuffix"];
                    prpdtl.PropertyAddressType = this.propertyDetailList[item]["PropertyAddressType"];
                    prpdtl.PropertyAddress1 = this.propertyDetailList[item]["PropertyAddress1"];
                    prpdtl.PropertyAddress1Name = this.propertyDetailList[item]["PropertyAddress1Name"];
                    prpdtl.PropertyAddress2 = this.propertyDetailList[item]["PropertyAddress2"];
                    prpdtl.PropertyCity = this.propertyDetailList[item]["PropertyCity"];
                    prpdtl.PropertyState = this.propertyDetailList[item]["PropertyState"];
                    prpdtl.PropertyZip = this.propertyDetailList[item]["PropertyZip"];
                    prpdtl.PropertyCounty = this.propertyDetailList[item]["PropertyCounty"];
                    indexPA = +item;
                }
                if (this.propertyDetailList[item]["BuyerAddressSuffix"] == "BA") {
                    prpdtl.BuyerAddressSuffix = this.propertyDetailList[item]["BuyerAddressSuffix"];
                    prpdtl.BuyerAddressType = this.propertyDetailList[item]["BuyerAddressType"];
                    prpdtl.BuyerAddress1 = this.propertyDetailList[item]["BuyerAddress1"];
                    prpdtl.BuyerAddress2 = this.propertyDetailList[item]["BuyerAddress2"];
                    prpdtl.BuyerCity = this.propertyDetailList[item]["BuyerCity"];
                    prpdtl.BuyerState = this.propertyDetailList[item]["BuyerState"];
                    prpdtl.BuyerZip = this.propertyDetailList[item]["BuyerZip"];
                    prpdtl.BuyerCounty = this.propertyDetailList[item]["BuyerCounty"];
                    indexBA = +item;
                }
                if (this.propertyDetailList[item]["SellerAddressSuffix"] == "SA") {
                    prpdtl.SellerAddressSuffix = this.propertyDetailList[item]["SellerAddressSuffix"];
                    prpdtl.SellerAddressType = this.propertyDetailList[item]["SellerAddressType"];
                    prpdtl.SellerAddress1 = this.propertyDetailList[item]["SellerAddress1"];
                    prpdtl.SellerAddress2 = this.propertyDetailList[item]["SellerAddress2"];
                    prpdtl.SellerCity = this.propertyDetailList[item]["SellerCity"];
                    prpdtl.SellerState = this.propertyDetailList[item]["SellerState"];
                    prpdtl.SellerZip = this.propertyDetailList[item]["SellerZip"];
                    prpdtl.SellerCounty = this.propertyDetailList[item]["SellerCounty"];
                    indexSA = +item;
                }
            }
        }
        if (indexPA !== -1 || indexBA !== -1 || indexSA !== -1) {
            this.propertyDetailList.push(prpdtl);
        }
        var temp = 0;
        if (indexPA > indexBA) {
            indexPA = indexPA + indexBA;
            indexBA = indexPA - indexBA;
            indexPA = indexPA - indexBA;
        }
        if (indexBA > indexSA) {
            indexBA = indexBA + indexSA;
            indexSA = indexBA - indexSA;
            indexBA = indexBA - indexSA;
        }
        if (indexPA > indexBA) {
            indexPA = indexPA + indexBA;
            indexBA = indexPA - indexBA;
            indexPA = indexPA - indexBA;
        }
        if (indexSA !== -1)
            this.propertyDetailList.splice(indexSA, 1);
        if (indexBA !== -1)
            this.propertyDetailList.splice(indexBA, 1);
        if (indexPA !== -1)
            this.propertyDetailList.splice(indexPA, 1);
        this.gridRowCount = this.propertyDetailList.length;
        this.gridRowId = this.gridRowCount;
        var jsonTempList = JSON.parse(JSON.stringify(this.propertyDetailList));
        this.propertyDetailList = JSON.parse(JSON.stringify(jsonTempList));
        this.child.hideLoader();
    };
    PropertyDetailComponent.prototype.clear = function () {
        this.model.InformationName = "";
        this.model.ManagingAgentName = "";
        this.model.Phone = "";
        this.displayBorrowerPhone = "";
        this.model.Cell = "";
        this.displayBorrowerCell = "";
        this.model.Email = "";
        this.model.StockCertificateNumber = "";
        this.model.SharesCount = "";
        this.model.IsLeaseAssigned = false;
        this.model.LeaseDate = "";
        this.model.ExpirationDate = "";
        this.model.PropertyAddress1 = "";
        this.model.PropertyAddress2 = "";
        this.model.PropertyCity = null;
        this.model.PropertyState = null;
        this.model.PropertyZip = null;
        this.model.PropertyCounty = null;
        this.model.BuyerAddress1 = "";
        this.model.BuyerAddress2 = "";
        this.model.BuyerCity = null;
        this.model.BuyerState = null;
        this.model.BuyerZip = null;
        this.model.BuyerCounty = null;
        this.model.SellerAddress1 = "";
        this.model.SellerAddress2 = "";
        this.model.SellerCity = null;
        this.model.SellerState = null;
        this.model.SellerZip = null;
        this.model.SellerCounty = null;
    };
    PropertyDetailComponent.prototype.onCancel = function () {
        this.router.navigate(['OrderSummary', { orderno: this.orderNo }]);
    };
    PropertyDetailComponent.prototype.clearPropertyDetailSection = function (value) {
        this.model.PropertyDetail = value;
        this.clear();
    };
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], PropertyDetailComponent.prototype, "child", void 0);
    PropertyDetailComponent = __decorate([
        core_1.Component({
            selector: 'property-detail',
            templateUrl: '../dev/tpl/property-detail.html',
            inputs: ['state'],
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, notifications_component_1.NotificationsComponent, grid_component_1.GridComponent, state_component_1.StateComponent, city_component_1.CityComponent, county_component_1.CountyComponent,
                left_navigation_component_1.LeftNavigationComponent,
                header_detail_component_1.HeaderDetailComponent
            ],
            providers: [core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }), reference_data_service_1.ReferenceDataService,
                city_service_1.CityService,
                property_detail_service_1.PropertyDetailService,
                account_profile_service_1.AccountProfileService,
                logging_1.LoggingService
            ]
        }),
        __param(0, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(1, core_1.Inject(reference_data_service_1.ReferenceDataService)),
        __param(2, core_1.Inject(router_deprecated_1.Router)),
        __param(3, core_1.Inject(router_deprecated_1.RouteParams)),
        __param(4, core_1.Inject(property_detail_service_1.PropertyDetailService)),
        __param(5, core_1.Inject(account_profile_service_1.AccountProfileService)),
        __param(6, core_1.Inject(logging_1.LoggingService))
    ], PropertyDetailComponent);
    return PropertyDetailComponent;
}());
exports.PropertyDetailComponent = PropertyDetailComponent;
//# sourceMappingURL=property-detail.component.js.map