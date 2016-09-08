import {Component, OnInit, Inject, provide, ViewChild, AfterViewInit} from '@angular/core';
import {Http} from '@angular/http';
import {NgForm}    from '@angular/forms';
import {Router, RouteParams} from '@angular/router-deprecated';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {StateComponent} from '../DropDowns/state/state.component';
import {CityComponent} from '../DropDowns/city/city.component';
import {CountyComponent} from '../DropDowns/county/county.component';
import {CityService} from '../DropDowns/city/city.service';
import {ReferenceDataService} from '../referenceData/reference-data.service';
import {LoggingService} from '../common/logging';
import {OrderEntryRequest, OrderEntryDetailRequest} from './order-entry.model';
import {OrderEntryService} from './order-entry.service';
import {NotificationsComponent} from '../notifications/notifications.component';
import {ClientStorage} from '../common/ClientStorage';
import {GridComponent} from '../grid/grid.component';
import {Column} from '../grid/column';
import {Utility} from '../common/utility';
import {AccountProfileService} from '../accountProfile/account-profile.service';
import {ClientStorageConstants} from '../common/constants';

declare var jQuery;
declare var moment: any;
declare var ApplyMask;

@Component({
    selector: 'order-entry',
    templateUrl: '../dev/tpl/order-entry.html',
    inputs: ['state'],
    directives: [StateComponent, CityComponent, CountyComponent, NotificationsComponent, GridComponent/*, VendorMainInfo, VendorAdditionalAddressClass, ContactComponent*/],
    providers: [ AccountProfileService ,CityService, provide(APP_CONFIG, { useValue: CONFIG }), //VendorService, 
        ReferenceDataService, OrderEntryService, LoggingService        
    ]
})

export class OrderEntryComponent implements OnInit, AfterViewInit {
    
    routeParams: RouteParams;
    router: Router;    
    httpService: OrderEntryService;
    appConfig: Config;
    getData: string;
    postData: string;
    referenceDataService: ReferenceDataService;
    accountProfileService: AccountProfileService;    
    states = ['Alabama', 'Arizona', 'California', 'Colorado', 'Delaware'];
    cities = ['Lead', 'Recruite', 'Vendor'];
    model = new ClientClass();    
    emailFound = false;
    submitted = false;
    cancelClick = false;
    selectedState = "";    
    vendorTypes: Array<any>;
    emailOrPhoneEmpty = true;
    @ViewChild(NotificationsComponent) child: NotificationsComponent;
    utility = new Utility();
    successMessageDisplay: boolean;
    isPhoneEmpty = true;
    isPhoneDuplicate = true;
    isEmailEmpty = true;
    isEmailDuplicate = true;
    logService: LoggingService;
    modelOrderEntryFetch = new OrderEntryRequest();
    modelOrderEntrySave = new OrderEntryDetailRequest();
    active = true;

    tranType: string;
    transactionTypes: Array<any>;
    contactType: string;
    contactTypes: Array<any>;
    contactName: string;
    contactNames: Array<any>;
    propType: string;
    propertyTypes: Array<any>;
    loanType: string;
    loanTypes: Array<any>;
    maritalStatus: string;
    maritalStatuses: Array<any>;
    lenderId: number;

    streetNo: string = "";
    streetName: string = "";
    Address2: string = "";
    amount: number = null;
    loanNumber: string = "";
    borrowerFirstName: string = "";
    borrowerLastName: string = "";
    borrowerPhone: string = "";
    borrowerCell: string = "";
    borrowerEmail: string = "";
    borrowerSSN: string = "";
    instructions: string = "";
    
    transactionTypeGridColumns: Array<Column>;
    transactionTypeList = new Array<any>();
    
    borrowerGridColumns: Array<Column>;
    borrowerList = new Array<any>();

    zip: string;
    city: string;
    county: string;
    state: string;
    selectedCounty = "";
    selectedCity = "";
    filterCities: Array<any>;
    filtercounties: Array<any>;

    clientList = new Array<any>();

    isAddBorrowerLink = false;
    isAddBorrowerPanel = false;
    isBorrowerGrid = false;
    isEditMode = false;
    borrowerId: number = 0;
    borrowerCount: number = 0;
    currentCollapsable: number = 1;    
    screenName: string = ClientStorageConstants.LS_OrderEntry;

    displayBorrowerSSN: string = "";
    displayBorrowerPhone: string = "";
    displayBorrowerCell: string = "";
    displayAmount: string = "";

