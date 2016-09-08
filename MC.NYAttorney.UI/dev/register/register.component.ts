import {Component, OnInit, provide, Inject, ViewChild, AfterViewInit, enableProdMode} from '@angular/core';
import {Http} from '@angular/http';
import {Router, RouteParams, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {NgForm}    from '@angular/forms';
import {NotificationsComponent} from '../notifications/notifications.component';
import {LoggingService} from '../common/logging';
import {RegisterDetail} from './register.model';
import {RegisterService} from './register.service';

//declare var moment: any;
//declare var jQuery;

enableProdMode();
@Component({
    selector: 'registerUser',
    templateUrl: '../dev/tpl/registerUser.html',
    directives: [NgForm, NotificationsComponent],
    providers: [ provide(APP_CONFIG, { useValue: CONFIG })
        , RegisterService, LoggingService
    ]
    
})

export class RegisterComponent {
    routeParams: RouteParams;
    @ViewChild(NotificationsComponent) child: NotificationsComponent;
    appConfig: Config;
    router: Router;
    successMessageDisplay: boolean;
    httpService: RegisterService;
    active = true;
    model = new RegisterDetail();
    logService: LoggingService;

    constructor( @Inject(APP_CONFIG) _appConfig: Config, @Inject(Router) _router, @Inject(RouteParams) _routeParams, @Inject(RegisterService) _service, @Inject(LoggingService) _logservice
        ) {

        this.appConfig = _appConfig;
        this.router = _router;
        this.routeParams = _routeParams;
        this.logService = _logservice;
        this.httpService = _service;
    }
    
    onRegister() {
        this.child.showLoader();
        this.fillEmailMessage();

        this.httpService.registerClient(this.model)
            .subscribe(
            data => this.saveHandler(data),
            error => this.errorHandler(error),
            () => this.logService.log("Client Registered Successfully!")
            );

        this.successMessageDisplay = true;
    }

    saveHandler(data) {
        this.model = data;
        this.child.hideLoader();
        if (this.model.ResponseMessage !== "") {
            this.child.showErrorNotification('We could not create an account for you. Please contact Mortgage Connect for assistance', 'Error!');
            return;
        }        
        this.child.showSuccessNotification('Your account is being created. You will receive an email shortly to register the account.', 'Success!');
        this.active = false;
        setTimeout(() => { this.active = true; this.model = new RegisterDetail(); }, 0);        
    }
    
    fillEmailMessage() {    
                
        this.model.PasswordResetUrl = "https://www.mortgageconnectlp.com/clientservices/PasswordReset.aspx";
        var body = this.appConfig.RegisterEmailBody;
        body = body.replace(/PasswordResetTokenValidHours/g, this.appConfig.PasswordResetTokenValidHours.toString());
        body = body.replace(/PasswordResetUrl/g, this.model.PasswordResetUrl);
        this.model.EmailObject.From = this.appConfig.DefaultFromEmailAddress;
        this.model.EmailObject.To = this.model.Email;
        this.model.EmailObject.Subject = this.appConfig.RegisterEmailSubject;
        this.model.EmailObject.Body = body;
    }

    errorHandler(data) {
        this.child.showErrorNotification(data, 'Error!');
        this.child.hideLoader();
    }

    routetoLogin() {
            this.router.navigate(['Login']);        
    }
}