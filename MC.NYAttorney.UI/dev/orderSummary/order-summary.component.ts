import {Component, OnInit, Inject, provide, ViewChild, AfterViewInit} from '@angular/core';
import {Http} from '@angular/http';
import {NgForm} from '@angular/forms';
import {Router, RouteParams, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {ClientStorageConstants} from '../common/constants';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {ReferenceDataService} from '../referenceData/reference-data.service';
import {NotificationsComponent} from '../notifications/notifications.component';
import {LoggingService} from '../common/logging';
import {GridComponent} from '../grid/grid.component';
import {Column} from '../grid/column';
import {StateComponent} from '../DropDowns/state/state.component';
import {CityComponent} from '../DropDowns/city/city.component';
import {CountyComponent} from '../DropDowns/county/county.component';
import {CityService} from '../DropDowns/city/city.service';
import {AccountProfileService} from '../accountProfile/account-profile.service';
import {Utility} from '../common/utility';
import {OrderSummaryService} from './order-summary.service';
import {OrderSummary} from './order-summary.model';
import {LeftNavigationComponent} from '../common/left-navigation.component';
import {HeaderDetailComponent} from '../common/header-detail.component';
import {enmTabs} from "../common/enumerations";
import {MilestoneTrackerComponent} from '../common/milestone-tracker.component';
import {ItemCheckListComponent} from '../common/item-checklist.component';
import {ClientStorage} from '../common/ClientStorage';

declare var jQuery;
declare var moment: any;

@Component({
    selector: 'order-summary',
    templateUrl: '../dev/tpl/order-summary.html',
    inputs: ['state'],
    directives: [ROUTER_DIRECTIVES, NotificationsComponent, GridComponent, StateComponent, CityComponent, CountyComponent
        , LeftNavigationComponent
        , HeaderDetailComponent
        , MilestoneTrackerComponent
        , ItemCheckListComponent
    ],
    providers: [provide(APP_CONFIG, { useValue: CONFIG }), ReferenceDataService
        , CityService
        , OrderSummaryService
        , AccountProfileService
        , LoggingService
    ]
})

export class OrderSummaryComponent implements OnInit, AfterViewInit {
    router: Router;
    routeParams: RouteParams;
    appConfig: Config;
    referenceDataService: ReferenceDataService;
    @ViewChild(NotificationsComponent) child: NotificationsComponent;
    successMessageDisplay: boolean;
    active = true;
    utility = new Utility();
    httpService: OrderSummaryService;
    model = new OrderSummary();
    clientTab: enmTabs;    
    orderNo: number;
    isAttorneyEnable = false;
    accountProfileService: AccountProfileService;
    screenName: string = ClientStorageConstants.LS_OrderSummary;
    logService: LoggingService;


    @ViewChild(MilestoneTrackerComponent) trackerChild: MilestoneTrackerComponent;
    @ViewChild(ItemCheckListComponent) checklistChild: ItemCheckListComponent;

    constructor( @Inject(APP_CONFIG) _appConfig: Config, @Inject(ReferenceDataService) _referenceData, @Inject(Router) _router
        , @Inject(RouteParams) _routeParams
        , @Inject(OrderSummaryService) _service
        , @Inject(AccountProfileService) _accountProfileService
        , @Inject(LoggingService) _logservice
    ) {
        this.appConfig = _appConfig;
        this.referenceDataService = _referenceData;
        this.router = _router;
        this.routeParams = _routeParams;
        this.httpService = _service;
        this.clientTab = enmTabs.OrderSummary;
        this.accountProfileService = _accountProfileService;
        this.logService = _logservice;
    }

    ngOnInit() {
        
    }

    ngOnChanges() {

    }

    ngAfterViewInit() {
        this.child.showLoader();

        if (this.utility.getClientId() !== null) {
            this.orderNo = +ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_orderno);
            this.model.OrderNo = this.orderNo;
            this.getProductCodeByOrder();

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
    }
    
    
    getProductCodeByOrder() {

        this.httpService.getProductCodeByOrder(this.model.OrderNo)
            .subscribe(
            data => this.loadProductCode(data),
            error => this.logService.log(error + ": error in Product Code call"),
            () => this.logService.log("Product Code loaded Successfully!")
            );
    }

    loadProductCode(data) {
        this.model.ProductCode = data;
        this.trackerChild.getMileStoneTracker(data);
        this.checklistChild.getCheckList(data);
        this.child.hideLoader();
    }
    
}