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
var forms_1 = require('@angular/forms');
var utility_1 = require('../../common/utility');
var grid_component_1 = require('../../grid/grid.component');
var column_1 = require('../../grid/column');
var reference_data_service_1 = require('../../referenceData/reference-data.service');
var security_form_service_1 = require('./security-form.service');
var notifications_component_1 = require('../../notifications/notifications.component');
var security_form_model_1 = require('./security-form.model');
var logging_1 = require('../../common/logging');
core_1.enableProdMode();
var SecurityFormComponent = (function () {
    function SecurityFormComponent(_appConfig, _router, _refService, _securityControlService, _routeParams, _logservice) {
        this.SecurityFormList = new Array();
        this.model = new security_form_model_1.SecurityFormModel();
        this.utility = new utility_1.Utility();
        this.VisibleForm = false;
        this.appConfig = _appConfig;
        this._refernceService = _refService;
        this.httpService = _securityControlService;
        this.logService = _logservice;
    }
    SecurityFormComponent.prototype.getCurrentUserID = function () {
        var contactId = this.utility.getContactId();
        if (contactId !== null)
            return contactId;
        return null;
    };
    SecurityFormComponent.prototype.onSave = function () {
        var _this = this;
        this.model.CreatedBy = this.getCurrentUserID();
        this.model.LastModBy = this.getCurrentUserID();
        this.model.Inactive = false;
        this.httpService.saveSecurityControls(this.model)
            .subscribe(function (data) { return _this.saveHandler(data); }, function (error) {
            _this.child.showSaveErrorNotification();
            _this.child.hideLoader();
        }, function () { return _this.logService.log("API Call Finished Successfully!"); });
    };
    SecurityFormComponent.prototype.saveHandler = function (data) {
        this.child.hideLoader();
        if (data <= 0)
            this.child.showErrorNotification('Execution Failed', 'Error!');
        else {
            this.child.showSaveSuccessNotification();
            this.getSecurityControls();
            this.reset();
        }
    };
    SecurityFormComponent.prototype.displayForm = function () {
        this.VisibleForm = true;
    };
    SecurityFormComponent.prototype.ngAfterViewInit = function () {
        this.SecurityFormColumns = this.getContactTypeColumns();
        this.getSecurityControls();
    };
    SecurityFormComponent.prototype.reset = function () {
        this.model = new security_form_model_1.SecurityFormModel();
        this.VisibleForm = false;
    };
    SecurityFormComponent.prototype.getSecurityControls = function () {
        var _this = this;
        this.child.showLoader();
        this.httpService.getAllSecurityForm()
            .subscribe(function (data) {
            _this.loadSecurityControls(data);
        }, function (error) { return _this.rolesAndPermissionErrorHandler(error); });
    };
    SecurityFormComponent.prototype.rolesAndPermissionErrorHandler = function (err) {
        this.child.hideLoader();
        this.logService.log(err);
    };
    SecurityFormComponent.prototype.loadSecurityControls = function (data) {
        this.child.hideLoader();
        if (data.length > 0) {
            this.SecurityFormList = data;
        }
    };
    SecurityFormComponent.prototype.getContactTypeColumns = function () {
        return [
            new column_1.Column('Name', 'Form Name'),
            new column_1.Column('Description', 'Description'),
            new column_1.Column('DeleteOnly', ''),
            new column_1.Column('EditOnly', '')
        ];
    };
    SecurityFormComponent.prototype.deleteFormControl = function (row) {
        var _this = this;
        var con = confirm("Do you really want to delete it ?");
        if (!con)
            return;
        this.child.showLoader();
        this.httpService.deleteSecurityControls(row.SecurityFormId)
            .subscribe(function (data) {
            _this.child.showSuccessNotification("Deleted Successfully", "Success !");
            _this.child.hideLoader();
            _this.getSecurityControls();
            _this.reset();
        }, function (error) {
            _this.child.showErrorNotification("Error Occurred While Deleting", "Error !");
            _this.child.hideLoader();
        }, function () { return _this.logService.log("API Call Finished Successfully!"); });
    };
    SecurityFormComponent.prototype.editFormControl = function (row) {
        this.VisibleForm = true;
        this.model = row;
    };
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], SecurityFormComponent.prototype, "child", void 0);
    SecurityFormComponent = __decorate([
        core_1.Component({
            selector: 'security-Control',
            templateUrl: "../../dev/tpl/security-form.html",
            directives: [forms_1.NgForm, grid_component_1.GridComponent, notifications_component_1.NotificationsComponent],
            providers: [reference_data_service_1.ReferenceDataService, security_form_service_1.SecurityFormService, logging_1.LoggingService,
                core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG })]
        }),
        __param(0, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(1, core_1.Inject(router_deprecated_1.Router)),
        __param(2, core_1.Inject(reference_data_service_1.ReferenceDataService)),
        __param(3, core_1.Inject(security_form_service_1.SecurityFormService)),
        __param(4, core_1.Inject(router_deprecated_1.RouteParams)),
        __param(5, core_1.Inject(logging_1.LoggingService))
    ], SecurityFormComponent);
    return SecurityFormComponent;
}());
exports.SecurityFormComponent = SecurityFormComponent;
//# sourceMappingURL=security-form.component.js.map