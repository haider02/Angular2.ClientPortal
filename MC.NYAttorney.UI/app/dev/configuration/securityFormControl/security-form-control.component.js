"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var router_deprecated_1 = require('@angular/router-deprecated');
var app_config_1 = require('../../app-config');
//
var forms_1 = require('@angular/forms');
var utility_1 = require('../../common/utility');
var grid_component_1 = require('../../grid/grid.component');
var column_1 = require('../../grid/column');
var reference_data_service_1 = require('../../referenceData/reference-data.service');
var security_form_service_1 = require('../securityForm/security-form.service');
var security_control_service_1 = require('../securityControl/security-control.service');
var security_form_control_service_1 = require('./security-form-control.service');
var notifications_component_1 = require('../../notifications/notifications.component');
var security_form_control_model_1 = require('./security-form-control.model');
var logging_1 = require('../../common/logging');
core_1.enableProdMode();
var SecurityFormControlComponent = (function () {
    function SecurityFormControlComponent(_appConfig, _router, _refService, _securityFormService, _securityFormControlService, _securityControlService, _routeParams, _logservice) {
        this.SecurityFormControlList = new Array();
        this.SecurityControlList = new Array();
        this.SecurityFormList = new Array();
        this.model = new security_form_control_model_1.SecurityFormControlModel();
        this.utility = new utility_1.Utility();
        this.VisibleForm = false;
        this.applicationId = 1;
        this.appConfig = _appConfig;
        this._refernceService = _refService;
        this.securityControlService = _securityControlService;
        this.securityFormService = _securityFormService;
        this.seurityFormControlService = _securityFormControlService;
        this.logService = _logservice;
    }
    SecurityFormControlComponent.prototype.getCurrentUserID = function () {
        var contactId = this.utility.getContactId();
        if (contactId !== null)
            return contactId;
        return null;
    };
    SecurityFormControlComponent.prototype.onSave = function () {
        var _this = this;
        this.model.CreatedBy = this.getCurrentUserID();
        this.model.LastModBy = this.getCurrentUserID();
        this.model.Inactive = false;
        this.seurityFormControlService.saveSecurityFormControls(this.model)
            .subscribe(function (data) { return _this.saveHandler(data); }, function (error) {
            _this.child.showSaveErrorNotification();
            _this.child.hideLoader();
        }, function () { return _this.logService.log("API Call Finished Successfully!"); });
    };
    SecurityFormControlComponent.prototype.saveHandler = function (data) {
        this.child.hideLoader();
        if (data <= 0)
            this.child.showErrorNotification('Execution Failed', 'Error!');
        else {
            this.child.showSaveSuccessNotification();
            this.getSecurityFormControls(this.applicationId);
            this.reset();
        }
    };
    SecurityFormControlComponent.prototype.displayForm = function () {
        this.VisibleForm = true;
        this.getSecurityForms();
        this.getSecurityControls();
    };
    SecurityFormControlComponent.prototype.ngAfterViewInit = function () {
        this.SecurityFormControlColumns = this.getSecurityFormControlColumns();
        this.getSecurityFormControls(this.applicationId);
    };
    SecurityFormControlComponent.prototype.reset = function () {
        this.model = new security_form_control_model_1.SecurityFormControlModel();
        this.VisibleForm = false;
    };
    SecurityFormControlComponent.prototype.getSecurityControls = function () {
        var _this = this;
        this.child.showLoader();
        this.securityControlService.getAllSecurityControls()
            .subscribe(function (data) {
            _this.loadSecurityControls(data);
        }, function (error) {
            _this.child.hideLoader();
            _this.errorHandler(error);
        });
    };
    SecurityFormControlComponent.prototype.loadSecurityControls = function (data) {
        this.child.hideLoader();
        if (data.length > 0) {
            this.SecurityControlList = data;
        }
    };
    SecurityFormControlComponent.prototype.getSecurityForms = function () {
        var _this = this;
        this.child.showLoader();
        this.securityFormService.getAllSecurityForm()
            .subscribe(function (data) {
            _this.loadSecurityForm(data);
        }, function (error) {
            _this.child.hideLoader();
            _this.errorHandler(error);
        });
    };
    SecurityFormControlComponent.prototype.loadSecurityForm = function (data) {
        this.child.hideLoader();
        if (data.length > 0) {
            this.SecurityFormList = data;
        }
    };
    SecurityFormControlComponent.prototype.getSecurityFormControls = function (applicationId) {
        var _this = this;
        this.child.showLoader();
        this.seurityFormControlService.getAllSecurityFormControls(applicationId)
            .subscribe(function (data) {
            _this.loadSecurityFormControls(data);
        }, function (error) { return _this.errorHandler(error); });
    };
    SecurityFormControlComponent.prototype.errorHandler = function (err) {
        this.child.hideLoader();
        this.logService.log(err);
    };
    SecurityFormControlComponent.prototype.loadSecurityFormControls = function (data) {
        this.child.hideLoader();
        if (data.length > 0) {
            this.SecurityFormControlList = data;
        }
    };
    SecurityFormControlComponent.prototype.getSecurityFormControlColumns = function () {
        return [
            new column_1.Column('SecurityFormName', 'Screen Name'),
            new column_1.Column('SecyrityControlType', 'Screen Controls'),
            new column_1.Column('SecurityFormControlName', 'Security Form Controls'),
            new column_1.Column('ParentName', 'Parent Control Name'),
            new column_1.Column('DeleteOnly', ''),
            new column_1.Column('EditOnly', '')
        ];
    };
    SecurityFormControlComponent.prototype.deleteSecurityFormControl = function (row) {
        var _this = this;
        var con = confirm("Do you really want to delete it ?");
        if (!con)
            return;
        this.child.showLoader();
        this.seurityFormControlService.deleteSecurityFormControl(row.SecurityFormControlId)
            .subscribe(function (data) {
            _this.child.showSuccessNotification("Deleted Successfully", "Success !");
            _this.child.hideLoader();
            _this.getSecurityFormControls(_this.applicationId);
            _this.reset();
        }, function (error) {
            _this.child.showErrorNotification("Error Occurred While Deleting", "Error !");
            _this.child.hideLoader();
        }, function () { return _this.logService.log("API Call Finished Successfully!"); });
    };
    SecurityFormControlComponent.prototype.editSecurityFormControl = function (row) {
        this.displayForm();
        this.model = row;
        this.model.Name = row.SecurityFormControlName;
    };
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], SecurityFormControlComponent.prototype, "child", void 0);
    SecurityFormControlComponent = __decorate([
        core_1.Component({
            selector: 'security-Control',
            templateUrl: "../../dev/tpl/security-form-control.html",
            directives: [forms_1.NgForm, grid_component_1.GridComponent, notifications_component_1.NotificationsComponent],
            providers: [reference_data_service_1.ReferenceDataService, security_form_service_1.SecurityFormService, logging_1.LoggingService,
                security_control_service_1.SecurityControlService,
                security_form_control_service_1.SecurityFormControlService,
                core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG })]
        }),
        __param(0, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(1, core_1.Inject(router_deprecated_1.Router)),
        __param(2, core_1.Inject(reference_data_service_1.ReferenceDataService)),
        __param(3, core_1.Inject(security_form_service_1.SecurityFormService)),
        __param(4, core_1.Inject(security_form_control_service_1.SecurityFormControlService)),
        __param(5, core_1.Inject(security_control_service_1.SecurityControlService)),
        __param(6, core_1.Inject(router_deprecated_1.RouteParams)),
        __param(7, core_1.Inject(logging_1.LoggingService))
    ], SecurityFormControlComponent);
    return SecurityFormControlComponent;
}());
exports.SecurityFormControlComponent = SecurityFormControlComponent;
//# sourceMappingURL=security-form-control.component.js.map