import {Component, OnInit, provide, Inject, ViewChild, AfterViewInit, enableProdMode} from '@angular/core';
import {Http} from '@angular/http';
import {Router, RouteParams, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {NgForm}    from '@angular/forms';
import {NotificationsComponent} from '../notifications/notifications.component';
import {ReferenceDataService } from '../referenceData/reference-data.service';
import {GridComponent} from '../grid/grid.component';
import {Column} from '../grid/column';
import {PasswordResetService} from './password-reset.service';
import {LoggingService} from '../common/logging';
import {ClientStorage} from '../common/ClientStorage';
import {ClientStorageConstants} from '../common/constants';

declare var moment: any;
declare var jQuery;

enableProdMode();
@Component({
    selector: 'password-reset',
    templateUrl: '../../dev/tpl/password-reset.html',
    directives: [NgForm, NotificationsComponent, GridComponent],
    providers: [ ReferenceDataService, provide(APP_CONFIG, { useValue: CONFIG })
        , PasswordResetService, LoggingService
    ]
    
})

export class PasswordResetComponent implements OnInit, AfterViewInit {
    routeParams: RouteParams;
    @ViewChild(NotificationsComponent) child: NotificationsComponent;    
    appConfig: Config;
    router: Router;
    referenceDataService: ReferenceDataService;
    successMessageDisplay: boolean;
    httpService: PasswordResetService;
    showChangePassword: boolean;
    logService: LoggingService;
    model = new PasswordResetClass();
    isPasswordMatch = true;
	secretQuestion: number;
    secretQuestions: Array<any>;
	key = "";
	status = "Please Wait...";

    constructor( @Inject(APP_CONFIG) _appConfig: Config, @Inject(ReferenceDataService) _referenceData,
        @Inject(Router) _router, @Inject(RouteParams) _routeParams
        , @Inject(PasswordResetService) _service, @Inject(LoggingService) _logservice
        ) {

        this.appConfig = _appConfig;
        this.referenceDataService = _referenceData;
        this.router = _router;
        this.routeParams = _routeParams;
        this.logService = _logservice;
        this.httpService = _service;
        
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.key = ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_key);
		this.getPasswordResetStatus();
    }

	

    getPasswordResetStatus() {
		var validHours = this.appConfig.PasswordResetTokenValidHours;        
        this.httpService.getPasswordResetStatus(this.key, validHours)
            .subscribe(
            data => this.saveHandler(data),
            error => {
                this.child.showSaveErrorNotification();
                this.child.hideLoader();
            },
            () => this.logService.log("Password Reset Successfully!")
            );

        this.successMessageDisplay = true;
    }

    saveHandler(data) {
        this.model = data;
        if (this.model.isSuccess == false) {
            this.status = this.model.Message;            
            return;
        }        
        this.status = "";

        ClientStorage.setSessionStorageItem(ClientStorageConstants.LS_RP_contactId, this.model.ContactId);
        ClientStorage.setSessionStorageItem(ClientStorageConstants.LS_RP_email, this.model.Email);
        ClientStorage.setSessionStorageItem(ClientStorageConstants.LS_RP_originator, this.model.Originator);

        this.router.navigate(['ChangePassword']);
    }
}

class PasswordResetClass {
    constructor(
        public isSuccess: boolean = false,
        public Message: string = "",
        public ContactId: string = "",
        public Email: string = "",
        public Originator: string = ""
    ) { }
}