    constructor( @Inject(APP_CONFIG) _appConfig: Config, @Inject(ReferenceDataService) _referenceData, @Inject(RouteParams) _routeParams, @Inject(Router) _router,
        @Inject(OrderEntryService) _service, @Inject(AccountProfileService) _accountProfileService, @Inject(LoggingService) _logservice) {
        this.appConfig = _appConfig;        
        this.referenceDataService = _referenceData;
        this.accountProfileService = _accountProfileService;
        this.httpService = _service;        
        this.router = _router;
        this.routeParams = _routeParams;
        this.model = new ClientClass();       
        this.logService = _logservice; 
    }

    ngOnInit() {
        this.transactionTypeGridColumns = this.getTransactionTypeGridColumns();               
    }
    
    ngAfterViewInit() {        
        this.populateTransactionType();        
        this.populatePropertyType();
        this.populateLoanType();
        this.populateMaritalStatus();
        this.populateClients();

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
        this.borrowerGridColumns = this.getBorrowerGridColumns();
        var obj = JSON.parse(ClientStorage.getSessionStorageItem(this.screenName));
        for (var index in obj) {
            if (obj[index]["Parent"] == "OrderEntryBorrowerGrid") {
                if (!obj[index]["IsVisible"])
                    this.findAndRemove(this.borrowerGridColumns, "name", obj[index]["CtrlName"]);
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
                //Remove from array
                array.splice(index, 1);
            }
        });
    }

    getCurrentDateTime() {
        return moment().format('MM/DD/YYYY HH:mm');
    }

    getCurrentUserID() {
        let contactId = this.utility.getContactId(); 

        if (contactId !== null)
            return contactId;
        return null;
    }

    getClientID() {
        let clientId = this.utility.getClientId();
        if (clientId !== null) {
            this.modelOrderEntryFetch.ClientID = clientId;
            return this.modelOrderEntryFetch.ClientID;
        }
        return null;
    }

    selectedStateValue(selectedState) {
        this.logService.log(selectedState);
        this.selectedState = selectedState;
        this.model.state = selectedState;        
        this.model.city = '';
    }
    
    SaveLeadEntry() {
        this.child.showLoader();
        jQuery("#cancel").prop('disabled', true);
        jQuery("#btnAdd").prop('disabled', true);
        
        this.successMessageDisplay = true;
    }

    onSubmit() {
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
        }        else {
            this.cancelClick = false;
        }
    }

    Clear() {
        this.modelOrderEntryFetch = new OrderEntryRequest();
        this.modelOrderEntrySave = new OrderEntryDetailRequest();
        this.model = new ClientClass();
        this.transactionTypeList = new Array<any>();
        this.borrowerList = new Array<any>();
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
        setTimeout(() => this.active = true, 0);
    }

    public getVendorTypes(data) {
        this.vendorTypes = data;
        this.child.hideLoader();
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

    IsPhoneDuplicate(phone) {
        if (phone !== null && phone !== '' && phone !== undefined) {
            this.isPhoneEmpty = false;
            
        }
        else
            this.isPhoneEmpty = true;
    }

    successGetPhone(data) {
        this.isPhoneDuplicate = data;
    }

    IsEmailDuplicate(emailAddress) {
        if (emailAddress !== null && emailAddress !== '' && emailAddress !== undefined) {
            this.isEmailEmpty = false;            
        }
        else
            this.isEmailEmpty = true;
    }

    successGetEmail(data) {
        this.isEmailDuplicate = data;
    }

    ConfirmCancel() {
        this.cancelClick = true;
        if (confirm("Are you sure you want to discard these changes?"))
            this.Clear();
    }
    
    blurPhone(sender) {        
        if (this.displayBorrowerPhone !== null && this.displayBorrowerPhone !== "") {
            this.displayBorrowerPhone = sender.target.value;
            this.displayBorrowerPhone = this.displayBorrowerPhone.substr(0, 12);
            this.borrowerPhone = this.displayBorrowerPhone;
            this.displayBorrowerPhone = this.utility.formatPhoneCell(this.displayBorrowerPhone);
        }
        else
            this.borrowerPhone = null;
    }

    focusPhone(sender) {
        if (this.borrowerPhone !== null)
            this.displayBorrowerPhone = this.borrowerPhone;
        else
            this.displayBorrowerPhone = "";
        ApplyMask();
    }

    blurCell(sender) {        
        if (this.displayBorrowerCell !== null && this.displayBorrowerCell !== "") {
            this.displayBorrowerCell = sender.target.value;
            this.displayBorrowerCell = this.displayBorrowerCell.substr(0, 12);
            this.borrowerCell = this.displayBorrowerCell;
            this.displayBorrowerCell = this.utility.formatPhoneCell(this.displayBorrowerCell);
        }
        else
            this.borrowerCell = null;
    }

    focusCell(sender) {
        if (this.borrowerCell !== null)
            this.displayBorrowerCell = this.borrowerCell;
        else
            this.displayBorrowerCell = "";
        ApplyMask();
    }

    blurSSN(sender) {        
        if (this.displayBorrowerSSN !== null && this.displayBorrowerSSN !== "") {
            this.displayBorrowerSSN = sender.target.value;
            this.displayBorrowerSSN = this.displayBorrowerSSN.substr(0, 11);
            this.borrowerSSN = this.displayBorrowerSSN;
            this.displayBorrowerSSN = this.displayBorrowerSSN.replace(this.displayBorrowerSSN.substring(0, this.displayBorrowerSSN.lastIndexOf("-") + 1), "***-**-");
        }
        else
            this.borrowerSSN = null;
    }

    focusSSN(sender) {
        if (this.borrowerSSN !== null)
            this.displayBorrowerSSN = this.borrowerSSN;
        else
            this.displayBorrowerSSN = "";
        ApplyMask();
    }

    blurLoanAmount(sender) {
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
    }

    focusLoanAmount(sender) {
        if (this.amount !== null)
            this.displayAmount = this.amount.toString();
        else
            this.displayAmount = "";
    }

    populateTransactionType() {        
        this.child.showLoader();
        this.referenceDataService.getddlType('TransactionType')
            .subscribe(
            data => this.loadTransactionType(data),
            error => {
                this.child.hideLoader();
                this.child.showErrorNotification("error in Transaction Type DropDown call", "Error !");
            },
            () => this.logService.log("Transaction Type loaded Successfully!")
            );
    }

    loadTransactionType(data) {
        this.child.hideLoader();
        this.transactionTypes = data;
        this.tranType = "Please Select";        
    }

    populateContactType() {
        this.child.showLoader();
        this.referenceDataService.getddlType('ContactType')
            .subscribe(
            data => this.loadContactType(data),
            error => {
                this.child.hideLoader();
                this.logService.log(error + ": error in Contact Types DropDown call")
            },
            () => this.logService.log("Contact Types loaded Successfully!")
            );
    }

    loadContactType(data) {
        this.child.hideLoader();
        this.contactTypes = data;
        this.contactType = "Please Select";
    }

    filterContacts(sender) {        
        this.lenderId = sender.target.value;
        this.contactName = "";
        this.contactNames = null;
        setTimeout(() => this.contactName = "", 0);
        this.populateContactName();        
    }

    populateContactName() {
        this.child.showLoader();
        this.httpService.getClientContactNames(this.lenderId, this.modelOrderEntryFetch.Suffix, this.modelOrderEntryFetch.ShowMultiLevels)
            .subscribe(
            data => this.loadContactName(data),
            error => {
                this.child.hideLoader();
                this.child.showErrorNotification("error in Contact Names DropDown call", "Error !")
            },
            () => this.logService.log("Contact Names loaded Successfully!")
            );
    }

    loadContactName(data) {
        this.child.hideLoader();
        this.contactNames = data;
        this.contactName = "Please Select";
    }

    populatePropertyType() {
        this.child.showLoader();
        this.referenceDataService.getddlType('ClientPropertyType')
            .subscribe(
            data => this.loadPropertyType(data),
            error => {
                this.child.hideLoader();
                this.child.showErrorNotification("error in Property Types DropDown call", "Error !");
            },
            () => this.logService.log("Property Types loaded Successfully!")
            );
    }

    loadPropertyType(data) {
        this.child.hideLoader();
        this.propertyTypes = data;
        this.propType = "Please Select";
    }

    populateLoanType() {
        this.child.showLoader();
        this.referenceDataService.getddlType('LenderLoanType')
            .subscribe(
            data => this.loadLoanType(data),
            error => { this.child.hideLoader(); this.logService.log(error + ": error in Loan Types DropDown call") },
            () => this.logService.log("Loan Types loaded Successfully!")
            );
    }

    loadLoanType(data) {
        this.child.hideLoader();
        this.loanTypes = data;
        this.loanType = "Please Select";
    }

    populateMaritalStatus() {
        this.child.showLoader();
        this.httpService.getMaritalStatus()
            .subscribe(
            data => this.loadMaritalStatus(data),
            error => { this.child.hideLoader(); this.logService.log(error + ": error in Marital Status DropDown call") },
            () => this.logService.log("Marital Status loaded Successfully!")
            );
    }

    loadMaritalStatus(data) {
        this.child.hideLoader();
        this.maritalStatuses = data;
        this.maritalStatus = "Please Select";     
    }

    getTransactionTypeGridColumns(): Array<Column> {
        return [
            new Column('DeleteOnly', 'Delete'),            
            new Column('TransactionType', 'Transaction')
        ];
    }

    OnAddTransactionType() {
        var index: any;
        index = this.findItem(this.transactionTypeList, 'ProductCode', this.tranType);

        if (index !== -1) {
            this.child.showErrorNotification('Transaction already added in list', 'Error!');
            return;
        }

        var sTransaction = jQuery('#ddlTranType option:selected').text();
        var obj: any;
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
    }

    deleteTransactionTypeRow(model) {
        this.findAndRemove(this.transactionTypeList, 'ProductCode', model.ProductCode);

        var jsonTempList = JSON.parse(JSON.stringify(this.transactionTypeList));
        this.transactionTypeList = JSON.parse(JSON.stringify(jsonTempList));
    }

    getBorrowerGridColumns(): Array<Column> {
        return [            
            new Column('FirstName', 'First Name'),
            new Column('LastName', 'Last Name'),
            new Column('HomePhone', 'Home Phone'),
            new Column('CellPhone', 'Cell Phone'),
            new Column('Email', 'Email'),
            new Column('DeleteOnly', ''),
            new Column('EditOnly', '')
            
        ];
    }

    OnAddBorrower() {
        var index: any;
        index = this.findItem(this.borrowerList, 'BorrowerId', this.borrowerId);

        if (this.borrowerFirstName.trim().length == 0 || this.borrowerLastName.trim().length == 0)
        {
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

        let marstatid = null;
        if (this.maritalStatus == "Please Select")
            marstatid = 0
        else
            marstatid = this.maritalStatus;

        var obj: any;
        obj = {
            EnteredBy: "Website",
            LastModBy: this.getCurrentUserID(),
            Type: "Borrower",
            FullName: (this.borrowerFirstName || ' ' || this.borrowerLastName),
            FirstName: this.borrowerFirstName,
            LastName: this.borrowerLastName,
            HomePhone: borrowerPhoneWithoutDash,    //this.borrowerPhone,
            CellPhone: borrowerCellWithoutDash,     //this.borrowerCell,
            Email: this.borrowerEmail,
            SSN: borrowerSSNWithoutDash,            //this.borrowerSSN,            
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
    }

    deleteBorrowerRow(model) {
        var strconfirm = confirm("Are you sure you want to delete?");
        if (strconfirm == true) {
            this.findAndRemove(this.borrowerList, 'BorrowerId', model.BorrowerId);

            var jsonTempList = JSON.parse(JSON.stringify(this.borrowerList));
            this.borrowerList = JSON.parse(JSON.stringify(jsonTempList));
        }
    }

    editBorrowerRow(model) {
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
    }

    onSave() {
        
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
        this.modelOrderEntrySave.ClientId = this.lenderId;      //this.getClientID();
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
        this.modelOrderEntrySave.ContactType = "Loan Officer";      //this.contactType;
        this.modelOrderEntrySave.ContactName = this.contactName;

        this.modelOrderEntrySave.TransactionTypeList = this.transactionTypeList;        
        this.modelOrderEntrySave.BorrowerList = this.borrowerList;

        this.httpService.saveOrderEntry(this.modelOrderEntrySave)
            .subscribe(
            data => this.saveHandler(data),
            error => {
                this.child.showSaveErrorNotification();
                this.child.hideLoader();
            },
            () => this.logService.log("API Call Finished Successfully!")
            );
    }

    saveHandler(data) {
        this.child.hideLoader();
        if (data < 0)
            this.child.showErrorNotification('Order creation failed', 'Error!');
        else {
            this.child.showSuccessNotification('Order is successfully created with Order No ' + data, 'Success!');            
            this.Clear();
        }
    }

    populateClients() {
        this.logService.log(this.getClientID());
        this.httpService.getClientList(this.getClientID())
            .subscribe(
            data => this.loadClients(data),
            error => this.logService.log(error + ": error in Lender DropDown call"),
            () => this.logService.log("Lenders loaded Successfully!")
            );
    }

    loadClients(data) {
        this.clientList = data;
        this.lenderId = 0;        
    }

    Previous(previousId) {
        this.currentCollapsable = previousId;
    }

    Next(nextId) {
        this.currentCollapsable = nextId;        
    }

    AddTransactionType(transactionName, transactionCode) {       

        var obj: any;
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
    }

    ToggleAddBorrower(isEnableVisible) {
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
    }
}

class ClientClass {
	constructor(		
        public zip: string = null,
        public city: string = null,
        public county: string = null,
        public state: string = null        
	) { }
}