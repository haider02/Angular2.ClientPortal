import {Component, Inject, OnInit, Input, provide, AfterViewInit} from '@angular/core';
import {NgForm}    from '@angular/forms';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from '@angular/router-deprecated';
import {ClientStorageConstants} from '../common/constants';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {MenuService} from '../menu/menu.service';
import {enmTabs} from "../common/enumerations";
import {Utility} from '../common/utility';
import {ClientStorage} from '../common/ClientStorage';
import {AccountProfileService} from '../accountProfile/account-profile.service';
import {LoggingService} from '../common/logging';

declare var jQuery;
declare var pagNav;

@Component({
    selector: 'left-navigation',
    templateUrl: '../dev/tpl/left-navigation.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [provide(APP_CONFIG, { useValue: CONFIG })
        , MenuService   
        , AccountProfileService 
        , LoggingService   
    ]
})

export class LeftNavigationComponent implements AfterViewInit {

    router: Router;
    routeParams: RouteParams;
    httpService: MenuService;
    appConfig: Config;
    menuList: Array<any>;
    utility = new Utility();
    accountProfileService: AccountProfileService;    
    screenName: string = ClientStorageConstants.LS_LeftNavigation;// "LeftNavigation";
    @Input() selectedTab: enmTabs;

    orderNo: number;
    orderstatus: string;
    logService: LoggingService;

    constructor( @Inject(MenuService) _service
        , @Inject(APP_CONFIG) _appConfig: Config
        , @Inject(Router) _router
        , @Inject(RouteParams) _routeParams
        , @Inject(AccountProfileService) _accountProfileService
        , @Inject(LoggingService) _logservice
    ) {
        this.appConfig = _appConfig;
        this.httpService = _service;
        this.router = _router;
        this.routeParams = _routeParams;
        this.accountProfileService = _accountProfileService;
        this.logService = _logservice;
    }

    ngAfterViewInit() {
        let orderNo = +ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_orderno);
        this.orderNo = orderNo;
        this.orderstatus = ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_status);       
        pagNav();

        if (JSON.parse(ClientStorage.getSessionStorageItem(this.screenName)) == null)
            this.accountProfileService.getPermissionsAgainstRole(this.screenName)
                .subscribe(
                data => {
                    ClientStorage.setSessionStorageItem(this.screenName, JSON.stringify(data));
                    this.rolesAndPermissionHandler();
                },
                error => this.logService.log(error));
        else
            this.rolesAndPermissionHandler();
        
    }
      
    rolesAndPermissionHandler() {
        this.httpService.getAllMenus()
            .subscribe(
            data => this.setMenuResponse(data),
            error => this.logService.log(error + ": error"),
            () => this.logService.log('Service Call Completed')
            );
    }
    
    setMenuResponse(data) {        
        this.menuList = data;        
        this.menuList = this.menuList.filter(x => { return x.RefDataId == this.appConfig.MenuId });
        var data = JSON.parse(ClientStorage.getSessionStorageItem(this.screenName));

        if (data.length > 0) {
            for (var index in data) {
                if (!data[index]["IsVisible"]) {
                    var index1 = this.menuList.findIndex(x => { return x.RouterLink == data[index]["CtrlName"] });
                    if (index1 > -1) {
                        this.menuList.splice(index1, 1);
                    }
                } 
            }
        }        
    }
    routeNavigator(menuLink) {
        ClientStorage.setSessionStorageItem(ClientStorageConstants.LS_RP_orderno, this.orderNo.toString());
        ClientStorage.setSessionStorageItem(ClientStorageConstants.LS_RP_status, this.orderstatus);
        this.router.navigate([menuLink.RouterLink]);  
    }

    hideShowLeftMenu() {
        jQuery('body').toggleClass('nomenu');
    }
}
