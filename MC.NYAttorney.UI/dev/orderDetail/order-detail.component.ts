/// <reference path="../common/utility.ts" />
import {Component, OnInit, Inject, provide, ViewChild, AfterViewInit} from '@angular/core';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {Http} from '@angular/http';
import {NgForm}    from '@angular/forms';
import {Router,RouteParams} from '@angular/router-deprecated';
import {ReferenceDataService} from '../referenceData/reference-data.service';
import {NotificationsComponent} from '../notifications/notifications.component';
import {LoggingService} from '../common/logging';
import {OrderDetail} from './order-detail.model';
import {OrderMasterDetails} from './order-detail.model';
import {OrderDetailService} from './order-detail.service';
import {GridComponent} from '../grid/grid.component';
import {Column} from '../grid/column';
import {Utility} from '../common/utility';
import {AccountProfileService} from '../accountProfile/account-profile.service';
import {LeftNavigationComponent} from '../common/left-navigation.component';
import {HeaderDetailComponent} from '../common/header-detail.component';
import {ClientStorage} from '../common/ClientStorage';
import {enmTabs} from "../common/enumerations";
import {ClientStorageConstants} from '../common/constants';
declare var moment: any;
declare var jQuery: any;
declare var ApplyMask;
declare var ApplyDateMask;

@Component({
    selector: 'order-detail',
    templateUrl: '../dev/tpl/order-detail.html',
    directives: [GridComponent, NotificationsComponent, LeftNavigationComponent,HeaderDetailComponent],
    providers: [ provide(APP_CONFIG, { useValue: CONFIG }), ReferenceDataService, OrderDetailService, AccountProfileService, LoggingService]

})
    
export class OrderDetailComponent implements AfterViewInit {
    routeParams: RouteParams;
    router: Router;
    clientTab: enmTabs;
    model = new OrderDetail();
    utitlity = new Utility();
    partyModel = new Party();
    @ViewChild(NotificationsComponent) child: NotificationsComponent;
    @ViewChild(HeaderDetailComponent) headerChild: HeaderDetailComponent;
    maritalStatuses: Array<any>;
    partyTypes: Array<any>;
    mortgageTypes: Array<any>;
    residentTypes: Array<any>;
    borrowerGridColumns: Array<Column>;
    loanPurposes: Array<any>;
    loanProductTypes: Array<any>;
    accountProfileService: AccountProfileService;
    isAddBorrowerLink = false;
    isAddBorrowerPanel = false;
    isBorrowerGrid = false;
    isEditMode = false;
    currentCollapsable: number = 1;
    utility = new Utility();
    maxSeq: number = -1;
    mortgageType: string;
    residentType: string;
    logService: LoggingService;
    ShowPartyDiv: number = 0;
    isFixed: boolean;    
    isRowEdited: boolean = false;
    borrowerCount: number = 0;
    
    OrderNo: string = "";
    OrderSource: string = "";
    LoanNo: string = "";    
    ResidentType: string = "";
    NumberofUnits: string = "";
    YearPropertyAcquired: string = "";
    LoanCategory: string = null;
    LoanAmount: number = null;
    LoanRate: string = "";
    LoanTerm: string = "";
    LoanType: string = "";
    RateLockDate: string = ""; //Convert to date
    AnticipatedSettlementDate: string = ""; //convert to date
    EnteredBy: string = "";
    loanPurpose: string = "";    
    screenName: string = ClientStorageConstants.LS_OrderDetail;
    displayBorrowerSSN: string = "";
    displayBorrowerPhone: string = "";
    displayBorrowerCell: string = "";
    displayAmount: string = "";
    referenceDataService: ReferenceDataService;
    httpService: OrderDetailService;
    appConfig: Config;
    isValidPropertyAcquiredDate = true;
    isValidRateLockDate = true;
    isValidAnticipatedSettlementDate = true;

