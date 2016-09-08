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
var app_config_1 = require('../app-config');
var forms_1 = require('@angular/forms');
var notifications_component_1 = require('../notifications/notifications.component');
var logging_1 = require('../common/logging');
var register_model_1 = require('./register.model');
var register_service_1 = require('./register.service');
//declare var moment: any;
//declare var jQuery;
core_1.enableProdMode();
var RegisterComponent = (function () {
    function RegisterComponent(_appConfig, _router, _routeParams, _service, _logservice) {
        this.active = true;
        this.model = new register_model_1.RegisterDetail();
        this.appConfig = _appConfig;
        this.router = _router;
        this.routeParams = _routeParams;
        this.logService = _logservice;
        this.httpService = _service;
    }
    RegisterComponent.prototype.onRegister = function () {
        var _this = this;
        this.child.showLoader();
        this.fillEmailMessage();
        this.httpService.registerClient(this.model)
            .subscribe(function (data) { return _this.saveHandler(data); }, function (error) { return _this.errorHandler(error); }, function () { return _this.logService.log("Client Registered Successfully!"); });
        this.successMessageDisplay = true;
    };
    RegisterComponent.prototype.saveHandler = function (data) {
        var _this = this;
        this.model = data;
        this.child.hideLoader();
        if (this.model.ResponseMessage !== "") {
            this.child.showErrorNotification('We could not create an account for you. Please contact Mortgage Connect for assistance', 'Error!');
            return;
        }
        this.child.showSuccessNotification('Your account is being created. You will receive an email shortly to register the account.', 'Success!');
        this.active = false;
        setTimeout(function () { _this.active = true; _this.model = new register_model_1.RegisterDetail(); }, 0);
    };
    RegisterComponent.prototype.fillEmailMessage = function () {
        this.model.PasswordResetUrl = "https://www.mortgageconnectlp.com/clientservices/PasswordReset.aspx";
        var body = this.appConfig.RegisterEmailBody;
        body = body.replace(/PasswordResetTokenValidHours/g, this.appConfig.PasswordResetTokenValidHours.toString());
        body = body.replace(/PasswordResetUrl/g, this.model.PasswordResetUrl);
        this.model.EmailObject.From = this.appConfig.DefaultFromEmailAddress;
        this.model.EmailObject.To = this.model.Email;
        this.model.EmailObject.Subject = this.appConfig.RegisterEmailSubject;
        this.model.EmailObject.Body = body;
    };
    RegisterComponent.prototype.errorHandler = function (data) {
        this.child.showErrorNotification(data, 'Error!');
        this.child.hideLoader();
    };
    RegisterComponent.prototype.routetoLogin = function () {
        this.router.navigate(['Login']);
    };
    __decorate([
        core_1.ViewChild(notifications_component_1.NotificationsComponent)
    ], RegisterComponent.prototype, "child", void 0);
    RegisterComponent = __decorate([
        core_1.Component({
            selector: 'registerUser',
            templateUrl: '../dev/tpl/registerUser.html',
            directives: [forms_1.NgForm, notifications_component_1.NotificationsComponent],
            providers: [core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }),
                register_service_1.RegisterService, logging_1.LoggingService
            ]
        }),
        __param(0, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(1, core_1.Inject(router_deprecated_1.Router)),
        __param(2, core_1.Inject(router_deprecated_1.RouteParams)),
        __param(3, core_1.Inject(register_service_1.RegisterService)),
        __param(4, core_1.Inject(logging_1.LoggingService))
    ], RegisterComponent);
    return RegisterComponent;
}());
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=register.component.js.map