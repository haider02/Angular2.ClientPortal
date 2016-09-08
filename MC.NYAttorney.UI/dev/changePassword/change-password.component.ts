import {Component, OnInit, Inject, provide, ViewChild, AfterViewInit} from '@angular/core';
import {ChangePasswordModel} from './change-password.model';
import {Http} from '@angular/http';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {Utility} from '../common/utility';
import {ChangePasswordService} from './change-password.service';
import {Router, RouteParams, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {ReCaptchaComponent} from '../common/reCaptchaComponent'
import {NotificationsComponent} from '../notifications/notifications.component';
import {LoggingService} from '../common/logging';
import {ClientStorage} from '../common/ClientStorage';
import {ClientStorageConstants} from '../common/constants';
declare var jQuery;

@Component({
    selector: 'change-password',
    templateUrl: '../dev/tpl/change-password.html',
    directives: [ROUTER_DIRECTIVES, ReCaptchaComponent, NotificationsComponent],
    providers: [provide(APP_CONFIG, { useValue: CONFIG }), ChangePasswordService, LoggingService]
})
export class ChangePasswordComponent implements AfterViewInit {    
    model = new ChangePasswordModel();
    showOldPassword: boolean = false;
    httpService: ChangePasswordService;
    routeParams: RouteParams;
    appConfig: Config;
    router: Router;
    logService: LoggingService;
    @ViewChild(ReCaptchaComponent) childReCaptcha: ReCaptchaComponent;
    @ViewChild(NotificationsComponent) childNotify: NotificationsComponent;

    utility = new Utility();
    constructor( @Inject(APP_CONFIG) _appConfig: Config, @Inject(ChangePasswordService) _accountService, @Inject(Router) _router, @Inject(RouteParams) _routeParams, @Inject(LoggingService) _logservice) {
        this.httpService = _accountService;
        this.router = _router;
        this.routeParams = _routeParams;
        this.logService = _logservice;
        this.appConfig = _appConfig;

        if (ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_originator) !== null) {
            this.SetUserData(ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_email), false, +ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_contactId) );
        }
    }

    ngAfterViewInit() {        
        if (location.href.split("/").slice(-1).toString() == "account-profile") {            
        }
        else {
            jQuery('.content-wrapper').addClass('ChangePwdOnly');            
        }
    }

    vaildateData() {
        let alertmg = "";


        if (ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_originator) == null && this.model.OldPassword == "") {
            alertmg = 'Old Password is Required.\r\n';
        }

        if ( this.model.OldPassword == this.model.NewPassword ){
            alertmg = 'Old and New Password should never be the same.\r\n';
        }

        if (this.utility.containsSpecial(this.model.NewPassword) == false) {
            alertmg = 'Passwords must have at least one non letter character.\r\n';
        }

        if (this.utility.containsNumeric(this.model.NewPassword) == false) {
            alertmg = alertmg + 'Passwords must have at least one digit (0-9).\r\n';
        }

        if (this.utility.containsUpperCase(this.model.NewPassword) == false) {
            alertmg = alertmg + 'Passwords must have at least one uppercase (A-Z).\r\n';
        }

        if (this.utility.containsLowerCase(this.model.NewPassword) == false) {
            alertmg = alertmg + 'Passwords must have at least one lowercase (a-z).\r\n';
        }

        if (this.utility.verifyMinimumLength(this.model.NewPassword, 8) == false) {
            alertmg = alertmg + 'Password must be at least 8 characters long.';
        }

        return alertmg;
    }

    SetUserData(email, isOldPassVisible, contactID) {
        this.model.Email = email;
        this.showOldPassword = isOldPassVisible;
        
        if (contactID !== null) {
            this.model.ContactID = contactID;
        }
        else {
            this.validateUserEmail(email);
        }
    }

    validateUserEmail(email) {
        this.httpService.validateUserEmail(email)
            .subscribe(
            data => this.loadValidationData(data),
            error => this.logService.log(error + ": Invalid email address"),
            () => this.logService.log("email address validated!")
            );
    }


    loadValidationData(data) {
        this.model.ContactID = data.contactID;
    }

    onSubmitForm() {

        if (this.childReCaptcha.verified == false) {
            alert('Please verify yourself.');
            return;
        }

        var alertmsg = this.vaildateData();
        if (alertmsg !== '') {
            alert(alertmsg);
            return false;
        }
        else {
            this.saveChangePasword();
        }
    }

    saveChangePasword() {
        this.fillEmailMessage();
        if (ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_originator) == null) {
            this.httpService.updateUserPassword(this.model)
                .subscribe(
                data => this.redirectToLogin(),
                error => this.showError(error),
                () => this.logService.log("user details loaded Successfully!")
                );
        }
        else {
            this.httpService.setUserPassword(this.model)
                .subscribe(
                data => this.redirectToLogin(),
                error => this.showError(error),
                () => this.logService.log("user details loaded Successfully!")
                );
        }
    }

    redirectToLogin() {

        alert('Password changed successfully.');
        this.router.navigate(['Login']);
    }
    
    showError(error) {
        alert(error);
        return false;
    }
    
    fillEmailMessage() {
        var body = this.appConfig.ChangePasswordBody;
        this.model.EmailObject.From = this.appConfig.DefaultFromEmailAddress;
        this.model.EmailObject.To = this.model.Email;
        this.model.EmailObject.Subject = this.appConfig.ChangePasswordSubject;
        this.model.EmailObject.Body = body;
    }
}

