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
var security_form_control_service_1 = require('../securityFormControl/security-form-control.service');
var security_form_control_config_service_1 = require('./security-form-control-config.service');
var notifications_component_1 = require('../../notifications/notifications.component');
var security_form_control_config_model_1 = require('./security-form-control-config.model');
var logging_1 = require('../../common/logging');
core_1.enableProdMode();
var SecurityFormControlConfigComponent = (function () {
    function SecurityFormControlConfigComponent(_appConfig, _router, _refService, _securityFormService, _securityFormControlConfigService, _securityControlService, _securityFormControlService, _routeParams, _logservice) {
        this.SecurityFormControlConfigList = new Array();
        this.SecurityControlList = new Array();
        this.SecurityFormList = new Array();
        this.SecurityFormControlList = new Array();
        this.model = new security_form_control_config_model_1.SecurityFormControlConfigModel();
        this.utility = new utility_1.Utility();
        this.VisibleForm = false;
        this.applicationId = 1;
        this.AllSecurityFormControlConfigList = new Array();
        this.WebRolesList = new Array();
        this.isRoleEnable = true;
        this.isFormEnable = true;
        this.isAddMode = true;
        this.appConfig = _appConfig;
        this._refernceService = _refService;
        this.securityControlService = _securityControlService;
        this.securityFormService = _securityFormService;
        this.seurityFormControlConfigService = _securityFormControlConfigService;
        this.securityFormControlService = _securityFormControlService;
        this.logService = _logservice;
    }
    SecurityFormControlConfigComponent.prototype.getCurrentUserID = function () {
        var contactId = this.utility.getContactId(); //CustomLocalStorage.getItem("user_ContactId");
        if (contactId !== null)
            return contactId;
        return null;
    };
    SecurityFormControlConfigComponent.prototype.onSave = function () {
        var _this = this;
        this.model.CreatedBy = this.getCurrentUserID();
        this.model.LastModBy = this.getCurrentUserID();
        this.model.Inactive = false;
        this.seurityFormControlConfigService.saveSecurityFormControlsConfig(this.model)
            .subscribe(function (data) { return _this.saveHandler(data); }, function (error) {
            _this.child.showSaveErrorNotification();
            _this.child.hideLoader();
        }, function () { return _this.logService.log("API Call Finished Successfully!"); });
    };
    SecurityFormControlConfigComponent.prototype.saveHandler = function (data) {
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
    };
    SecurityFormControlConfigComponent.prototype.displayForm = function () {
        this.isRoleEnable = false;
        this.isFormEnable = false;
        this.VisibleForm = true;
        this.getSecurityControls();
        this.getSecurityFormControls();
    };
    SecurityFormControlConfigComponent.prototype.ngAfterViewInit = function () {
        this.SecurityFormControlConfigColumns = this.getSecurityFormControlColumns();
        this.getWebRoles();
        this.getSecurityForms();
    };
    SecurityFormControlConfigComponent.prototype.reset = function () {
        this.VisibleForm = false;
        this.isRoleEnable = true;
        this.isFormEnable = true;
        this.isAddMode = true;
    };
    SecurityFormControlConfigComponent.prototype.getSecurityControls = function () {
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
    SecurityFormControlConfigComponent.prototype.loadSecurityControls = function (data) {
        this.child.hideLoader();
        if (data.length > 0) {
            this.SecurityControlList = data;
        }
    };
    SecurityFormControlConfigComponent.prototype.getSecurityFormControls = function () {
        var _this = this;
        this.child.showLoader();
        this.securityFormControlService.getAllSecurityFormControls(this.applicationId)
            .subscribe(function (data) {
            _this.loadSecurityControlsForm(data);
        }, function (error) {
            _this.child.hideLoader();
            _this.errorHandler(error);
        });
    };
    SecurityFormControlConfigComponent.prototype.loadSecurityControlsForm = function (data) {
        var _this = this;
        this.child.hideLoader();
        if (data.length > 0) {
            this.SecurityFormControlList = data;
            this.SecurityFormControlList = this.SecurityFormControlList.filter(function (x) { return x.SecurityFormId == _this.model.SecurityFormId; });
        }
    };
    SecurityFormControlConfigComponent.prototype.getSecurityForms = function () {
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
    SecurityFormControlConfigComponent.prototype.loadSecurityForm = function (data) {
        this.child.hideLoader();
        if (data.length > 0) {
            this.SecurityFormList = data;
        }
    };
    SecurityFormControlConfigComponent.prototype.getSecurityFormControlsConfig = function (applicationId) {
        var _this = this;
        this.child.showLoader();
        this.seurityFormControlConfigService.getAllSecurityFormControlsConfig(applicationId)
            .subscribe(function (data) {
            _this.loadSecurityFormControls(data);
        }, function (error) { return _this.errorHandler(error); });
    };
    SecurityFormControlConfigComponent.prototype.errorHandler = function (err) {
        this.child.hideLoader();
        this.logService.log(err);
    };
    SecurityFormControlConfigComponent.prototype.loadSecurityFormControls = function (data) {
        var _this = this;
        this.child.hideLoader();
        if (data.length > 0) {
            this.SecurityFormControlConfigList = data;
            this.AllSecurityFormControlConfigList = data.slice(0);
            this.SecurityFormControlConfigList = this.AllSecurityFormControlConfigList.filter(function (x) { return x.SecurityFormId == _this.model.SecurityFormId &&
                x.RoleId == _this.model.RoleId; });
        }
    };
    SecurityFormControlConfigComponent.prototype.getSecurityFormControlColumns = function () {
        return [
            new column_1.Column('SecurityFormName', 'Screen Name'),
            new column_1.Column('SecyrityControlType', 'Screen Controls'),
            new column_1.Column('SecurityFormControlName', 'Security Form Controls'),
            new column_1.Column('IsVisible', 'Visible'),
            new column_1.Column('IsEnabled', 'Enabled'),
            new column_1.Column('DeleteOnly', ''),
            new column_1.Column('EditOnly', '')
        ];
    };
    SecurityFormControlConfigComponent.prototype.deleteSecurityFormControlConfig = function (row) {
        var _this = this;
        var con = confirm("Do you really want to delete it ?");
        if (!con)
            return;
        this.child.showLoader();
        this.seurityFormControlConfigService.deleteSecurityFormControlConfig(row.SecurityFormControlConfigId)
            .subscribe(function (data) {
            _this.child.showSuccessNotification("Deleted Successfully", "Success !");
            _this.child.hideLoader();
            _this.getSecurityFormControlsConfig(_this.applicationId);
        }, function (error) {
            _this.child.showErrorNotification("Error Occurred While Deleting", "Error !");
            _this.child.hideLoader();
        }, function () { return _this.logService.log("API Call Finished Successfully!"); });
    };
    SecurityFormControlConfigComponent.prototype.editSecurityFormControlConfig = function (row) {
        this.isAddMode = false;
        this.displayForm();
        this.model = row;
    };
    SecurityFormControlConfigComponent.prototype.VisibleChange = function (check) {
        this.model.IsVisible = check;
    };
    SecurityFormControlConfigComponent.prototype.EnabledChange = function (check) {
        this.model.IsEnabled = check;
    };
    SecurityFormControlConfigComponent.prototype.onSearch = function () {
        this.getSecurityFormControlsConfig(this.applicationId);
    };
    SecurityFormControlConfigComponent.prototype.onChangeRole = function (sender) {
        this.model.RoleId = sender.target.value;
        this.SecurityFormControlConfigList = [];
        this.VisibleForm = false;
    };
    SecurityFormControlConfigComponent.prototype.onChangeForm = function (sender) {
        var _this = this;
        this.model.SecurityFormId = sender.target.value;
        this.SecurityFormControlConfigList = [];
        this.VisibleForm = false;
        this.SecurityFormControlList = this.SecurityFormControlList.filter(function (x) { return x.SecurityFormId == _this.model.SecurityFormId; });
    };
    SecurityFormControlConfigComponent.prototype.getWebRoles = function () {
        var _this = this;
        this.seurityFormControlConfigService.getAllWebRoles("C", "C")
            .subscribe(function (data) {
            _this.loadWebRoles(data);
        }, function (error) {
            _this.child.hideLoader();
            _this.errorHandler(error);
        });
    };
    SecurityFormControlConfigComponent.prototype.loadWebRoles = function (data) {
        if (data.length > 0) {
            this.WebRolesList = data;
        }
    };
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], SecurityFormControlConfigComponent.prototype, "child", void 0);
    SecurityFormControlConfigComponent = __decorate([
        core_1.Component({
            selector: 'security-Control',
            templateUrl: "../../dev/tpl/security-control-form-config.html",
            directives: [forms_1.NgForm, grid_component_1.GridComponent, notifications_component_1.NotificationsComponent],
            providers: [reference_data_service_1.ReferenceDataService, security_form_service_1.SecurityFormService,
                security_control_service_1.SecurityControlService,
                security_form_control_config_service_1.SecurityFormControlServiceConfig,
                security_form_control_service_1.SecurityFormControlService,
                logging_1.LoggingService,
                core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG })]
        }),
        __param(0, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(1, core_1.Inject(router_deprecated_1.Router)),
        __param(2, core_1.Inject(reference_data_service_1.ReferenceDataService)),
        __param(3, core_1.Inject(security_form_service_1.SecurityFormService)),
        __param(4, core_1.Inject(security_form_control_config_service_1.SecurityFormControlServiceConfig)),
        __param(5, core_1.Inject(security_control_service_1.SecurityControlService)),
        __param(6, core_1.Inject(security_form_control_service_1.SecurityFormControlService)),
        __param(7, core_1.Inject(router_deprecated_1.RouteParams)),
        __param(8, core_1.Inject(logging_1.LoggingService))
    ], SecurityFormControlConfigComponent);
    return SecurityFormControlConfigComponent;
}());
exports.SecurityFormControlConfigComponent = SecurityFormControlConfigComponent;
//# sourceMappingURL=security-form-control-config.component.js.map