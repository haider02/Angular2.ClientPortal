import {Component, OnInit, Inject, provide, ViewChild, AfterViewInit} from '@angular/core';
import {Http} from '@angular/http';
import {NgForm}    from '@angular/forms';
import {Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {NotificationsComponent} from '../notifications/notifications.component';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {LoggingService} from '../common/logging';
import {Login} from './login.model';
import {LoginService} from './login.service';
import {Cookie} from '../common/cookie';
import {ClientStorage} from '../common/ClientStorage';
import {ClientStorageConstants} from '../common/constants';
declare var jQuery;

@Component({
    selector: 'login',
    templateUrl: '../dev/tpl/login.html',
    directives: [ROUTER_DIRECTIVES, NotificationsComponent],
    providers: [provide(APP_CONFIG, { useValue: CONFIG }), LoginService, LoggingService  ]
})

export class LoginComponent implements AfterViewInit {
    router: Router;
    appConfig: Config;
    @ViewChild(NotificationsComponent) child: NotificationsComponent;
    logService: LoggingService;
    httpService: LoginService;
    model = new Login();
    isValidUser: boolean;

    constructor( @Inject(APP_CONFIG) _appConfig: Config, @Inject(Router) _router, @Inject(LoginService) _service, @Inject(LoggingService) _logservice) {
        this.appConfig = _appConfig;        
        this.router = _router;
        this.httpService = _service;
        this.isValidUser = true;   
        this.logService = _logservice;     
    }
    
    ngAfterViewInit() {
        if (ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_id_token) !== null) {
            this.router.navigate(['DashBoard']);
        }
        else {
            if (Cookie.getCookie("CPRememberMe") == "true") {
                this.model.rememberMe = true;
                this.model.username = Cookie.getCookie("CPUserName");
            }
            else {
                this.model.rememberMe = false;
                this.model.username = "";
            }
            jQuery('.dashboard-wrapper.main').addClass('login');
            jQuery('#dashboard footer').css('display', 'none');
        }
    }
    
    onLogin() {             
        this.child.showLoader();
        this.isValidUser = true;
        this.httpService.ValidateUser(this.model)
            .subscribe(
            data => this.validateLoginHandler(data),
            error => this.validateLoginErrorHandler(error),
            () => this.logService.log("Client Login Successfully!")
            );
    }
    
    validateLoginErrorHandler(error) {
        this.child.hideLoader();
        this.model.errorMessage = error.toString();
        this.isValidUser = false;
    }

    validateLoginHandler(data) {
        if (this.model.rememberMe == true) {
            Cookie.setCookie("CPRememberMe", "true", 30);
            Cookie.setCookie("CPUserName", this.model.username, 30);
        }
        else {
            Cookie.setCookie("CPRememberMe", "false", 30);
            Cookie.setCookie("CPUserName", "", 30);
        }       
        this.pushToLocalStorage(data);
        this.isValidUser = true;
        this.child.hideLoader();
        this.router.navigate(['DashBoard']);            
    }
    
    onLogOut() {
        this.httpService.logout()
            .subscribe(
            data => this.validateLogoutHandler(data),
            error => {
                this.isValidUser = false;
            },
            () => this.logService.log("Client LogoutSuccessfully!")
            );
    }

    validateLogoutHandler(data) {
        this.isValidUser = false;
        this.removeFromLocalStorage();        
        this.router.navigate(['Login']);
    }
    
    pushToLocalStorage(data) {
        ClientStorage.setSessionStorageItem(ClientStorageConstants.LS_apiURL, this.appConfig.apiBaseUrl);
        ClientStorage.setSessionStorageItem(ClientStorageConstants.LS_id_token, data.access_token);
        ClientStorage.setSessionStorageItem(ClientStorageConstants.LS_refresh_token, data.refresh_token);        
        ClientStorage.setSessionStorageItem(ClientStorageConstants.LS_user_ContactId, data.userContactId);
        ClientStorage.setSessionStorageItem(ClientStorageConstants.LS_user_ClientId, data.userClientId);
        ClientStorage.setSessionStorageItem(ClientStorageConstants.LS_user_FullName, data.userFullName);
        ClientStorage.setSessionStorageItem(ClientStorageConstants.LS_session_TimeOut, data.SessionTimeOutinMinutes);
        ClientStorage.setSessionStorageItem(ClientStorageConstants.LS_session_TimeOut_Warning, data.SessionTimeOutWarninginMinutes);
        
    }

    removeFromLocalStorage() {
        ClientStorage.clearSessionStorage();
    }


}
