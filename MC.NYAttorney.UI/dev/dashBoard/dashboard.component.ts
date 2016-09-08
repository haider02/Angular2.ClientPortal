import {Component, OnInit, Inject, provide, ViewChild, AfterViewInit} from '@angular/core';
import {Http} from '@angular/http';
import {NgForm}    from '@angular/forms';
import {Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {ReferenceDataService} from '../referenceData/reference-data.service';
import {NotificationsComponent} from '../notifications/notifications.component';
import {GridComponent} from '../grid/grid.component';
import {Column} from '../grid/column';
import {OrderSearchRequest, OrderSearchDetail} from './dashboard.model';
import {DashBoardService} from './dashboard.service';
import {Utility} from '../common/utility';
import {AccountProfileService} from '../accountProfile/account-profile.service';
import {ClientStorage} from '../common/ClientStorage';
import {Idle, DEFAULT_INTERRUPTSOURCES} from 'ng2-idle/core';
import {Keepalive} from 'ng2-idle-keepalive/core';
import {LoggingService} from '../common/logging';
import {ClientStorageConstants} from '../common/constants';

declare var jQuery;
declare var moment: any;

@Component({
    selector: 'dashboard',
    templateUrl: '../dev/tpl/dashboard.html',
    directives: [ROUTER_DIRECTIVES, NotificationsComponent, GridComponent],
    providers: [provide(APP_CONFIG, { useValue: CONFIG }), ReferenceDataService, DashBoardService, AccountProfileService, LoggingService  ]
})

export class DashBoardComponent implements OnInit, AfterViewInit {
    router: Router;
    appConfig: Config;
    referenceDataService: ReferenceDataService;    
    @ViewChild(NotificationsComponent) child: NotificationsComponent;
    successMessageDisplay: boolean;
    active = true;
    
    httpService: DashBoardService;
    model = new OrderSearchRequest();
    modelOrderSearchDetail = new OrderSearchDetail();
    
    loadStarUrl: string;
    utility = new Utility();    
    logService: LoggingService;
    
    _idle: Idle;
    _keepalive: Keepalive;
    sessionTimeOut: number;
    sessionTimeOutWarning: number;

    orderGridColumns: Array<Column>;
    orderList = new Array<any>();
    allOrderList = new Array<any>();
    productList = new Array<any>();
    allProductList = new Array<any>();
    statusList = new Array<any>();
    branchList = new Array<any>();
    clientList = new Array<any>();
    summaryList = new Array<any>();
    rowsCopy = new Array<any>();

    isSearchClicked = false;
    isViewClicked = false;
    
    selectedBorrowerName = "";
    selectedAddress = "";
    selectedPhone = "";
    selectedCell = "";
    selectedEmail = "";
    selectedNote = "";
    selectedProviderContact = "";
    selectedLoanAmount = "";
    

    inProgressCount = 0;
    titleCompleteCount = 0;
    clearToCloseCount = 0;
    postCompleteCount = 0;

    @ViewChild(GridComponent) gridChild: GridComponent;
    columns: Array<Column>;    

    accountProfileService: AccountProfileService;    
    screenName: string = ClientStorageConstants.LS_Dashboard;
    headerScreenName: string = ClientStorageConstants.LS_HeaderMenu;
    DownloadDocFormVisible: boolean = false;
    documentID: string;
    documentList: Array<any>;

    constructor( @Inject(APP_CONFIG) _appConfig: Config, @Inject(ReferenceDataService) _referenceData, @Inject(Router) _router
        , @Inject(DashBoardService) _service, @Inject(AccountProfileService) _accountProfileService, @Inject(Idle) idle: Idle, @Inject(Keepalive) keepalive: Keepalive
        , @Inject(LoggingService) _logservice
    ) {
        this.appConfig = _appConfig;
        this.referenceDataService = _referenceData;
        this.router = _router;
        this.accountProfileService = _accountProfileService;
        this.httpService = _service;
        this.logService = _logservice;
        
        this._idle = idle;
        this._keepalive = keepalive;
        this.sessionTimeOut = +ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_session_TimeOut);
        this.sessionTimeOutWarning = +ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_session_TimeOut_Warning);

        if (ClientStorage.getLocalStorageItem(ClientStorageConstants.LS_ng2IdleSet) == null) {
            this._keepalive.onPing.subscribe(() => {
                this.logService.log('Keepalive.ping() called!');
                this.httpService.refreshToken()
                    .subscribe(
                        data => {
                            ClientStorage.setSessionStorageItem(ClientStorageConstants.LS_id_token, data.access_token);
                            ClientStorage.setSessionStorageItem(ClientStorageConstants.LS_refresh_token, data.refresh_token);
                        },
                        error => this.logService.log(error),
                        () => this.logService.log("Refresh Token Successfully!")
                    );
            });

            this._keepalive.interval(this.sessionTimeOut * 30);

            this._idle.setIdle(this.sessionTimeOut * 50); 
            
            // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
            this._idle.setTimeout(this.sessionTimeOutWarning * 60); 
            // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
            this._idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

            // Subscribe to idle events. Add your logic on how the application should respond, such as displaying
            // a warning dialog onIdleStart, or redirecting to logout page onTImeout, etc.
            this._idle.onIdleStart.subscribe(() => {
                this.logService.log('IdleStart');
            });
            this._idle.onIdleEnd.subscribe(() => {
                this.logService.log('IdleEnd');
            });
            this._idle.onTimeoutWarning.subscribe((countdown: number) => {
                this.logService.log('TimeoutWarning: ' + countdown);
                if (countdown == (this.sessionTimeOutWarning * 60)) {
                    jQuery("#SessionTimeOutText").text("You've been inactive for a while. You will be automatically signed out in " + this.sessionTimeOutWarning.toString() + " minutes. Please press 'Stay Signed In' to remain logged in.");
                    jQuery("#SessionTimeOutModal").modal('show');
                }
            });
            this._idle.onTimeout.subscribe(() => {
                ClientStorage.clearSessionStorage();
                this._idle.stop();
                jQuery("#SessionTimeOutModal").modal('hide');
                this.router.navigate(['Login']);
            });
            ClientStorage.setLocalStorageItem(ClientStorageConstants.LS_ng2IdleSet, "true");
        }


        if (!this._idle.isRunning())
            this._idle.watch();
    }

    ngOnInit() {          
        this.routetoLogin();        
        this.rateCalculator();
    }

    ngAfterViewInit() {        
        
            
        if (this.utility.getClientId() !== null) {
            this.populateOrderStatus();
            this.populateProducts();
            this.populateClients();
            this.onSearch(true);
            
            if (JSON.parse(ClientStorage.getSessionStorageItem(this.screenName)) == null ) 
                this.accountProfileService.getPermissionsAgainstRole(this.screenName)
                    .subscribe(
                    data => {
                        ClientStorage.setSessionStorageItem(this.screenName, JSON.stringify(data));
                        this.loadRolesAndPermissions(data);
                    },
                    error => this.logService.log(error));
            else
                this.loadRolesAndPermissions(JSON.parse(ClientStorage.getSessionStorageItem(this.screenName)));


            if (JSON.parse(ClientStorage.getSessionStorageItem(this.headerScreenName)) == null)
                this.accountProfileService.getPermissionsAgainstRole(this.headerScreenName)
                    .subscribe(
                    data => {
                        ClientStorage.setSessionStorageItem(this.headerScreenName, JSON.stringify(data));
                        this.loadRolesAndPermissions(data);
                    },
                    error => this.logService.log(error));
            else
                this.loadRolesAndPermissions(JSON.parse(ClientStorage.getSessionStorageItem(this.headerScreenName)));            
        }
        jQuery('.dashboard-wrapper.main').removeClass('login'); 
        this.getDownloadDocumentList();
        
    }


    getDownloadDocumentList() {
        this.httpService.getDownloadDocuments()
            .subscribe(
            data => this.loadDocumentData(data),
            error => this.logService.log(error + ": error while fetching user details"),
            () => this.logService.log("user detials loaded Successfully!")
            );
    }
    
    loadDocumentData(data) {
        this.documentList = data;
        this.documentID = "Please Select";
    }

    onDownloadDocumentSubmit() {
        this.getDocumentsByID(this.documentID);
    }

    cancelDownloadDocument() {

    }

    getDocumentsByID(documentID) {

        for (var i = 0; i < this.documentList.length; i++) {
            if (this.documentList[i].ID.toString() == documentID) {
                this.httpService.getDocumentPath(this.documentList[i])
                    .subscribe(
                    data => this.loadDocumentbyID(data),
                    error => this.logService.log(error + ": error while fetching user details"),
                    () => this.logService.log("user detials loaded Successfully!")
                    );
            }

        }

    }
    loadDocumentbyID(data) {
        this.downloadDocument(data.ImagingPath, data.Name, data.DisplayName);
    }

    downloadDocument(uri, filename, displayName) {
        if (this.utility.isBrowserIe() == false) //check for client browser
        {
            var download_link = document.createElement('a');
            var encodedUri = encodeURIComponent(uri);
            download_link.href = encodedUri;


            download_link.setAttribute("download", displayName);

            document.body.appendChild(download_link);
            download_link.click();
            document.body.removeChild(download_link);            
            this.child.showSuccessNotification("Document '" + displayName + "' downloaded successfully.", "Success!");
        }
        else {
            var encodedUri = encodeURIComponent(uri);

            var IEwindow = window.open();
            IEwindow.document.write('sep=,\r\n<div style="display: none;">' + encodedUri + '</div>');
            IEwindow.document.close();
            IEwindow.document.execCommand('SaveAs', true, displayName);
            IEwindow.close();
            this.child.showSuccessNotification("Document '" + displayName + "' downloaded successfully.", "Success!");
        }
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
        this.orderGridColumns = this.getOrderGridColumns();        
        var obj = JSON.parse(ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_Dashboard));
        for (var index in obj) {
            if (obj[index]["Parent"] == "DashboardGrid") {
                if (!obj[index]["IsVisible"])
                    this.findAndRemove(this.orderGridColumns, "name", obj[index]["CtrlName"]);
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
        return moment().format('MM/DD/YYYY HH:mm');
    }


    routetoLogin() {

        if (ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_id_token) == null ) {
            this.router.navigate(['Login']);     
        }
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
            this.model.ClientId = clientId;
            return this.model.ClientId;
        }        
        return null;
    }
    
    populateOrderStatus() {
        this.referenceDataService.getddlType('CPOrderStatus')
            .subscribe(
            data => this.loadOrderStatus(data),
            error => this.logService.log(error + ": error in Order Status DropDown call"),
            () => this.logService.log("Order Status loaded Successfully!")
        );
    }

    loadOrderStatus(data) {
        this.statusList = data;
        this.model.Status = "Please Select";
    }

    populateProducts() {
        this.referenceDataService.getddlType('TransactionType')
            .subscribe(
            data => this.loadProducts(data),
            error => this.logService.log(error + ": error in Transaction Type DropDown call"),
            () => this.logService.log("Transaction Type loaded Successfully!")
        );
    }

    loadProducts(data) {
        this.productList = data;
        this.allProductList = data;
        this.model.TransactionType = "Please Select";        
    }

    populateClients() {       
        this.httpService.getClientList(this.getClientID())
            .subscribe(
            data => this.loadClients(data),
            error => this.logService.log(error + ": error in Clients DropDown call"),
            () => this.logService.log("Clients loaded Successfully!")
            );
    }

    loadClients(data) {
        this.clientList = data;
        this.model.ClientFilterVal = 0;        
    }
    
    getOrderGridColumns(): Array<Column> {
        return [
            new Column('BorrowerName', 'Borrower'),
            new Column('OrderNo', 'Order Number'),            
            new Column('LoanNo', 'Loan Number'),
            new Column('ClientName', 'Client Name'),
            new Column('LoanOfficer', 'Loan Officer'),
            new Column('OrderStatus', 'Transaction Status'),
            new Column('OrderDate', 'Order Date'),            
            new Column('CloseDate', 'Closed Date'),
            new Column('ClosedBy', 'Closer Name'),
            new Column('ProductType', 'Transaction Type'),            
            new Column('SummaryOnly', ''),
            new Column('DetailOnly', '')
        ];
    }
    
    viewSelectedRow(model) {
        this.isViewClicked = true;

        this.httpService.getOrderSummary(model.OrderNo)
            .subscribe(
            data => this.loadOrderSummary(data),
            error => this.logService.log(error + ": error in Order Summary call"),
            () => this.logService.log("Order Summary loaded Successfully!")
        );
    }

    loadOrderSummary(data) {
        this.summaryList = data;
        this.loadSummaryValues(data);
    }
    
    summarySelectedRow(model) {
        this.viewSelectedRow(model);
    }

    detailSelectedRow(row) {

        ClientStorage.setSessionStorageItem(ClientStorageConstants.LS_RP_orderno, row.OrderNo);
        ClientStorage.setSessionStorageItem(ClientStorageConstants.LS_RP_status, row.OrderStatus);

        this.router.navigate(['OrderSummary']);
    }
    

    onSearch(isDefaultView) {        
        this.getClientID();
        this.model.IsDefaultView = isDefaultView;
        this.isSearchClicked = true;
        this.isViewClicked = false;

        if (this.model.OrderNo == null)
            this.model.OrderNo = 0;

        if (this.model.TransactionType == "Please Select")
            this.model.TransactionType = "";

        if (this.model.Status == "Please Select")
            this.model.Status = "";

        this.child.showLoader();
        this.httpService.getOrderDetail(this.model)
            .subscribe(
            data => this.searchHandler(data),
            error => {
                this.logService.log(error);
                this.child.hideLoader();
            },
            () => this.logService.log("API Call Finished Successfully!")
        );
    }

    searchHandler(data) {        
        if (this.model.OrderNo == 0)
            this.model.OrderNo = null;

        if (this.model.IsDefaultView == true) {
            data = data.filter(x => x.OrderStatus !== 'Completed');
            this.allOrderList = data;
            this.inProgressCount = this.allOrderList.filter(x => x.OrderStatus == 'In Progress').length;
            this.titleCompleteCount = this.allOrderList.filter(x=> x.OrderStatus == 'Title Completed').length;
            this.clearToCloseCount = this.allOrderList.filter(x=> x.OrderStatus == 'Clear to Close').length;
            this.postCompleteCount = this.allOrderList.filter(x=> x.OrderStatus == 'Post Close').length;            
        }
        this.modelOrderSearchDetail = data;
        this.orderList = data;
        this.child.hideLoader();        
    }

    loadSummaryValues(row) {        
        this.selectedBorrowerName = row[0].FullName;
        this.selectedPhone = this.utility.formatPhoneCell(row[0].HomePhone);
        this.selectedCell = this.utility.formatPhoneCell(row[0].CellPhone);
        this.selectedEmail = row[0].Email;
        this.selectedNote = row[0].Note;
        this.selectedProviderContact = row[0].ProviderContact;
        this.selectedLoanAmount = this.utility.formatAmount(row[0].LoanAmount, "$");
        if (row[0].Address !== null) {
            this.selectedAddress = row[0].Address + " ";

            if (row[0].City !== null && row[0].State !== null && row[0].Zip !== null)
                this.selectedAddress += row[0].City + " " + row[0].State + ", " + row[0].Zip;
        }
    }

    
    rateCalculator() {        
        this.httpService.getLoadStartUrl()
            .subscribe(
            data => this.rateCalculatorHandler(data),
            error => {
                this.logService.log(JSON.parse(error._body).StatusMessage);
      
            },
            () => this.logService.log("API Call Finished Successfully!")
            );                
        return false;
    }

    rateCalculatorHandler(data) {
        this.loadStarUrl = data;     
        setTimeout(function () { this.rateCalculator }, 5000);
    }

    FilterGridByStatus(status) {
        this.isViewClicked = false;
        this.orderList = this.allOrderList.filter(x=> x.OrderStatus == status);        
        this.model.Status = status;
        this.model.BorrowerName = "";
        this.model.LoanNo = "";
        this.model.OrderNo = null;
        this.model.LoanOfficer = "";
        this.model.TransactionType = "";
        this.model.ClientFilterVal = 0;
    }

    onExport() {         
        this.GenerateCsv();
    }
    
    checkDate(value) {
        var param = value;
        var isValidDate = moment(param, moment.ISO_8601, true).isValid();
        if (isValidDate) {
            return moment(param).format('MM/DD/YYYY');
        }
        else {
            return param;
        }
    }

    GenerateCsv() {        
        var temprow:any[];        
        for (var i = 0; i < this.orderList.length; i++) {            
            temprow = new Array<any>();
            temprow["OrderNumber"] = this.orderList[i]["OrderNo"];
            temprow["Borrower"] = this.orderList[i]["BorrowerName"];
            temprow["LoanNumber"] = this.orderList[i]["LoanNo"];
            temprow["ClientName"] = this.orderList[i]["ClientName"];
            temprow["LoanOfficer"] = this.orderList[i]["LoanOfficer"];
            temprow["TransactionStatus"] = this.orderList[i]["OrderStatus"];
            temprow["OrderDate"] = this.orderList[i]["OrderDate"];
            temprow["ClosedDate"] = this.orderList[i]["CloseDate"];
            temprow["CloserName"] = this.orderList[i]["ClosedBy"];
            temprow["TransactionType"] = this.orderList[i]["ProductType"];            
            this.rowsCopy.push(temprow);
        }
        for (var i = 0; i < this.rowsCopy.length; i++) {
            this.rowsCopy[i]["OrderDate"] = this.checkDate(this.rowsCopy[i]["OrderDate"]);
            this.rowsCopy[i]["ClosedDate"] = this.checkDate(this.rowsCopy[i]["ClosedDate"]);
        }
        if (this.rowsCopy.length > 0) {
            var csv;
            var col = [];
            for (var index2 in this.rowsCopy) {
                var row = [];
                var filteredRow = [];
                row = this.rowsCopy[index2];   
                //Adding Header
                if (index2 == '0') {                    
                    col = Object.keys(this.rowsCopy[index2]);
                    csv = col.join(',');
                    csv += "\n";
                }
                //Getting values from list
                row = Object.keys(row).map(function (k) { return row[k] });
                csv += '"' + row.join('","') + '"' + "\n";
            }
            var ts = new Date().getTime();
            if (this.utility.isBrowserIe() == false) {
                var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
                var download_link = document.createElement('a');
                download_link.href = uri;
                download_link.setAttribute("download", ts + ".csv");
                document.body.appendChild(download_link);
                download_link.click();
                document.body.removeChild(download_link);
            }
            else {
                var IEwindow = window.open('', '_blank', 'toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=10000, top=10000, width=10, height=10, visible=none'); 
                IEwindow.blur();
                IEwindow.document.write('sep=,\r\n' + csv);
                self.focus();
                IEwindow.document.close();
                IEwindow.document.execCommand('SaveAs', true, ts + ".csv");
                IEwindow.close();
            }
        }
    }
}