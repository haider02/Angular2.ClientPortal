import {Component, Inject, OnInit, AfterViewInit, provide} from '@angular/core';
import {NgForm}    from '@angular/forms';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from '@angular/router-deprecated';
import {LoggingService} from '../common/logging';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {MenuService} from '../menu/menu.service';
import {HeaderDetailService} from '../common/header-detail.service';
import {Utility} from '../common/utility';
import {ClientStorage} from '../common/ClientStorage';
import {AccountProfileService} from '../accountProfile/account-profile.service';
import {ClientStorageConstants} from '../common/constants';

declare var jQuery;

@Component({
    selector: 'header-detail',
    templateUrl: '../dev/tpl/header-detail.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [provide(APP_CONFIG, { useValue: CONFIG })
        , MenuService
        , HeaderDetailService
        , AccountProfileService
        , LoggingService
    ]
})

export class HeaderDetailComponent implements AfterViewInit {

    router: Router;
    routeParams: RouteParams;
    httpService: MenuService;
    appConfig: Config;
    menuList: Array<any>;
    headerService: HeaderDetailService;
    headerList: Array<any>;
    utility = new Utility();
    accountProfileService: AccountProfileService;    
    screenName: string = ClientStorageConstants.LS_OrderHeader;// "OrderHeader";
    orderNo: number;
    orderStatus: string;
    address: string;
    FullName: string;
    HomePhone: string;
    CellPhone: string;
    Email: string;
    Note: string;
    loanNo: number;
    loanAmount: string;
    ProviderContact: string;
    logService: LoggingService;

    constructor( @Inject(MenuService) _service
        , @Inject(APP_CONFIG) _appConfig: Config
        , @Inject(Router) _router
        , @Inject(HeaderDetailService) _headerservice
        , @Inject(RouteParams) _routeParams
        , @Inject(AccountProfileService) _accountProfileService
        , @Inject(LoggingService) _logservice
    ) {
        this.appConfig = _appConfig;
        this.httpService = _service;
        this.router = _router;
        this.routeParams = _routeParams;
        this.headerService = _headerservice;
        this.accountProfileService = _accountProfileService;
        this.logService = _logservice;
    }

    ngAfterViewInit() {
        let orderNo = +ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_orderno);
        this.orderNo = orderNo;
        var status = ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_status);
        this.orderStatus = status;
        this.getOrderHeader();    

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
    }
  

    routeNavigator(menuLink) {
        this.router.navigate([menuLink.RouterLink]);
    }

    getOrderHeader() {
        this.headerService.getOrderHeader(this.orderNo)
            .subscribe(
            data => this.loadOrderHeader(data),
            error => this.logService.log(error + ": error in Order Header call"),
            () => this.logService.log("Order Header loaded Successfully!")
            );
    }

    loadOrderHeader(data) {
        this.headerList = data;
        this.logService.log(data);
        if (data !== null && data.length > 0) {
            this.FullName = data[0].Name;
            this.address = data[0].Address;
            this.HomePhone = this.utility.formatPhoneCell(data[0].HomePhone);
            this.CellPhone = this.utility.formatPhoneCell(data[0].CellPhone);
            this.Email = data[0].Email;
            this.Note = data[0].Note;
            this.loanNo = data[0].LoanNo;
            this.loanAmount = this.utility.formatAmount(data[0].LoanAmount, "$");
            this.ProviderContact = data[0].ProviderContact;
        }
    }

    hideShowNotes() {
        jQuery('.urgent-notes-content').stop().slideToggle();
    }

    onClose() {
        jQuery('.header-detail-inner').slideToggle();
        jQuery('#headerDetailToggle').find('span').toggleClass('fa-caret-square-o-up').toggleClass('fa-caret-square-o-down');
    }
}
