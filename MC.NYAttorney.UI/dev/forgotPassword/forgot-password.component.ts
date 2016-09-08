import {Component, OnInit, Inject, provide, ViewChild, AfterViewInit} from '@angular/core';
import {Http} from '@angular/http';
import {NgForm}    from '@angular/forms';
import {Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {NotificationsComponent} from '../notifications/notifications.component';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {ForgotPasswordService} from './forgot-password.service';
import {ForgotPasswordDetail} from './forgot-password.model';
import {LoggingService} from '../common/logging';
declare var jQuery;

@Component({
    selector: 'forgot-password',
    templateUrl: '../dev/tpl/forgot-password.html',
    directives: [ROUTER_DIRECTIVES, NotificationsComponent],
    providers: [ provide(APP_CONFIG, { useValue: CONFIG }), ForgotPasswordService, LoggingService ]
})

export class ForgotPasswordComponent {

    router: Router;
    appConfig: Config;
    @ViewChild(NotificationsComponent) child: NotificationsComponent;
    httpService: ForgotPasswordService;
    isValidUser: boolean;
    model = new ForgotPasswordDetail();
    emailAddress: string=null;
    logService: LoggingService;

    constructor( @Inject(APP_CONFIG) _appConfig: Config, @Inject(Router) _router, @Inject(ForgotPasswordService) _service, @Inject(LoggingService) _logservice) {
        this.appConfig = _appConfig;        
        this.router = _router;
        this.httpService = _service;
        this.isValidUser = true;
        this.logService = _logservice;
    }

    onSendPassword() {
        this.validateUserEmail(this.model);
    }

    validateUserEmail(details) {
        this.httpService.validateUserEmail(details)
            .subscribe(
            data => this.loadValidationData(data),
            error => this.child.showErrorNotification(error, "Error"),
            () => this.logService.log("email address validated!")
            );
    }

    loadValidationData(data)
    {
        if (data.isSuccess == true) {
            this.model = data;
            this.fillEmailMessage();
            this.model.EmailObject.To = this.model.Email;
            this.forgotPassword(this.model);
        }    
    }

    forgotPassword(data)
    {
        this.httpService.forgotPassword(data)
            .subscribe(
            data => this.onEmailSent(data),
            error => this.child.showErrorNotification(error, "Error"),
            () => this.logService.log("email send successfully!")
            );

    }

    fillEmailMessage() {
        var body = this.appConfig.ForgotPasswordEmailBody.toString();
        body = body.replace(/PasswordResetTokenValidHours/g, this.appConfig.PasswordResetTokenValidHours.toString());    
        this.model.EmailObject.From = this.appConfig.DefaultFromEmailAddress;
        this.model.EmailObject.To = this.model.Email;
        this.model.EmailObject.Subject = "Password Reset";
        this.model.EmailObject.Body = body;
    }

    onEmailSent(data)
    {
        if (data.isSuccess == true)        
            this.child.showSuccessNotification("You will receive an email shortly to change the password", "Success!");            
    }
    
    routetoLogin() {
        this.router.navigate(['Login']);
    }


}
