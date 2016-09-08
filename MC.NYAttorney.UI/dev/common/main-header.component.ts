import {Component, OnInit,provide, Inject,AfterViewInit} from '@angular/core';
import {NgForm}    from '@angular/forms';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Http} from '@angular/http';
import {LoggingService} from '../common/logging';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {Utility} from '../common/utility';
import {ClientStorage} from '../common/ClientStorage';
import {LoginService} from '../login/login.service';
import {ClientStorageConstants} from '../common/constants';
declare var jQuery;
@Component( {
    selector: 'main-header',
	templateUrl: '../dev/tpl/main-header.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [provide(APP_CONFIG, { useValue: CONFIG }), LoginService, LoggingService]
})

export class MainHeaderComponent {
    router: Router;
    utility = new Utility();
    loginService: LoginService;
    logService: LoggingService;

    constructor( @Inject(Router) _router, @Inject(LoginService) _loginsrv, @Inject(LoggingService) _logservice) {       
        this.router = _router;
        this.loginService = _loginsrv;
        this.logService = _logservice;
    }
        
    getUserName(){
        let userName = ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_user_FullName);        
        if (userName == null)
            return "";
        return userName;
    }

    signOut() {        
        this.loginService.logout()
            .subscribe(
            data => {
                ClientStorage.clearSessionStorage();
                this.router.navigate(['Login']);                
            },
            error => this.logService.log(error + ": error while fetching user details"),
            () => this.logService.log("user detials loaded Successfully!")
            );
    }

    dashBoardClick() {        
        if (location.href.split("/").slice(-1).toString() == "dashboard") {
            window.location.reload(false);
        }
    }

    isTokenExists() {
        var token = ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_id_token);
        if (token == null)
            return true;
        return false;
    }    
}
