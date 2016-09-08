import {Component, OnInit, Inject, provide, ViewChild, AfterViewInit} from '@angular/core';
import {Http} from '@angular/http';
import {NgForm} from '@angular/forms';
import {Router, RouteParams, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {ReferenceDataService} from '../referenceData/reference-data.service';
import {NotificationsComponent} from '../notifications/notifications.component';
import {GridComponent} from '../grid/grid.component';
import {Column} from '../grid/column';
import {StateComponent} from '../DropDowns/state/state.component';
import {CityComponent} from '../DropDowns/city/city.component';
import {CountyComponent} from '../DropDowns/county/county.component';
import {CityService} from '../DropDowns/city/city.service';
import {Utility} from '../common/utility';
import {AccountProfileService} from '../accountProfile/account-profile.service';
import {PropertyDetailService} from './property-detail.service';
import {PropertyDetail} from './property-detail.model';
import {LeftNavigationComponent} from '../common/left-navigation.component';
import {HeaderDetailComponent} from '../common/header-detail.component';
import {enmTabs} from "../common/enumerations";
import {ClientStorage} from '../common/ClientStorage';
import {LoggingService} from '../common/logging';
import {ClientStorageConstants} from '../common/constants';
declare var jQuery;
declare var moment: any;
declare var ApplyMask;

@Component({
    selector: 'property-detail',
    templateUrl: '../dev/tpl/property-detail.html',
    inputs: ['state'],
    directives: [ROUTER_DIRECTIVES, NotificationsComponent, GridComponent, StateComponent, CityComponent, CountyComponent
        , LeftNavigationComponent
        , HeaderDetailComponent

    ],
    providers: [ provide(APP_CONFIG, { useValue: CONFIG }), ReferenceDataService
        , CityService
        , PropertyDetailService
        , AccountProfileService
        , LoggingService
    ]
})

export class PropertyDetailComponent implements AfterViewInit {
    router: Router;
    routeParams: RouteParams;
    clientTab: enmTabs;
    appConfig: Config;
    referenceDataService: ReferenceDataService;
    @ViewChild(NotificationsComponent) child: NotificationsComponent;
    successMessageDisplay: boolean;
    active = true;
    accountProfileService: AccountProfileService;
    zip: string;
    city: string;
    county: string;
    state: string;
    selectedCounty = "";
    selectedCity = "";
    selectedState = "";
    filterCities: Array<any>;
    filtercounties: Array<any>;
    logService: LoggingService;
    httpService: PropertyDetailService;
    model = new PropertyDetail();
    utility = new Utility();
    isPageLoadedFirstTime = true;
    selectedPropertyType: string;
    propertyDetailGridColumns: Array<Column>;
    propertyDetailList = new Array<any>();
    propertyTypes: Array<any>;
    propertyDetails: Array<any>;
    allPropertyDetails: Array<any>;
    isPropertyDetailVisible = false;
    isAddPropertyLink = false;

    //Grid Model Start
    isEditMode = false;
    gridRowId: number = 0;
    gridRowCount: number = 0;
    //Grid Model End

    //Property -> Zip, City, State, County Start
    propertyZip: string;
    propertyCity: string;
    propertyCounty: string;
    propertyState: string;
    propertySelectedCounty = "";
    propertySelectedCity = "";
    propertySelectedState = "";
    propertyFilterCities: Array<any>;
    propertyFiltercounties: Array<any>;
    //Property -> Zip, City, State, County End

    //Buyer -> Zip, City, State, County Start
    buyerZip: string;
    buyerCity: string;
    buyerCounty: string;
    buyerState: string;
    buyerSelectedCounty = "";
    buyerSelectedCity = "";
    buyerSelectedState = "";
    buyerFilterCities: Array<any>;
    buyerFiltercounties: Array<any>;
    //Buyer -> Zip, City, State, County End

    //Seller -> Zip, City, State, County Start
    sellerZip: string;
    sellerCity: string;
    sellerCounty: string;
    sellerState: string;
    sellerSelectedCounty = "";
    sellerSelectedCity = "";
    sellerSelectedState = "";
    sellerFilterCities: Array<any>;
    sellerFiltercounties: Array<any>;
    orderNo: string;
    //Seller -> Zip, City, State, County End
    screenName: string = ClientStorageConstants.LS_PropertyDetail;

    displayBorrowerPhone: string = "";
    displayBorrowerCell: string = "";

    constructor( @Inject(APP_CONFIG) _appConfig: Config, @Inject(ReferenceDataService) _referenceData, @Inject(Router) _router
        , @Inject(RouteParams) _routeParams
        , @Inject(PropertyDetailService) _service
        , @Inject(AccountProfileService) _accountProfileService
        , @Inject(LoggingService) _logservice
    ) {
        this.appConfig = _appConfig;
        this.referenceDataService = _referenceData;
        this.router = _router;
        this.routeParams = _routeParams;
        this.httpService = _service;
        this.clientTab = enmTabs.PropertyDetail;
        this.accountProfileService = _accountProfileService;
        this.logService = _logservice;
    }

    ngAfterViewInit() {
        this.child.showLoader();
        this.model.XRefId = +ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_orderno);
        this.orderNo = this.model.XRefId.toString();
        this.populatePropertyType();
        this.populatePropertyDetail();                           
        if (JSON.parse(ClientStorage.getSessionStorageItem(this.screenName)) == null)
            this.accountProfileService.getPermissionsAgainstRole(this.screenName)
                .subscribe(
                data => {
                    ClientStorage.setSessionStorageItem(this.screenName, JSON.stringify(data));
                    this.loadRolesAndPermissions(data);
                },
                error => this.logService.log(error));
        else
            this.loadRolesAndPermissions(JSON.parse(ClientStorage.getSessionStorageItem(this.screenName)));            
    }


    loadRolesAndPermissions(data) {
        if (data.length > 0) {
            for (var index in data) {
                if (!data[index]["IsVisible"]) {
                    jQuery("#" + data[index]["CtrlName"]).hide();
                } else if (!data[index]["IsEnabled"]) {
                    jQuery("#" + data[index]["CtrlName"] + " :input").attr("disabled", true);
                }
            }
        }
        var obj = JSON.parse(ClientStorage.getSessionStorageItem(this.screenName));
        this.propertyDetailGridColumns = this.getPropertyDetailGridColumns();
        for (var index in obj) {
            if (obj[index]["Parent"] == "PropertyDetailGrid") {
                if (!obj[index]["IsVisible"])
                    this.findAndRemove(this.propertyDetailGridColumns, "name", obj[index]["CtrlName"]);
            }
        }
    }
    

    findItem(array, property, value) {
        for (var index = 0; index < array.length; index++) {
            if (array[index][property] === value) {
                return index;
            }
        }
        return -1;
    }

    findAndRemove(array, property, value) {
        array.forEach(function (result, index) {
            if (result[property] === value) {
                array.splice(index, 1);
            }
        });
    }

    getCurrentDateTime() {
        return moment().format('MM/DD/YYYY');
    }

    getCurrentUserID() {
        let contactId = this.utility.getContactId();
        if (contactId !== null)
            return contactId;
        return null;
    }

    //Zip, City, State, County Start
    selectedStateValue(selectedState) {
        this.logService.log(selectedState);
        this.selectedState = selectedState;
        this.model.state = selectedState;
    }

    GetCityAndState(data) {

        if (data !== null && data !== '' && data !== undefined) {
            this.child.showLoader();
            this.httpService.getStateCountyByZip(data)
                .subscribe(
                data => this.getStateCountyByZip(data),
                error => {
                    this.child.hideLoader();
                    this.logService.log(error)
                },
                () => this.logService.log("API Call Finished Successfully!")
                );
        }
        else {
            this.model.state = null;
            this.model.city = null;
            this.model.county = null;
        }
    }

    public getStateCountyByZip(data) {
        this.child.hideLoader();
        if (data) {
            this.model.state = data[0].StateAbbr;
            this.model.city = data[0].CityName;
            this.model.county = data[0].CountyName;
            this.logService.log(data);
        }
    }

    GetCitiesbyState(data) {
        this.filterCities = data;
    }

    GetCountybyState(data) {
        this.filtercounties = data;
    }

    selectedCountyValue(selectedCounty) {
        this.logService.log(selectedCounty);
        this.selectedCounty = selectedCounty;
        this.model.county = selectedCounty;
    }

    selectedCityValue(selectedCity) {
        this.logService.log(selectedCity);
        this.selectedCity = selectedCity;
        this.model.city = selectedCity;
    }
    //Zip, City, State, County End

    //Masking Start
    blurPhone(sender) {
        //this.model.Phone = sender.target.value;
        if (this.displayBorrowerPhone !== null && this.displayBorrowerPhone !== "") {
            this.displayBorrowerPhone = sender.target.value;
            this.displayBorrowerPhone = this.displayBorrowerPhone.substr(0, 12);
            this.model.Phone = this.displayBorrowerPhone;
            this.displayBorrowerPhone = this.utility.formatPhoneCell(this.displayBorrowerPhone);
        }
        else
            this.model.Phone = null;
    }

    focusPhone(sender) {
        if (this.model.Phone !== null)
            this.displayBorrowerPhone = this.model.Phone;
        else
            this.displayBorrowerPhone = "";
        ApplyMask();
    }

    blurCell(sender) {
        //this.model.Cell = sender.target.value;
        if (this.displayBorrowerCell !== null && this.displayBorrowerCell !== "") {
            this.displayBorrowerCell = sender.target.value;
            this.displayBorrowerCell = this.displayBorrowerCell.substr(0, 12);
            this.model.Cell = this.displayBorrowerCell;
            this.displayBorrowerCell = this.utility.formatPhoneCell(this.displayBorrowerCell);
        }
        else
            this.model.Cell = null;
    }

    focusCell(sender) {
        if (this.model.Cell !== null)
            this.displayBorrowerCell = this.model.Cell;
        else
            this.displayBorrowerCell = "";
        ApplyMask();
    }
    //Masking End

    populatePropertyType() {
        this.child.showLoader();
        this.referenceDataService.getddlType('ClientPropertyType')
            .subscribe(
            data => this.loadPropertyType(data),
            error => {
                this.child.hideLoader();
                this.logService.log(error + ": error in Property Types DropDown call")
            },
            () => this.logService.log("Property Types loaded Successfully!")
            );
    }

    loadPropertyType(data) {
        this.child.hideLoader();
        this.propertyTypes = data;
        this.model.PropertyType = "Please Select";
        this.getPropertyDetail();
    }

    populatePropertyDetail() {
        this.child.showLoader();
        this.referenceDataService.getddlType('PropertyDetails')
            .subscribe(
            data => this.loadPropertyDetail(data),
            error => {
                this.child.hideLoader();
                this.logService.log(error + ": error in Property Details DropDown call");
            },
            () => this.logService.log("Property Details loaded Successfully!")
            );
    }

    loadPropertyDetail(data) {
        this.child.hideLoader();
        this.findAndRemove(data, "cboEntry", "Please Select");
        this.allPropertyDetails = data;
        this.propertyDetails = data;
        this.model.PropertyDetail = data[0].cboEntry;
    }

    getPropertyDetailGridColumns(): Array<Column> {
        return [
            new Column('PropertyDetail', 'Type'),
            new Column('CreatedDate', 'Created Date'),
            new Column('CreatedBy', 'Created By'),
            new Column('DeleteOnly', ''),
            new Column('EditOnly', '')
        ];
    }

    onAddPropertyLink() {
        this.isPropertyDetailVisible = true;
        this.isAddPropertyLink = true;
        this.isEditMode = false;
    }

    onCancelPropertyDetail() {
        this.isPropertyDetailVisible = false;
        this.isAddPropertyLink = false;

        this.clear();
    }

    onSavePropertyDetail() {
        var index: any;
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

            //Mark CO-OP Information inactive
            //for (var i = 0; i < this.propertyDetailList.length; i++) {
            //   if (this.propertyDetailList[i]["PropertyDetail"] === "CO-OP Information") {
            //      this.propertyDetailList[i]["IsActive"] = false;
            // }
            //}
        }
        else if (this.model.PropertyDetail == "CO-OP Information") {
            //Mark CONDO Information inactive
            //for (var i = 0; i < this.propertyDetailList.length; i++) {
            //   if (this.propertyDetailList[i]["PropertyDetail"] === "CONDO/PUD Information") {
            //      this.propertyDetailList[i]["IsActive"] = false;
            //  }
            // }
        }

        if (this.isEditMode == false) {
            this.gridRowCount = this.gridRowCount + 1;
            this.gridRowId = this.gridRowCount;
        }

        var obj: any;
        obj = {
            RowId: this.gridRowId,
            CreatedDate: this.getCurrentDateTime(),
            CreatedBy: ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_user_FullName),
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
    }

    deletePropertyDetailRow(model) {
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
    }

    editPropertyDetailRow(row) {

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
    }

    formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

    ToggleAddProperty(isEnableVisible) {
        this.isAddPropertyLink = isEnableVisible;
        this.isPropertyDetailVisible = isEnableVisible;
        this.isEditMode = false;
        this.gridRowId = -1;

        this.model = new PropertyDetail();
    }

    resetPropertyFields() {
        //this.model.Address1 = "";
        //this.model.Address1Name = "";
        //this.model.Address2 = "";
        //this.model.zip = "";
        //this.model.state = "";
        //this.model.county = "";
        //this.model.city = "";

        this.propertyDetailList = [];
        this.onCancelPropertyDetail();
    }

    filterPropertyDetails(value) {
        if (!this.isPageLoadedFirstTime) {
            var confirmation = true;
            if (this.propertyDetailList.length !== 0) {
                confirmation = confirm("Changing Property Type will remove all related Property Details, Do you wish to continue?");
            }
            if (confirmation) {
                this.resetPropertyFields();
                this.applyPropertyDetailsOperations(value);
                this.selectedPropertyType = value;
                this.model.PropertyDetail = "Address Information";
            } else {
                setTimeout(x => {
                    this.model.PropertyType = this.selectedPropertyType;
                }, 100);

            }
        }
        else {
            this.applyPropertyDetailsOperations(value);
            setTimeout(x => {
                this.model.PropertyType = this.selectedPropertyType;
            }, 100);
        }

    }

    applyPropertyDetailsOperations(value) {
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
    }

    //Property -> Zip, City, State, County Start
    selectedPropertyStateValue(selectedState) {
        this.logService.log(selectedState);
        this.propertySelectedState = selectedState;
        this.model.PropertyState = selectedState;
    }

    GetPropertyCityAndState(data) {
        if (data !== null && data !== '' && data !== undefined) {
            this.child.showLoader();
            this.httpService.getStateCountyByZip(data)
                .subscribe(
                data => this.getPropertyStateCountyByZip(data),
                error => {
                    this.child.hideLoader();
                    this.logService.log(error);
                },
                () => this.logService.log("API Call Finished Successfully!")
                );
        }
    }

    public getPropertyStateCountyByZip(data) {
        this.child.hideLoader();
        if (data) {
            this.model.PropertyState = data[0].StateAbbr;
            this.model.PropertyCity = data[0].CityName;
            this.model.PropertyCounty = data[0].CountyName;
            this.logService.log(data);
        }
    }

    GetPropertyCitiesbyState(data) {
        this.propertyFilterCities = data;
    }

    GetPropertyCountybyState(data) {
        this.propertyFiltercounties = data;
    }

    selectedPropertyCountyValue(selectedCounty) {
        this.logService.log(selectedCounty);
        this.propertySelectedCounty = selectedCounty;
        this.model.PropertyCounty = selectedCounty;
    }

    selectedPropertyCityValue(selectedCity) {
        this.logService.log(selectedCity);
        this.propertySelectedCity = selectedCity;
        this.model.PropertyCity = selectedCity;
    }
    //Property -> Zip, City, State, County End

    onSave() {

        if (this.model.PropertyType == null || this.model.PropertyType == "Please Select") {
            alert('Please Select Property Type');
            return;
        }

        for (var item in this.propertyDetailList)
        {
            this.propertyDetailList[item]["RowId"] = +item + 1;

            if (this.propertyDetailList[item]["ExpirationDate"] == "1900-01-01T00:00:00" || this.propertyDetailList[item]["ExpirationDate"] == null) {
                this.propertyDetailList[item]["ExpirationDate"] = "";
            }

            if (this.propertyDetailList[item]["LeaseDate"] == "1900-01-01T00:00:00" || this.propertyDetailList[item]["LeaseDate"] == null) {
                this.propertyDetailList[item]["LeaseDate"] = "";
            }

            this.propertyDetailList[item]["CreatedBy"] = ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_user_FullName);

        }

        this.model.PropertyDetailList = this.propertyDetailList;


        this.child.showLoader();
        this.httpService.savePropertyDetail(this.model)
            .subscribe(
            data => this.saveHandler(data),
            error => {
                //this.child.showSaveErrorNotification();
                this.child.hideLoader();
            },
            () => this.logService.log("API Call Finished Successfully!")
            );

        //this.successMessageDisplay = true;
    }

    saveHandler(data) {
        this.child.hideLoader();
        if (data < 0)
            this.child.showErrorNotification('Property Detail save failed', 'Error!');
        else {
            this.child.showSuccessNotification('Property Detail saved successfully', 'Success!');
        }
    }

    //Buyer -> Zip, City, State, County Start
    selectedBuyerStateValue(selectedState) {
        this.logService.log(selectedState);
        this.buyerSelectedState = selectedState;
        this.model.BuyerState = selectedState;
    }

    GetBuyerCityAndState(data) {
        if (data !== null && data !== '' && data !== undefined) {
            this.httpService.getStateCountyByZip(data)
                .subscribe(
                data => this.getBuyerStateCountyByZip(data),
                error => this.logService.log(error),
                () => this.logService.log("API Call Finished Successfully!")
                );
        }
    }

    public getBuyerStateCountyByZip(data) {
        if (data) {
            this.model.BuyerState = data[0].StateAbbr;
            this.model.BuyerCity = data[0].CityName;
            this.model.BuyerCounty = data[0].CountyName;
            this.logService.log(data);
        }
    }

    GetBuyerCitiesbyState(data) {
        this.buyerFilterCities = data;
    }

    GetBuyerCountybyState(data) {
        this.buyerFiltercounties = data;
    }

    selectedBuyerCountyValue(selectedCounty) {
        this.logService.log(selectedCounty);
        this.buyerSelectedCounty = selectedCounty;
        this.model.BuyerCounty = selectedCounty;
    }

    selectedBuyerCityValue(selectedCity) {
        this.logService.log(selectedCity);
        this.buyerSelectedCity = selectedCity;
        this.model.BuyerCity = selectedCity;
    }
    //Buyer -> Zip, City, State, County End

    //Seller -> Zip, City, State, County Start
    selectedSellerStateValue(selectedState) {
        this.logService.log(selectedState);
        this.sellerSelectedState = selectedState;
        this.model.SellerState = selectedState;

        //remove the line if City is not DropDown
        //this.model.sellerCity = '';
    }

    GetSellerCityAndState(data) {
        if (data !== null && data !== '' && data !== undefined) {
            this.httpService.getStateCountyByZip(data)
                .subscribe(
                data => this.getSellerStateCountyByZip(data),
                error => this.logService.log(error),
                () => this.logService.log("API Call Finished Successfully!")
                );
        }
    }

    public getSellerStateCountyByZip(data) {
        if (data) {
            this.model.SellerState = data[0].StateAbbr;
            this.model.SellerCity = data[0].CityName;
            this.model.SellerCounty = data[0].CountyName;
            this.logService.log(data);
        }
    }

    GetSellerCitiesbyState(data) {
        this.sellerFilterCities = data;
    }

    GetSellerCountybyState(data) {
        this.sellerFiltercounties = data;
    }

    selectedSellerCountyValue(selectedCounty) {
        this.logService.log(selectedCounty);
        this.sellerSelectedCounty = selectedCounty;
        this.model.SellerCounty = selectedCounty;
    }

    selectedSellerCityValue(selectedCity) {
        this.logService.log(selectedCity);
        this.sellerSelectedCity = selectedCity;
        this.model.SellerCity = selectedCity;
    }
    //Seller -> Zip, City, State, County End

    getPropertyDetail() {

        this.httpService.getPropertyDetail(this.model.XRefId)
            .subscribe(
            data => this.loadPropertyDetailGrid(data),
            error => this.logService.log(error + ": error in Property Detail call"),
            () => this.logService.log("Property Detail loaded Successfully!")
            );
    }

    loadPropertyDetailGrid(data) {
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


        var prpdtl: any;


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
            ExpirationDate:"",

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

        for (var item in this.propertyDetailList) // for acts as a foreach
        {
            if (this.propertyDetailList[item]["PropertyDetail"] == "Address Information")
            {
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

                if (this.propertyDetailList[item]["PropertyAddressSuffix"] == "PA")
                {
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
            //index = index + 1;
        }

        if (indexPA !== -1 || indexBA !== -1 || indexSA !== -1) {
            this.propertyDetailList.push(prpdtl);
        }


        let temp = 0;
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
    }

    clear() {
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
    }

    onCancel() {
        ClientStorage.setSessionStorageItem(ClientStorageConstants.LS_RP_orderno, this.orderNo);

        this.router.navigate(['OrderSummary']);
    }

    clearPropertyDetailSection(value) {
        this.model.PropertyDetail = value;
        this.clear();
    }
}