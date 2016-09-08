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
var security_control_service_1 = require('./security-control.service');
var notifications_component_1 = require('../../notifications/notifications.component');
var security_control_model_1 = require('./security-control.model');
var logging_1 = require('../../common/logging');
core_1.enableProdMode();
var SecurityControlComponent = (function () {
    function SecurityControlComponent(_appConfig, _router, _refService, _securityControlService, _routeParams, _logservice) {
        this.SecurityControlsList = new Array();
        this.model = new security_control_model_1.SecurityControlModel();
        this.utility = new utility_1.Utility();
        this.VisibleForm = false;
        this.appConfig = _appConfig;
        this._refernceService = _refService;
        this.httpService = _securityControlService;
        this.logService = _logservice;
    }
    SecurityControlComponent.prototype.getCurrentUserID = function () {
        var contactId = this.utility.getContactId();
        if (contactId !== null)
            return contactId;
        return null;
    };
    SecurityControlComponent.prototype.onSave = function () {
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
    SecurityControlComponent.prototype.saveHandler = function (data) {
        this.child.hideLoader();
        if (data <= 0)
            this.child.showErrorNotification('Execution Failed', 'Error!');
        else {
            this.child.showSaveSuccessNotification();
            this.getSecurityControls();
            this.reset();
        }
    };
    SecurityControlComponent.prototype.displayForm = function () {
        this.VisibleForm = true;
    };
    SecurityControlComponent.prototype.ngAfterViewInit = function () {
        this.SecurityControlsColumns = this.getContactTypeColumns();
        this.getSecurityControls();
    };
    SecurityControlComponent.prototype.reset = function () {
        this.model = new security_control_model_1.SecurityControlModel();
        this.VisibleForm = false;
    };
    SecurityControlComponent.prototype.getSecurityControls = function () {
        var _this = this;
        this.child.showLoader();
        this.httpService.getAllSecurityControls()
            .subscribe(function (data) {
            _this.loadSecurityControls(data);
        }, function (error) { return _this.rolesAndPermissionErrorHandler(error); });
    };
    SecurityControlComponent.prototype.rolesAndPermissionErrorHandler = function (err) {
        this.child.hideLoader();
        this.logService.log(err);
    };
    SecurityControlComponent.prototype.loadSecurityControls = function (data) {
        this.child.hideLoader();
        if (data.length > 0) {
            this.SecurityControlsList = data;
        }
    };
    SecurityControlComponent.prototype.getContactTypeColumns = function () {
        return [
            new column_1.Column('ControlType', 'Control Type'),
            new column_1.Column('Description', 'Description'),
            new column_1.Column('DeleteOnly', ''),
            new column_1.Column('EditOnly', '')
        ];
    };
    SecurityControlComponent.prototype.deleteSecurityControl = function (row) {
        var _this = this;
        var con = confirm("Do you really want to delete it ?");
        if (!con)
            return;
        this.child.showLoader();
        this.httpService.deleteSecurityControls(row.SecurityControlId)
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
    SecurityControlComponent.prototype.editSecurityControl = function (row) {
        this.VisibleForm = true;
        this.model = row;
    };
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], SecurityControlComponent.prototype, "child", void 0);
    SecurityControlComponent = __decorate([
        core_1.Component({
            selector: 'security-Control',
            templateUrl: "../../dev/tpl/security-control.html",
            directives: [forms_1.NgForm, grid_component_1.GridComponent, notifications_component_1.NotificationsComponent],
            providers: [reference_data_service_1.ReferenceDataService, security_control_service_1.SecurityControlService, logging_1.LoggingService,
                core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG })]
        }),
        __param(0, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(1, core_1.Inject(router_deprecated_1.Router)),
        __param(2, core_1.Inject(reference_data_service_1.ReferenceDataService)),
        __param(3, core_1.Inject(security_control_service_1.SecurityControlService)),
        __param(4, core_1.Inject(router_deprecated_1.RouteParams)),
        __param(5, core_1.Inject(logging_1.LoggingService))
    ], SecurityControlComponent);
    return SecurityControlComponent;
}());
exports.SecurityControlComponent = SecurityControlComponent;
//# sourceMappingURL=security-control.component.js.map