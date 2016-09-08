import {Component, OnInit, provide, Inject, ViewChild, AfterViewInit, enableProdMode} from '@angular/core';
import {Http} from '@angular/http';
import {Router, RouteParams, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Config, APP_CONFIG, CONFIG} from '../../app-config';
import {enmTabs} from "../../common/enumerations";
import {NgForm}    from  '@angular/forms';
import {Utility} from '../../common/utility';
import {GridComponent} from '../../grid/grid.component';
import {Column} from '../../grid/column';
import {HeaderDetailComponent} from '../../common/header-detail.component';
import {ReferenceDataService } from '../../referenceData/reference-data.service';
import {SecurityFormService } from './security-form.service';
import {NotificationsComponent} from '../../notifications/notifications.component';
import {SecurityFormModel} from './security-form.model';
import {ClientStorage} from '../../common/ClientStorage';
import {LoggingService} from '../../common/logging';

declare var moment: any;
declare var jQuery;


enableProdMode();
@Component({
    selector: 'security-Control',
    templateUrl: "../../dev/tpl/security-form.html",
    directives: [NgForm, GridComponent, NotificationsComponent ],
    providers: [ ReferenceDataService, SecurityFormService, LoggingService, 
        provide(APP_CONFIG, { useValue: CONFIG })]

})

export class SecurityFormComponent implements AfterViewInit {
    _refernceService: ReferenceDataService;
    routeParams: RouteParams;
    appConfig: Config;
    logService: LoggingService;
    SecurityFormColumns: Array<Column>;
    SecurityFormList = new Array<any>();
    httpService: SecurityFormService;
    model = new SecurityFormModel();
    utility = new Utility();
    VisibleForm: boolean = false;
    @ViewChild(NotificationsComponent) child: NotificationsComponent;

    constructor( 
        @Inject(APP_CONFIG) _appConfig: Config,
        @Inject(Router) _router,
        @Inject(ReferenceDataService) _refService, 
        @Inject(SecurityFormService) _securityControlService,       
        @Inject(RouteParams) _routeParams,
        @Inject(LoggingService) _logservice) {        
        this.appConfig = _appConfig;
        this._refernceService = _refService;
        this.httpService = _securityControlService;
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
        this.httpService.saveSecurityControls(this.model)
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
            this.getSecurityControls();
            this.reset();
        }
    }
    
    displayForm() {
        this.VisibleForm = true;
    }

    ngAfterViewInit() {
        this.SecurityFormColumns = this.getContactTypeColumns();
        this.getSecurityControls();
    }

    reset() {
        this.model = new SecurityFormModel();
        this.VisibleForm = false;
    }

    getSecurityControls() {
        this.child.showLoader();
        this.httpService.getAllSecurityForm()
            .subscribe(
            data => {                            
                this.loadSecurityControls(data);
            },
            error => this.rolesAndPermissionErrorHandler(error));
    }

    rolesAndPermissionErrorHandler(err) {
        this.child.hideLoader();
        this.logService.log(err);
    }

    loadSecurityControls(data) {
        this.child.hideLoader();        
        if (data.length > 0) {
            this.SecurityFormList=data;
        }
    }

    getContactTypeColumns(): Array<Column> {
        return [            
            new Column('Name', 'Form Name'),
            new Column('Description', 'Description'),            
            new Column('DeleteOnly', ''),
            new Column('EditOnly', '')

        ];
    }

    deleteFormControl(row) {

        var con = confirm("Do you really want to delete it ?");
        if (!con) return;

        this.child.showLoader();
        this.httpService.deleteSecurityControls(row.SecurityFormId)
            .subscribe(
            data => {
                this.child.showSuccessNotification("Deleted Successfully", "Success !");
                this.child.hideLoader();
                this.getSecurityControls();
                this.reset();
            },
            error => {
                this.child.showErrorNotification("Error Occurred While Deleting", "Error !");
                this.child.hideLoader();
            },
            () => this.logService.log("API Call Finished Successfully!")
            );
    }

    editFormControl(row) {
        this.VisibleForm = true;
        this.model = row;
    }
}