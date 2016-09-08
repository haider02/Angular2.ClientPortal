import {Component, provide, Inject, ViewChild, AfterViewInit, enableProdMode} from '@angular/core';
import {Http} from '@angular/http';
import {Router, RouteParams, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Config, APP_CONFIG, CONFIG} from '../../app-config';
import {enmTabs} from "../../common/enumerations";
//
import {NgForm}    from  '@angular/forms';
import {Utility} from '../../common/utility';
import {GridComponent} from '../../grid/grid.component';
import {Column} from '../../grid/column';
import {HeaderDetailComponent} from '../../common/header-detail.component';
import {ReferenceDataService } from '../../referenceData/reference-data.service';
import {SecurityFormService } from '../securityForm/security-form.service';
import {SecurityControlService } from '../securityControl/security-control.service';
import {SecurityFormControlService } from './security-form-control.service';
import {NotificationsComponent} from '../../notifications/notifications.component';
import {SecurityFormControlModel} from './security-form-control.model';
import {ClientStorage} from '../../common/ClientStorage';
import {LoggingService} from '../../common/logging';

declare var moment: any;
declare var jQuery;


enableProdMode();
@Component({
    selector: 'security-Control',
    templateUrl: "../../dev/tpl/security-form-control.html",
    directives: [NgForm, GridComponent, NotificationsComponent ],
    providers: [ReferenceDataService, SecurityFormService, LoggingService,
        SecurityControlService,
        SecurityFormControlService,
        provide(APP_CONFIG, { useValue: CONFIG })]

})

export class SecurityFormControlComponent implements AfterViewInit {
    _refernceService: ReferenceDataService;
    routeParams: RouteParams;
    appConfig: Config;
    logService: LoggingService;
    SecurityFormControlColumns: Array<Column>;
    SecurityFormControlList = new Array<any>();
    SecurityControlList = new Array<any>();
    SecurityFormList = new Array<any>();
    securityFormService: SecurityFormService;
    securityControlService: SecurityControlService;
    seurityFormControlService: SecurityFormControlService;
    model = new SecurityFormControlModel();
    utility = new Utility();
    VisibleForm: boolean = false;
    applicationId: number = 1;
    @ViewChild(NotificationsComponent) child: NotificationsComponent;

    constructor( 
        @Inject(APP_CONFIG) _appConfig: Config,
        @Inject(Router) _router,
        @Inject(ReferenceDataService) _refService, 
        @Inject(SecurityFormService) _securityFormService, 
        @Inject(SecurityFormControlService) _securityFormControlService, 
        @Inject(SecurityControlService) _securityControlService,       
        @Inject(RouteParams) _routeParams,
        @Inject(LoggingService) _logservice) {        
        this.appConfig = _appConfig;
        this._refernceService = _refService;
        this.securityControlService = _securityControlService;
        this.securityFormService = _securityFormService;
        this.seurityFormControlService = _securityFormControlService;
        this.logService = _logservice;
    }

    getCurrentUserID() {

        let contactId = this.utility.getContactId(); 

        if (contactId !== null)
            return contactId;        

        return null;
    }

    onSave() {

        this.model.CreatedBy = this.getCurrentUserID();
        this.model.LastModBy = this.getCurrentUserID();
        this.model.Inactive = false;
       
        this.seurityFormControlService.saveSecurityFormControls(this.model)
            .subscribe(
            data => this.saveHandler(data),
            error => {
                this.child.showSaveErrorNotification();
                this.child.hideLoader();
            },
            () => this.logService.log("API Call Finished Successfully!")
            );
    }

    saveHandler(data) {
        this.child.hideLoader();
        if (data <= 0)
            this.child.showErrorNotification('Execution Failed', 'Error!');
        else {
            this.child.showSaveSuccessNotification();
            this.getSecurityFormControls(this.applicationId);
            this.reset();
        }
    }

    displayForm() {
        this.VisibleForm = true;
        this.getSecurityForms();
        this.getSecurityControls();
    }

    ngAfterViewInit() {
        this.SecurityFormControlColumns = this.getSecurityFormControlColumns();
        this.getSecurityFormControls(this.applicationId);
    }

    reset() {
        this.model = new SecurityFormControlModel();
        this.VisibleForm = false;
    }

    getSecurityControls() {
        this.child.showLoader();
        this.securityControlService.getAllSecurityControls()
            .subscribe(
            data => {
                this.loadSecurityControls(data);
            },
            error => {
                this.child.hideLoader();
                this.errorHandler(error);

            });
    }
    loadSecurityControls(data) {
        this.child.hideLoader();
        if (data.length > 0) {
            this.SecurityControlList = data;
        }
    }

    getSecurityForms() {
        this.child.showLoader();
        this.securityFormService.getAllSecurityForm()
            .subscribe(
            data => {
                this.loadSecurityForm(data);
            },
            error => {
                this.child.hideLoader();
                this.errorHandler(error);

            });
    }
    loadSecurityForm(data) {
        this.child.hideLoader();
        if (data.length > 0) {
            this.SecurityFormList = data;
        }
    }

    getSecurityFormControls(applicationId) {
        this.child.showLoader();
        this.seurityFormControlService.getAllSecurityFormControls(applicationId)
            .subscribe(
            data => {                            
                this.loadSecurityFormControls(data);
            },
            error => this.errorHandler(error));
    }

    errorHandler(err) {
        this.child.hideLoader();
        this.logService.log(err);
    }

    loadSecurityFormControls(data) {
        this.child.hideLoader();        
        if (data.length > 0) {
            this.SecurityFormControlList =data;
        }
    }

    getSecurityFormControlColumns(): Array<Column> {
        return [
            
            new Column('SecurityFormName', 'Screen Name'),
            new Column('SecyrityControlType', 'Screen Controls'),
            new Column('SecurityFormControlName', 'Security Form Controls'),                     
            new Column('ParentName', 'Parent Control Name'),
            new Column('DeleteOnly', ''),
            new Column('EditOnly', '')

        ];
    }

    deleteSecurityFormControl(row) {

        var con = confirm("Do you really want to delete it ?");
        if (!con) return;

        this.child.showLoader();
        this.seurityFormControlService.deleteSecurityFormControl(row.SecurityFormControlId)
            .subscribe(
            data => {
                this.child.showSuccessNotification("Deleted Successfully", "Success !");
                this.child.hideLoader();
                this.getSecurityFormControls(this.applicationId);
                this.reset();
            },
            error => {
                this.child.showErrorNotification("Error Occurred While Deleting", "Error !");
                this.child.hideLoader();
            },
            () => this.logService.log("API Call Finished Successfully!")
            );
    }

    editSecurityFormControl(row) {
        this.displayForm();
        this.model = row;
        this.model.Name = row.SecurityFormControlName;
    }
}