    constructor( @Inject(OrderDetailService) _orderService, @Inject(ReferenceDataService) _referenceData,
        @Inject(AccountProfileService) _accountProfileService, @Inject(RouteParams) _routeParams, @Inject(Router) _router, @Inject(LoggingService) _logservice,
        @Inject(APP_CONFIG) _appConfig: Config) {
        this.httpService = _orderService;
        this.referenceDataService = _referenceData;
        this.routeParams = _routeParams;
        this.router = _router;
        let orderNo = + ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_orderno);
        this.model.OrderMaster.OrderNo = orderNo.toString();
        this.accountProfileService = _accountProfileService;
        this.clientTab = enmTabs.OrderDetail;
        this.logService = _logservice;
        this.maritalStatuses = [];
        this.appConfig = _appConfig;
    }
    
    ngAfterViewInit() {
        this.loadDatePicker();

        this.populateMaritalStatus();
        this.populatePartyType();
        this.populateMortgageType();
        this.populateResidentType();
        this.populateLoanPurpose();
        this.populateLoanProductTypes();
        this.getOrderDetails();                
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
            if (obj[index]["Parent"] == "OrderDetailBorrowerGrid") {
                if (!obj[index]["IsVisible"])
                    this.findAndRemove(this.borrowerGridColumns, "name", obj[index]["CtrlName"]);
            }
        }
    }
    
    populateMaritalStatus() {
        this.child.showLoader();
        this.httpService.getMaritalStatus()
            .subscribe(
            data => this.loadMaritalStatus(data),
            error => {
                this.child.hideLoader();
                this.child.showErrorNotification("error in Marital Status DropDown call", "Error !");
            },
            () => this.logService.log("Marital Status loaded Successfully!")
            );
    }

    getOrderDetails() {
        this.child.showLoader();
        this.httpService.getOrderDetails(this.model.OrderMaster.OrderNo)
            .subscribe(
            data => this.loadOrderDetails(data),
            error => {
                this.child.hideLoader();
                this.child.showErrorNotification("error in Marital Status DropDown call", "Error !");
            },
            () => this.logService.log("Marital Status loaded Successfully!")
            );
    }

    populateLoanPurpose() {
        this.child.showLoader();
        this.referenceDataService.getddlType('LenderLoanType')
            .subscribe(
            data => this.loadLoanPurpose(data),
            error => { this.child.hideLoader(); this.child.showErrorNotification("error in Loan Purpose DropDown call", "Error !"); },
            () => this.logService.log("Loan Purpose loaded Successfully!")
            );
    }

    loadLoanPurpose(data) {
        this.child.hideLoader();
        this.loanPurposes = data;
    }

    populateLoanProductTypes() {
        this.referenceDataService.getddlType('LoanProductType')
            .subscribe(
            data => this.loadLoanProductTypes(data),
            error => {
                this.child.hideLoader();
                this.child.showErrorNotification(": error in Loan Product Type DropDown call","Error !")
            },
            () => this.logService.log("Loan Product Types loaded Successfully!")
            );
    }

    loadLoanProductTypes(data) {
        this.child.hideLoader();
        this.loanProductTypes = data;
    }

    loadOrderDetails(data) {        
        this.child.hideLoader();
        this.model.PartyList = data.PartyList == null ? [] : data.PartyList;//data.PartyList;
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
    }
    
    loadMaritalStatus(data) {
        this.child.hideLoader();
        this.maritalStatuses = data;        
    }

    populatePartyType() {
        this.child.showLoader();
        this.referenceDataService.getddlType('PartyType')
            .subscribe(
            data => this.loadPartyType(data),
            error => {
                this.child.hideLoader();
                this.child.showErrorNotification("error in Party Types DropDown call", "Error !");
            },
            () => this.logService.log("Party Types loaded Successfully!")
            );
    }

    loadPartyType(data) {
        this.child.hideLoader();
        this.partyTypes = data;
    }

    populateMortgageType() {
        this.child.showLoader();
        this.referenceDataService.getddlType('HUDLoanType')
            .subscribe(
            data => this.loadMortgageType(data),
            error => {
                this.child.hideLoader();
                this.child.showErrorNotification("error in Mortgage Types DropDown call", "Error");
            },
            () => this.logService.log("Mortgage Types loaded Successfully!")
            );
    }

    loadMortgageType(data) {
        this.child.hideLoader();
        this.mortgageTypes = data;
    }

    populateResidentType() {
        this.child.showLoader();
        this.referenceDataService.getddlType('ResidenceType')
            .subscribe(
            data => this.loadResidentType(data),
            error => {
                this.child.hideLoader();
                this.child.showErrorNotification("error in Resident Types DropDown call", "Error !");

            },
            () => this.logService.log("REsident Types loaded Successfully!")
            );
    }

    loadResidentType(data) {
        this.child.hideLoader();
        this.residentTypes = data;
        this.residentType = "Please Select";
    }

    ClearParty() {
        this.partyModel = new Party();
        this.isRowEdited = false;

        this.displayBorrowerPhone = "";
        this.displayBorrowerCell = "";
        this.displayBorrowerSSN = "";
    }

    redirectToSummary() {    

        ClientStorage.setSessionStorageItem(ClientStorageConstants.LS_RP_orderno, this.model.OrderMaster.OrderNo);
        this.router.navigate(['OrderSummary']);
    }

    Clear() {
        this.model = new OrderDetail();
        let orderNo = + ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_orderno);
        this.model.OrderMaster.OrderNo = orderNo.toString();
        this.getOrderDetails();        
        this.mortgageType = "Please Select";
        this.residentType = "Please Select";
        this.ClearParty();
    }

    deleteBorrowerRow(model) {
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
    }

    findAndRemove(array, property, value) {
        array.forEach(function (result, index) {
            if (result[property] === value) {
                //Remove from array
                array.splice(index, 1);
            }
        });
    }

    getBorrowerGridColumns(): Array<Column> {
        return [
            new Column('Type', 'Party Type'),
            new Column('FullName', 'Name'),
            new Column('HomePhone', 'Home Phone'),
            new Column('CellPhone', 'Cell Phone'),            
            new Column('MaritalStatusText', 'Marital Status'),
            new Column('Email', 'Email'),
            new Column('EditOnly', ''),
            new Column('DeleteOnly', '')
        ];
    }

    findItem(array, property, value) {
        for (var index = 0; index < array.length; index++) {
            if (array[index][property] === value) {
                return index;
            }
        }
        return -1;
    }

    OnAddBorrower() {
        var indexFirstName: any;
        var indexLastName: any;
        var index: any;
        index = this.findItem(this.model.PartyList, 'BorrowerId', this.partyModel.BorrowerId);
        indexFirstName = this.findItem(this.model.PartyList, 'FullName', this.partyModel.FirstName);
        indexLastName = this.findItem(this.model.PartyList, 'FullName', this.partyModel.LastName);
        if (indexFirstName !== -1 && indexLastName !== -1 && !this.isRowEdited) {
            this.child.showErrorNotification('Borrower already added in list', 'Error!');
            return;
        }
        if (this.partyModel.HomePhone == "--") this.partyModel.HomePhone = "";
        if (this.partyModel.CellPhone == "--") this.partyModel.CellPhone = "";
        if (this.partyModel.SSN == "--") this.partyModel.SSN = "";
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
        var obj: any;
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
        this.model.OrderMaster.EnteredBy = this.utitlity.getContactId();//"username";
        this.httpService.saveOrderDeatil(this.model)
            .subscribe(
            data => this.saveHandler(data),
            error => {
                this.child.showSaveErrorNotification();
                this.child.hideLoader();
            },
            () => this.logService.log("API Call Finished Successfully!")
            );
    }

    getMaritalStatusText(id) {
        for (var i = 0; i < this.maritalStatuses.length; i++) {
            if (id == this.maritalStatuses[i].Id) {
                return this.maritalStatuses[i].StatusCode;
            }
        }        
    }
    
    OnSaveClick() {
        if (this.model.OrderMaster.NonOwnerOccupied == "null" ) {
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
            this.model.OrderMaster.EnteredBy = this.utitlity.getContactId();//"username";
            this.httpService.saveOrderDeatil(this.model)
                .subscribe(
                data => this.saveHandler(data),
                error => {
                    this.child.showSaveErrorNotification();
                    this.child.hideLoader();
                },
                () => this.logService.log("API Call Finished Successfully!")
            );
        }
    }

    //Masking Start
    blurPhone(sender) {
        //this.partyModel.HomePhone = sender.target.value;
        if (this.displayBorrowerPhone !== null && this.displayBorrowerPhone !== "") {
            this.displayBorrowerPhone = sender.target.value;
            this.displayBorrowerPhone = this.displayBorrowerPhone.substr(0, 12);
            this.partyModel.HomePhone = this.displayBorrowerPhone;
            this.displayBorrowerPhone = this.utility.formatPhoneCell(this.displayBorrowerPhone);
        }
        else
            this.partyModel.HomePhone = null;
    }

    focusPhone(sender) {
        if (this.partyModel.HomePhone !== null) {
            this.displayBorrowerPhone = this.partyModel.HomePhone;
            
        }
        else
            this.displayBorrowerPhone = "";
        ApplyMask();
    }
    
    blurCell(sender) {
        //this.partyModel.CellPhone = sender.target.value;
        if (this.displayBorrowerCell !== null && this.displayBorrowerCell !== "") {
            this.displayBorrowerCell = sender.target.value;
            this.displayBorrowerCell = this.displayBorrowerCell.substr(0, 12);
            this.partyModel.CellPhone = this.displayBorrowerCell;
            this.displayBorrowerCell = this.utility.formatPhoneCell(this.displayBorrowerCell);
        }
        else
            this.partyModel.CellPhone = null;
    }

    focusCell(sender) {
        if (this.partyModel.CellPhone !== null) {
            this.displayBorrowerCell = this.partyModel.CellPhone;
            
        }
        else
            this.displayBorrowerCell = "";
        ApplyMask();
    }

    blurSSN(sender) {        
        if (this.displayBorrowerSSN !== null && this.displayBorrowerSSN !== "") {
            this.displayBorrowerSSN = sender.target.value;
            this.displayBorrowerSSN = this.displayBorrowerSSN.substr(0, 11);
            this.partyModel.SSN = this.displayBorrowerSSN;    
            this.displayBorrowerSSN = this.displayBorrowerSSN.replace(this.displayBorrowerSSN.substring(0, this.displayBorrowerSSN.lastIndexOf("-") + 1), "***-**-");
        }
        else
            this.partyModel.SSN = null;
    }

    focusSSN(sender) {
        if (this.partyModel.SSN !== null) {
            this.displayBorrowerSSN = this.partyModel.SSN;            
        }
        else
            this.displayBorrowerSSN = "";
        ApplyMask();
    }    

    ShowParty() {
        this.ShowPartyDiv = 1;
    }

    PartyTypeChanged(event) {
        this.partyModel.Type = event.target.value;
        this.ClearParty();
    }

    editPartyRow(row) {
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
    }

    saveHandler(data) {        
        if (!data)
            this.child.showErrorNotification('Order creation failed', 'Error!');
        else {
            this.child.showSaveSuccessNotification();
            this.headerChild.getOrderHeader();
            this.Clear();
        }
    }

    ToggleAddBorrower(isEnableVisible) {
        this.isAddBorrowerLink = isEnableVisible;
        this.isAddBorrowerPanel = isEnableVisible;
        this.isBorrowerGrid = !isEnableVisible;
        this.isEditMode = false;
        this.ClearParty();
    }

    CancelAddParty()
    {
        this.ClearParty();
        this.ToggleAddBorrower(false);
    }

    blurLoanAmount(sender) {        
        if (this.displayAmount !== null && this.displayAmount !== "") {
            this.displayAmount = sender.target.value;
            if (this.utility.containsDecimal(this.displayAmount)){
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
    }

    focusLoanAmount(sender) {
        if (this.model.OrderMaster.LoanAmount !== null)
            this.displayAmount = this.model.OrderMaster.LoanAmount.toString();
        else
            this.displayAmount = "";
    }

    loadDatePicker() {
        setTimeout(x => {
            jQuery('.date')
                .datepicker().unbind('blur')
                .blur(y => { this.datehandler(y) });

        }, 500);
    }

    datehandler(d) {
        var dateRegex = this.appConfig.DateRegex;
        if (!dateRegex.test(d.target.value) && d.target.value !== '') {
            //d.target.focus()
            d.target.value = '';
            this.setDateErrorMsg(d.target.id, false);
        } else {
            this.setDateErrorMsg(d.target.id, true);
        }
    }

    setDateErrorMsg(id, status) {
        if (id == 'PropertyAcquiredDate')
            this.isValidPropertyAcquiredDate = status;
        else if (id == 'RateLockDate')
            this.isValidRateLockDate = status;
        else if (id == 'AnticipatedSettlementDate')
            this.isValidAnticipatedSettlementDate = status;
    }
}

export class Party {
    constructor(
        public OrderSource: string = "Website",
        public EnteredBy: string =  "",
        public LastModBy: string =  "",
        public Type: string =  "Borrower",
        public FullName: string =  "",
        public FirstName: string =  "",
        public LastName: string =  "",
        public SequenceNo: number = 0,
        public HomePhone: string = "",
        public CellPhone: string =  "",
        public Email: string = "",
        public SSN: string = "",
        public MaritalStatusId: number = 0,
        public MaritalStatusText: string =  "",
        public OrderNo: string = "",
        public BorrowerId: number = -1
    ){}

}