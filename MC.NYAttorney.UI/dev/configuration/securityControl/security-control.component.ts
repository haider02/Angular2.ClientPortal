import {Component, OnInit, provide, Inject, ViewChild, AfterViewInit, enableProdMode} from '@angular/core';
import {Http} from '@angular/http';
import {Router, RouteParams, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Config, APP_CONFIG, CONFIG} from '../../app-config';
import {enmTabs} from "../../common/enumerations";
//
import {NgForm}    from '@angular/forms';
import {Utility} from '../../common/utility';
import {GridComponent} from '../../grid/grid.component';
import {Column} from '../../grid/column';
import {HeaderDetailComponent} from '../../common/header-detail.component';
import {ReferenceDataService } from '../../referenceData/reference-data.service';
import {SecurityControlService } from './security-control.service';
import {NotificationsComponent} from '../../notifications/notifications.component';
import {SecurityControlModel} from './security-control.model';
import {ClientStorage} from '../../common/ClientStorage';
import {LoggingService} from '../../common/logging';

declare var moment: any;
declare var jQuery;


enableProdMode();
@Component({
    selector: 'security-Control',
    templateUrl: "../../dev/tpl/security-control.html",
    directives: [NgForm, GridComponent, NotificationsComponent ],
    providers: [ ReferenceDataService, SecurityControlService, LoggingService,
        provide(APP_CONFIG, { useValue: CONFIG })]

})

export class SecurityControlComponent implements AfterViewInit {
    _refernceService: ReferenceDataService;
    routeParams: RouteParams;
    appConfig: Config;
    logService: LoggingService;
    SecurityControlsColumns: Array<Column>;
    SecurityControlsList = new Array<any>();
    httpService: SecurityControlService;
    model = new SecurityControlModel();
    utility = new Utility();
    VisibleForm: boolean = false;
    @ViewChild(NotificationsComponent) child: NotificationsComponent;

    constructor( 
        @Inject(APP_CONFIG) _appConfig: Config,
        @Inject(Router) _router,
        @Inject(ReferenceDataService) _refService, 
        @Inject(SecurityControlService) _securityControlService,       
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
        this.SecurityControlsColumns = this.getContactTypeColumns();
        this.getSecurityControls();
    }

    reset() {
        this.model = new SecurityControlModel();
        this.VisibleForm = false;
    }

    getSecurityControls() {
        this.child.showLoader();
        this.httpService.getAllSecurityControls()
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
            this.SecurityControlsList=data;
        }
    }

    getContactTypeColumns(): Array<Column> {
        return [            
            new Column('ControlType', 'Control Type'),
            new Column('Description', 'Description'),            
            new Column('DeleteOnly', ''),
            new Column('EditOnly', '')
        ];
    }

    deleteSecurityControl(row) {

        var con = confirm("Do you really want to delete it ?");
        if (!con) return;

        this.child.showLoader();
        this.httpService.deleteSecurityControls(row.SecurityControlId)
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

    editSecurityControl(row) {
        this.VisibleForm = true;
        this.model = row;
    }
}