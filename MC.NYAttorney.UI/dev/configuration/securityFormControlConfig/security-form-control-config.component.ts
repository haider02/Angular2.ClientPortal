import {Component, OnInit, provide, Inject, ViewChild, AfterViewInit, enableProdMode} from '@angular/core';
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
import {SecurityFormControlService } from '../securityFormControl/security-form-control.service';
import {SecurityFormControlServiceConfig } from './security-form-control-config.service';
import {NotificationsComponent} from '../../notifications/notifications.component';
import {SecurityFormControlConfigModel} from './security-form-control-config.model';
import {ClientStorage} from '../../common/ClientStorage';
import {LoggingService} from '../../common/logging';
declare var moment: any;
declare var jQuery;


enableProdMode();
@Component({
    selector: 'security-Control',
    templateUrl: "../../dev/tpl/security-control-form-config.html",
    directives: [NgForm, GridComponent, NotificationsComponent ],
    providers: [ ReferenceDataService, SecurityFormService,
        SecurityControlService,
        SecurityFormControlServiceConfig,
        SecurityFormControlService,
        LoggingService,
        provide(APP_CONFIG, { useValue: CONFIG })]

})

export class SecurityFormControlConfigComponent implements AfterViewInit {
    _refernceService: ReferenceDataService;
    routeParams: RouteParams;
    appConfig: Config;
    SecurityFormControlConfigColumns: Array<Column>;
    SecurityFormControlConfigList = new Array<any>();
    SecurityControlList = new Array<any>();
    SecurityFormList = new Array<any>();
    SecurityFormControlList = new Array<any>();
    securityFormService: SecurityFormService;
    securityControlService: SecurityControlService;
    securityFormControlService: SecurityFormControlService;
    seurityFormControlConfigService: SecurityFormControlServiceConfig;
    model = new SecurityFormControlConfigModel();
    utility = new Utility();
    VisibleForm: boolean = false;
    applicationId: number = 1;
    @ViewChild(NotificationsComponent) child: NotificationsComponent;
    AllSecurityFormControlConfigList = new Array<any>();
    WebRolesList = new Array<any>();
    isRoleEnable = true;
    isFormEnable = true;
    isAddMode = true;
    logService: LoggingService;

    constructor( 
        @Inject(APP_CONFIG) _appConfig: Config,
        @Inject(Router) _router,
        @Inject(ReferenceDataService) _refService, 
        @Inject(SecurityFormService) _securityFormService, 
        @Inject(SecurityFormControlServiceConfig) _securityFormControlConfigService, 
        @Inject(SecurityControlService) _securityControlService,
        @Inject(SecurityFormControlService) _securityFormControlService,      
        @Inject(RouteParams) _routeParams,
        @Inject(LoggingService) _logservice) {        
        this.appConfig = _appConfig;
        this._refernceService = _refService;
        this.securityControlService = _securityControlService;
        this.securityFormService = _securityFormService;
        this.seurityFormControlConfigService = _securityFormControlConfigService;
        this.securityFormControlService = _securityFormControlService;
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
       
        this.seurityFormControlConfigService.saveSecurityFormControlsConfig(this.model)
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
            this.getSecurityFormControlsConfig(this.applicationId);
            //this.reset();
            this.VisibleForm = false;
            this.isRoleEnable = true;
            this.isFormEnable = true;
            this.isAddMode = true;
        }
    }

    displayForm() {
        this.isRoleEnable = false;
        this.isFormEnable = false;
        this.VisibleForm = true;        
        this.getSecurityControls();
        this.getSecurityFormControls();
    }

    ngAfterViewInit() {
        this.SecurityFormControlConfigColumns = this.getSecurityFormControlColumns();
        this.getWebRoles();        
        this.getSecurityForms();
    }

    reset() {        
        this.VisibleForm = false;
        this.isRoleEnable = true;
        this.isFormEnable = true;
        this.isAddMode = true;
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

    getSecurityFormControls() {
        this.child.showLoader();
        this.securityFormControlService.getAllSecurityFormControls(this.applicationId)
            .subscribe(
            data => {
                this.loadSecurityControlsForm(data);
            },
            error => {
                this.child.hideLoader();
                this.errorHandler(error);

            });
    }

    loadSecurityControlsForm(data) {
        this.child.hideLoader();
        if (data.length > 0) {
            this.SecurityFormControlList = data;
            this.SecurityFormControlList = this.SecurityFormControlList.filter(x => x.SecurityFormId == this.model.SecurityFormId);
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

    getSecurityFormControlsConfig(applicationId) {
        this.child.showLoader();
        this.seurityFormControlConfigService.getAllSecurityFormControlsConfig(applicationId)
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
            this.SecurityFormControlConfigList = data;
            this.AllSecurityFormControlConfigList = data.slice(0);

            this.SecurityFormControlConfigList = this.AllSecurityFormControlConfigList.filter(
                x => x.SecurityFormId == this.model.SecurityFormId &&
                    x.RoleId == this.model.RoleId);
        }
    }

    getSecurityFormControlColumns(): Array<Column> {
        return [
            
            new Column('SecurityFormName', 'Screen Name'),
            new Column('SecyrityControlType', 'Screen Controls'),
            new Column('SecurityFormControlName', 'Security Form Controls'),
            new Column('IsVisible', 'Visible'),  
            new Column('IsEnabled', 'Enabled'),                       
            new Column('DeleteOnly', ''),
            new Column('EditOnly', '')

        ];
    }

    deleteSecurityFormControlConfig(row) {

        var con = confirm("Do you really want to delete it ?");
        if (!con) return;

        this.child.showLoader();
        this.seurityFormControlConfigService.deleteSecurityFormControlConfig(row.SecurityFormControlConfigId)
            .subscribe(
            data => {
                this.child.showSuccessNotification("Deleted Successfully", "Success !");
                this.child.hideLoader();
                this.getSecurityFormControlsConfig(this.applicationId);                
            },
            error => {
                this.child.showErrorNotification("Error Occurred While Deleting", "Error !");
                this.child.hideLoader();
            },
            () => this.logService.log("API Call Finished Successfully!")
            );
    }

    editSecurityFormControlConfig(row) {
        this.isAddMode = false;
        this.displayForm();
        this.model = row;       
    }

    VisibleChange(check) {
        this.model.IsVisible = check;
    }

    EnabledChange(check) {
        this.model.IsEnabled = check;
    }

    onSearch() {
        this.getSecurityFormControlsConfig(this.applicationId);

        
    }

    onChangeRole(sender) {
        this.model.RoleId = sender.target.value;
        this.SecurityFormControlConfigList = [];
        this.VisibleForm = false;
    }

    onChangeForm(sender) {
        this.model.SecurityFormId = sender.target.value;
        this.SecurityFormControlConfigList = [];
        this.VisibleForm = false;
        this.SecurityFormControlList = this.SecurityFormControlList.filter(x => x.SecurityFormId == this.model.SecurityFormId);
    }

    getWebRoles() {        
        this.seurityFormControlConfigService.getAllWebRoles("C", "C")
            .subscribe(
            data => {
                this.loadWebRoles(data);
            },
            error => {
                this.child.hideLoader();
                this.errorHandler(error);

            });
    }

    loadWebRoles(data) {        
        if (data.length > 0) {
            this.WebRolesList = data;
        }
    }
}