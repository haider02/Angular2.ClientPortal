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
var dashboard_model_1 = require('./dashboard.model');
var dashboard_service_1 = require('./dashboard.service');
var utility_1 = require('../common/utility');
var account_profile_service_1 = require('../accountProfile/account-profile.service');
var customLocalStorage_1 = require('../common/customLocalStorage');
var core_2 = require('ng2-idle/core');
var core_3 = require('ng2-idle-keepalive/core');
var logging_1 = require('../common/logging');
var DashBoardComponent = (function () {
    function DashBoardComponent(_appConfig, _referenceData, _router, _service, _accountProfileService, idle, keepalive, _logservice) {
        var _this = this;
        this.active = true;
        this.model = new dashboard_model_1.OrderSearchRequest();
        this.modelOrderSearchDetail = new dashboard_model_1.OrderSearchDetail();
        this.utility = new utility_1.Utility();
        this.orderList = new Array();
        this.allOrderList = new Array();
        this.productList = new Array();
        this.allProductList = new Array();
        this.statusList = new Array();
        this.branchList = new Array();
        this.clientList = new Array();
        this.summaryList = new Array();
        this.rowsCopy = new Array();
        this.isSearchClicked = false;
        this.isViewClicked = false;
        this.selectedBorrowerName = "";
        this.selectedAddress = "";
        this.selectedPhone = "";
        this.selectedCell = "";
        this.selectedEmail = "";
        this.selectedNote = "";
        this.selectedProviderContact = "";
        this.selectedLoanAmount = "";
        this.inProgressCount = 0;
        this.titleCompleteCount = 0;
        this.clearToCloseCount = 0;
        this.postCompleteCount = 0;
        this.screenName = "Dashboard";
        this.headerScreenName = "HeaderMenu";
        this.DownloadDocFormVisible = false;
        this.appConfig = _appConfig;
        this.referenceDataService = _referenceData;
        this.router = _router;
        this.accountProfileService = _accountProfileService;
        this.httpService = _service;
        this.logService = _logservice;
        this._idle = idle;
        this._keepalive = keepalive;
        this._keepalive.onPing.subscribe(function () {
            _this.logService.log('Keepalive.ping() called!');
            _this.httpService.refreshToken()
                .subscribe(function (data) {
                customLocalStorage_1.CustomLocalStorage.setItem("id_token", data.access_token);
                customLocalStorage_1.CustomLocalStorage.setItem("refresh_token", data.refresh_token);
            }, function (error) { return _this.logService.log(error); }, function () { return _this.logService.log("Refresk Token Successfully!"); });
        });
        this._keepalive.interval(((+customLocalStorage_1.CustomLocalStorage.getItem("session_TimeOut")) * 30));
        this._idle.setIdle(((+customLocalStorage_1.CustomLocalStorage.getItem("session_TimeOut")) * 60));
        // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
        this._idle.setTimeout(5);
        // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
        this._idle.setInterrupts(core_2.DEFAULT_INTERRUPTSOURCES);
        // Subscribe to idle events. Add your logic on how the application should respond, such as displaying
        // a warning dialog onIdleStart, or redirecting to logout page onTImeout, etc.
        this._idle.onIdleStart.subscribe(function () {
            _this.logService.log('IdleStart');
        });
        this._idle.onIdleEnd.subscribe(function () {
            _this.logService.log('IdleEnd');
        });
        this._idle.onTimeoutWarning.subscribe(function (countdown) {
            _this.logService.log('TimeoutWarning: ' + countdown);
        });
        this._idle.onTimeout.subscribe(function () {
            customLocalStorage_1.CustomLocalStorage.clear();
            _this._idle.stop();
            _this.router.navigate(['Login']);
        });
    }
    DashBoardComponent.prototype.ngOnInit = function () {
        this.routetoLogin();
        this.rateCalculator();
    };
    DashBoardComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this._idle.watch();
        if (this.utility.getClientId() !== null) {
            this.populateOrderStatus();
            this.populateProducts();
            this.populateClients();
            this.onSearch(true);
            if (JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName)) == null)
                this.accountProfileService.getPermissionsAgainstRole(this.screenName)
                    .subscribe(function (data) {
                    customLocalStorage_1.CustomLocalStorage.setItem(_this.screenName, JSON.stringify(data));
                    _this.loadRolesAndPermissions(data);
                }, function (error) { return _this.logService.log(error); });
            else
                this.loadRolesAndPermissions(JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.screenName)));
            if (JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.headerScreenName)) == null)
                this.accountProfileService.getPermissionsAgainstRole(this.headerScreenName)
                    .subscribe(function (data) {
                    customLocalStorage_1.CustomLocalStorage.setItem(_this.headerScreenName, JSON.stringify(data));
                    _this.loadRolesAndPermissions(data);
                }, function (error) { return _this.logService.log(error); });
            else
                this.loadRolesAndPermissions(JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem(this.headerScreenName)));
        }
        jQuery('.dashboard-wrapper.main').removeClass('login');
        this.getDownloadDocumentList();
    };
    DashBoardComponent.prototype.getDownloadDocumentList = function () {
        var _this = this;
        this.httpService.getDownloadDocuments()
            .subscribe(function (data) { return _this.loadDocumentData(data); }, function (error) { return _this.logService.log(error + ": error while fetching user details"); }, function () { return _this.logService.log("user detials loaded Successfully!"); });
    };
    DashBoardComponent.prototype.loadDocumentData = function (data) {
        this.documentList = data;
        this.documentID = "Please Select";
    };
    DashBoardComponent.prototype.onDownloadDocumentSubmit = function () {
        this.getDocumentsByID(this.documentID);
    };
    DashBoardComponent.prototype.cancelDownloadDocument = function () {
    };
    DashBoardComponent.prototype.getDocumentsByID = function (documentID) {
        var _this = this;
        for (var i = 0; i < this.documentList.length; i++) {
            if (this.documentList[i].ID.toString() == documentID) {
                this.httpService.getDocumentPath(this.documentList[i])
                    .subscribe(function (data) { return _this.loadDocumentbyID(data); }, function (error) { return _this.logService.log(error + ": error while fetching user details"); }, function () { return _this.logService.log("user detials loaded Successfully!"); });
            }
        }
    };
    DashBoardComponent.prototype.loadDocumentbyID = function (data) {
        this.downloadDocument(data.ImagingPath, data.Name, data.DisplayName);
    };
    DashBoardComponent.prototype.downloadDocument = function (uri, filename, displayName) {
        if (this.utility.isBrowserIe() == false) {
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
    };
    DashBoardComponent.prototype.loadRolesAndPermissions = function (data) {
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
        this.orderGridColumns = this.getOrderGridColumns();
        var obj = JSON.parse(customLocalStorage_1.CustomLocalStorage.getItem("Dashboard"));
        for (var index in obj) {
            if (obj[index]["Parent"] == "DashboardGrid") {
                if (!obj[index]["IsVisible"])
                    this.findAndRemove(this.orderGridColumns, "name", obj[index]["CtrlName"]);
            }
        }
    };
    DashBoardComponent.prototype.findItem = function (array, property, value) {
        for (var index = 0; index < array.length; index++) {
            if (array[index][property] === value) {
                return index;
            }
        }
        return -1;
    };
    DashBoardComponent.prototype.findAndRemove = function (array, property, value) {
        array.forEach(function (result, index) {
            if (result[property] === value) {
                array.splice(index, 1);
            }
        });
    };
    DashBoardComponent.prototype.getCurrentDateTime = function () {
        return moment().format('MM/DD/YYYY HH:mm');
    };
    DashBoardComponent.prototype.routetoLogin = function () {
        if (customLocalStorage_1.CustomLocalStorage.getItem("user_ContactId") == null || customLocalStorage_1.CustomLocalStorage.getItem("id_token") == null || customLocalStorage_1.CustomLocalStorage.getItem("refresh_token") == null) {
            this.router.navigate(['Login']);
        }
    };
    DashBoardComponent.prototype.getCurrentUserID = function () {
        var contactId = this.utility.getContactId();
        if (contactId !== null)
            return contactId;
        return null;
    };
    DashBoardComponent.prototype.getClientID = function () {
        var clientId = this.utility.getClientId();
        if (clientId !== null) {
            this.model.ClientId = clientId;
            return this.model.ClientId;
        }
        return null;
    };
    DashBoardComponent.prototype.populateOrderStatus = function () {
        var _this = this;
        this.referenceDataService.getddlType('CPOrderStatus')
            .subscribe(function (data) { return _this.loadOrderStatus(data); }, function (error) { return _this.logService.log(error + ": error in Order Status DropDown call"); }, function () { return _this.logService.log("Order Status loaded Successfully!"); });
    };
    DashBoardComponent.prototype.loadOrderStatus = function (data) {
        this.statusList = data;
        this.model.Status = "Please Select";
    };
    DashBoardComponent.prototype.populateProducts = function () {
        var _this = this;
        this.referenceDataService.getddlType('TransactionType')
            .subscribe(function (data) { return _this.loadProducts(data); }, function (error) { return _this.logService.log(error + ": error in Transaction Type DropDown call"); }, function () { return _this.logService.log("Transaction Type loaded Successfully!"); });
    };
    DashBoardComponent.prototype.loadProducts = function (data) {
        this.productList = data;
        this.allProductList = data;
        this.model.TransactionType = "Please Select";
    };
    DashBoardComponent.prototype.populateClients = function () {
        var _this = this;
        this.httpService.getClientList(this.getClientID())
            .subscribe(function (data) { return _this.loadClients(data); }, function (error) { return _this.logService.log(error + ": error in Clients DropDown call"); }, function () { return _this.logService.log("Clients loaded Successfully!"); });
    };
    DashBoardComponent.prototype.loadClients = function (data) {
        this.clientList = data;
        this.model.ClientFilterVal = 0;
    };
    DashBoardComponent.prototype.getOrderGridColumns = function () {
        return [
            new column_1.Column('BorrowerName', 'Borrower'),
            new column_1.Column('OrderNo', 'Order Number'),
            new column_1.Column('LoanNo', 'Loan Number'),
            new column_1.Column('ClientName', 'Client Name'),
            new column_1.Column('LoanOfficer', 'Loan Officer'),
            new column_1.Column('OrderStatus', 'Transaction Status'),
            new column_1.Column('OrderDate', 'Order Date'),
            new column_1.Column('CloseDate', 'Closed Date'),
            new column_1.Column('ClosedBy', 'Closer Name'),
            new column_1.Column('ProductType', 'Transaction Type'),
            new column_1.Column('SummaryOnly', ''),
            new column_1.Column('DetailOnly', '')
        ];
    };
    DashBoardComponent.prototype.viewSelectedRow = function (model) {
        var _this = this;
        this.isViewClicked = true;
        this.httpService.getOrderSummary(model.OrderNo)
            .subscribe(function (data) { return _this.loadOrderSummary(data); }, function (error) { return _this.logService.log(error + ": error in Order Summary call"); }, function () { return _this.logService.log("Order Summary loaded Successfully!"); });
    };
    DashBoardComponent.prototype.loadOrderSummary = function (data) {
        this.summaryList = data;
        this.loadSummaryValues(data);
    };
    DashBoardComponent.prototype.summarySelectedRow = function (model) {
        this.viewSelectedRow(model);
    };
    DashBoardComponent.prototype.detailSelectedRow = function (row) {
        this.router.navigate(['OrderSummary', { orderno: row.OrderNo, status: row.OrderStatus }]);
    };
    DashBoardComponent.prototype.rowClicked = function (row) {
        this.router.navigate(['OrderContract', { id: parseInt(row.ViewName) }]);
    };
    DashBoardComponent.prototype.onSearch = function (isDefaultView) {
        var _this = this;
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
            .subscribe(function (data) { return _this.searchHandler(data); }, function (error) {
            _this.logService.log(error);
            _this.child.hideLoader();
        }, function () { return _this.logService.log("API Call Finished Successfully!"); });
    };
    DashBoardComponent.prototype.searchHandler = function (data) {
        if (this.model.OrderNo == 0)
            this.model.OrderNo = null;
        if (this.model.IsDefaultView == true) {
            data = data.filter(function (x) { return x.OrderStatus !== 'Completed'; });
            this.allOrderList = data;
            this.inProgressCount = this.allOrderList.filter(function (x) { return x.OrderStatus == 'In Progress'; }).length;
            this.titleCompleteCount = this.allOrderList.filter(function (x) { return x.OrderStatus == 'Title Completed'; }).length;
            this.clearToCloseCount = this.allOrderList.filter(function (x) { return x.OrderStatus == 'Clear to Close'; }).length;
            this.postCompleteCount = this.allOrderList.filter(function (x) { return x.OrderStatus == 'Post Close'; }).length;
        }
        this.modelOrderSearchDetail = data;
        this.orderList = data;
        this.child.hideLoader();
    };
    DashBoardComponent.prototype.loadSummaryValues = function (row) {
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
    };
    DashBoardComponent.prototype.rateCalculator = function () {
        var _this = this;
        this.httpService.getLoadStartUrl()
            .subscribe(function (data) { return _this.rateCalculatorHandler(data); }, function (error) {
            _this.logService.log(JSON.parse(error._body).StatusMessage);
        }, function () { return _this.logService.log("API Call Finished Successfully!"); });
        return false;
    };
    DashBoardComponent.prototype.rateCalculatorHandler = function (data) {
        this.loadStarUrl = data;
        setTimeout(function () { this.rateCalculator; }, 5000);
    };
    DashBoardComponent.prototype.FilterGridByStatus = function (status) {
        this.isViewClicked = false;
        this.orderList = this.allOrderList.filter(function (x) { return x.OrderStatus == status; });
        this.model.Status = status;
        this.model.BorrowerName = "";
        this.model.LoanNo = "";
        this.model.OrderNo = null;
        this.model.LoanOfficer = "";
        this.model.TransactionType = "";
        this.model.ClientFilterVal = 0;
    };
    DashBoardComponent.prototype.onExport = function () {
        this.GenerateCsv();
    };
    DashBoardComponent.prototype.checkDate = function (value) {
        var param = value;
        var isValidDate = moment(param, moment.ISO_8601, true).isValid();
        if (isValidDate) {
            return moment(param).format('MM/DD/YYYY');
        }
        else {
            return param;
        }
    };
    DashBoardComponent.prototype.GenerateCsv = function () {
        var temprow;
        for (var i = 0; i < this.orderList.length; i++) {
            temprow = new Array();
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
                row = Object.keys(row).map(function (k) { return row[k]; });
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
    };
    DashBoardComponent.prototype.NavigateToOrderEntry = function () {
        this.router.navigate(['OrderEntry']);
    };
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], DashBoardComponent.prototype, "child", void 0);
    __decorate([
        core_1.ViewChild(grid_component_1.GridComponent)
    ], DashBoardComponent.prototype, "gridChild", void 0);
    DashBoardComponent = __decorate([
        core_1.Component({
            selector: 'dashboard',
            templateUrl: '../dev/tpl/dashboard.html',
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, notifications_component_1.NotificationsComponent, grid_component_1.GridComponent],
            providers: [core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }), reference_data_service_1.ReferenceDataService, dashboard_service_1.DashBoardService, account_profile_service_1.AccountProfileService, logging_1.LoggingService]
        }),
        __param(0, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(1, core_1.Inject(reference_data_service_1.ReferenceDataService)),
        __param(2, core_1.Inject(router_deprecated_1.Router)),
        __param(3, core_1.Inject(dashboard_service_1.DashBoardService)),
        __param(4, core_1.Inject(account_profile_service_1.AccountProfileService)),
        __param(5, core_1.Inject(core_2.Idle)),
        __param(6, core_1.Inject(core_3.Keepalive)),
        __param(7, core_1.Inject(logging_1.LoggingService))
    ], DashBoardComponent);
    return DashBoardComponent;
}());
exports.DashBoardComponent = DashBoardComponent;
//# sourceMappingURL=dashboard.component.js.map