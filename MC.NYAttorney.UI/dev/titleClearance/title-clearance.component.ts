import {Component, OnInit, Inject, provide, ViewChild, AfterViewInit} from '@angular/core';
import {Http} from '@angular/http';
import {NgForm} from '@angular/forms';
import {Router, RouteParams, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {ReferenceDataService} from '../referenceData/reference-data.service';
import {NotificationsComponent} from '../notifications/notifications.component';
import {ClientStorageConstants} from '../common/constants';
import {GridComponent} from '../grid/grid.component';
import {Column} from '../grid/column';
import {StateComponent} from '../DropDowns/state/state.component';
import {CityComponent} from '../DropDowns/city/city.component';
import {CountyComponent} from '../DropDowns/county/county.component';
import {CityService} from '../DropDowns/city/city.service';
import {ClientStorage} from '../common/ClientStorage';
import {Utility} from '../common/utility';
import {TitleClearanceService} from './title-clearance.service';
import {TitleClearance} from './title-clearance.model';
import {LeftNavigationComponent} from '../common/left-navigation.component';
import {HeaderDetailComponent} from '../common/header-detail.component';
import {enmTabs} from "../common/enumerations";
import {DashBoardService} from '../dashBoard/dashboard.service';
import {AccountProfileService} from '../accountProfile/account-profile.service';
import {LoggingService} from '../common/logging';
declare var jQuery;
declare var moment: any;

@Component({
    selector: 'title-clearance',
    templateUrl: '../dev/tpl/title-clearance.html',
    inputs: ['state'],
    directives: [ROUTER_DIRECTIVES, NotificationsComponent, GridComponent, StateComponent, CityComponent, CountyComponent
        , LeftNavigationComponent
        , HeaderDetailComponent
    ],
    providers: [provide(APP_CONFIG, { useValue: CONFIG }), ReferenceDataService
        , CityService
        , TitleClearanceService
        , DashBoardService
        , AccountProfileService
        , LoggingService
    ]
})

export class TitleClearanceComponent implements OnInit, AfterViewInit {
    router: Router;
    routeParams: RouteParams;
    appConfig: Config;
    referenceDataService: ReferenceDataService;
    @ViewChild(NotificationsComponent) child: NotificationsComponent;
    successMessageDisplay: boolean;
    active = true;
    utility = new Utility();
    httpService: TitleClearanceService;
    model = new TitleClearance();
    clientTab: enmTabs;
    dashboardService: DashBoardService;
    accountProfileService: AccountProfileService;
    orderNo: number;
    mortgageConnectGridColumns: Array<Column>;
    newYorkGridColumns: Array<Column>;
    logService: LoggingService;
    viewDetail = false;
    saveDetail = true;
    screenName: string = ClientStorageConstants.LS_TitleClearance;

    constructor( @Inject(APP_CONFIG) _appConfig: Config, @Inject(ReferenceDataService) _referenceData, @Inject(Router) _router
        , @Inject(RouteParams) _routeParams
        , @Inject(TitleClearanceService) _service
        , @Inject(DashBoardService) _dashboardService
        , @Inject(AccountProfileService) _accountProfileService
        , @Inject(LoggingService) _logservice
    ) {
        this.appConfig = _appConfig;
        this.referenceDataService = _referenceData;
        this.router = _router;
        this.routeParams = _routeParams;
        this.httpService = _service;
        this.clientTab = enmTabs.TitleClearance;
        this.dashboardService = _dashboardService;
        this.accountProfileService = _accountProfileService;
        this.logService = _logservice;
    }
        
    ngOnInit() {        
        this.mortgageConnectGridColumns = this.getMortgageConnectGridColumns();
        this.newYorkGridColumns = this.getNewYorkGridColumns();
    }
    
    ngAfterViewInit() {
        this.child.showLoader();
        if (this.utility.getClientId() !== null) {
            this.orderNo = +ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_orderno);
            this.model.OrderNo = this.orderNo;
            this.getClearanceItems();
            this.getCleartoCloseItems();
            this.getCEMACollateral();
            this.getCOOPCollateral();            

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
        this.mortgageConnectGridColumns = this.getMortgageConnectGridColumns();
        this.newYorkGridColumns = this.getNewYorkGridColumns();

        for (var index in obj) {
            if (obj[index]["Parent"] == "MortgageConnectGrid") {
                if (!obj[index]["IsVisible"])
                    this.findAndRemove(this.mortgageConnectGridColumns, "name", obj[index]["CtrlName"]);
            }
            if (obj[index]["Parent"] == "NewYorkGrid") {
                if (!obj[index]["IsVisible"])
                    this.findAndRemove(this.newYorkGridColumns, "name", obj[index]["CtrlName"]);
            }
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
        
    getClearanceItems() {
        this.httpService.getClearanceItems(this.model.OrderNo)
            .subscribe(
            data => this.loadClearanceItems(data),
            error => this.logService.log(error + ": error in Clearance Items call"),
            () => this.logService.log("Clearance Items loaded Successfully!")
            );
    }

    loadClearanceItems(data) {
        this.model.ClearanceItemsList = data;
        this.model.MortgageConnectList = this.model.ClearanceItemsList.filter(x => x.ExcludeAttorney == 1);
        this.model.NewYorkList = this.model.ClearanceItemsList.filter(x => x.ExcludeAttorney == 0);
        this.child.hideLoader();
    }
    
    getMortgageConnectGridColumns(): Array<Column> {
        return [
            new Column('ClearingTypeName', 'Clearing Type'),
            new Column('Name1', 'Name'),
            new Column('FollowUpDate', 'Follow Up'),
            new Column('DueDate', 'Due Date'),
            new Column('Status', 'Status')
        ];
    }

    getNewYorkGridColumns(): Array<Column> {
        return [
            new Column('ClearingTypeName', 'Clearing Type'),
            new Column('Name1', 'Name'),
            new Column('TCMethod', 'Follow Up/TC Method'),
            new Column('EditOnly', '')
        ];
    }

    onSave() {
        this.child.showLoader();
        this.successMessageDisplay = true;
    }

    saveHandler(data) {
        this.child.hideLoader();
        if (data < 0)
            this.child.showErrorNotification('Title Clearance save failed', 'Error!');
        else {
            this.child.showSuccessNotification('Title Clearance saved successfully', 'Success!');        
        }
    }

    editNewYorkRow(row) {
        this.model.ItemName = row.Name1;
        this.model.isSelectedCheckbox = row.Cleared;
        this.model.ItemAttorneyCleared = row.Cleared;
        this.model.ClearedBy = row.ClearedBy;
        this.model.ClearedDate = this.utility.getDateTime(row.ClearedDate);
        this.model.TCD_RowId = row.TCD_RowId;
        this.viewDetail = true;
    }

    ItemAttorneyClearedChecked(isChecked) {
        this.model.ItemAttorneyCleared = isChecked;

        if (isChecked == true) {
            this.model.ClearedBy = this.utility.getContactFullName();
            this.model.ClearedDate = this.utility.getCurrentDateTime();
        }
        else {
            this.model.ClearedBy = "";
            this.model.ClearedDate = "";
        }
    }

    onSaveClearanceItem() {
        if (this.model.ItemAttorneyCleared == true) {
            this.child.showLoader();

            this.httpService.saveNewYorkAttorneyItem(this.model)
                .subscribe(
                data => this.saveClearanceItemHandler(data),
                error => {
                    this.child.showSaveErrorNotification();
                    this.child.hideLoader();
                },
                () => this.logService.log("API Call Finished Successfully!")
                );

            this.successMessageDisplay = true;
        }
    }

    saveClearanceItemHandler(data) {
        this.child.hideLoader();
        if (data < 0)
            this.child.showErrorNotification('Item Clearance save failed', 'Error!');
        else {
            this.child.showSuccessNotification('Item Clearance saved successfully', 'Success!');            
        }
        this.viewDetail = false;

        this.getClearanceItems();
    }

    getCleartoCloseItems() {

        this.httpService.getTCCleartoCloseDetail(this.model.OrderNo)
            .subscribe(
            data => this.loadCleartoCloseItems(data),
            error => this.logService.log(error + ": error in Clear to Close call"),
            () => this.logService.log("Clear to Close loaded Successfully!")
            );
    }

    loadCleartoCloseItems(data) {
        if (data.length > 0) {
            this.model.isRequestedCheckbox = data[0].ReqApproval;
            this.model.FileClearanceRequested = data[0].ReqApproval;
            this.model.FileClearanceRequestedBy = data[0].ReqApprovalBy;
            this.model.FileClearanceRequestedDate = this.utility.getDateTime(data[0].ReqApprovalDate);
            
            this.model.FileClearanceApproved = data[0].Cleared;
            this.model.FileClearanceApprovedBy = data[0].ClearedBy;
            this.model.FileClearanceApprovedDate = this.utility.getDateTime(data[0].ClearedDate);
        }
        this.child.hideLoader();
    }

    FileClearanceRequestedChecked(isChecked) {
        this.model.FileClearanceRequested = isChecked;

        if (isChecked == true) {
            this.model.FileClearanceRequestedBy = this.utility.getContactFullName();
            this.model.FileClearanceRequestedDate = this.utility.getCurrentDateTime();
        }
        else {
            this.model.FileClearanceRequestedBy = "";
            this.model.FileClearanceRequestedDate = "";
        }
    }

    onSaveCleartoClose() {
        this.child.showLoader();
        this.saveDetail = false;
        this.fillEmailMessage();
        this.httpService.saveFileClearanceRequested(this.model)
            .subscribe(
            data => this.saveCleartoCloseHandler(data),
            error => {
                this.child.showSaveErrorNotification();
                this.child.hideLoader();
            },
            () => this.logService.log("API Call Finished Successfully!")
            );

        this.successMessageDisplay = true;
    }

    saveCleartoCloseHandler(data) {
        this.child.hideLoader();
        if (data < 0)
            this.child.showErrorNotification('File Clearance Requested save failed', 'Error!');
        else {
            this.child.showSuccessNotification('File Clearance Requested saved successfully', 'Success!');
            this.model.isRequestedCheckbox = true;            
        }
    }

    getCEMACollateral() {

        this.httpService.getTCRequestQuestionsAnswered(this.model.OrderNo, "CEMA")
            .subscribe(
            data => this.loadCEMACollateral(data),
            error => this.logService.log(error + ": error in CEMA Collateral call"),
            () => this.logService.log("CEMA Collateral loaded Successfully!")
            );
    }

    loadCEMACollateral(data) {
        this.model.CEMACollateralList = data;
    }

    getCOOPCollateral() {

        this.httpService.getTCRequestQuestionsAnswered(this.model.OrderNo, "COOP")
            .subscribe(
            data => this.loadCOOPCollateral(data),
            error => this.logService.log(error + ": error in COOP Collateral call"),
            () => this.logService.log("COOP Collateral loaded Successfully!")
            );
    }

    loadCOOPCollateral(data) {
        this.model.COOPCollateralList = data;
    }
    
    fillEmailMessage() {

        var body = this.utility.getContactFullName() + " has requested the file to be approved as cleared." +
                    " Please contact Mortgage Connect if you have any questions or you believe you've received this email in error.\n\nThank you, " +
                    "\nMortgage Connect " +
                    "\nwww.MortgageConnectLP.com" +
                    "\n\n* Please do not reply to this email.This email address is not monitored.";
        
        this.model.From = this.appConfig.DefaultFromEmailAddress;    
        this.model.Body = body;
    }
}