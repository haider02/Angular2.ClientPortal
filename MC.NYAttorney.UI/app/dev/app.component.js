"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var router_deprecated_1 = require('@angular/router-deprecated');
var main_header_component_1 = require('./common/main-header.component');
var order_entry_component_1 = require('./orderEntry/order-entry.component');
var register_component_1 = require('./register/register.component');
var password_reset_component_1 = require('./passwordReset/password-reset.component');
var change_password_component_1 = require('./changePassword/change-password.component');
var order_detail_component_1 = require('./orderDetail/order-detail.component');
var order_notes_component_1 = require('./OrderNotes/order-notes.component');
var dashboard_component_1 = require('./dashboard/dashboard.component');
var login_component_1 = require('./login/login.component');
var property_detail_component_1 = require('./propertyDetail/property-detail.component');
var order_document_component_1 = require('./orderDocument/order-document.component');
var order_summary_component_1 = require('./orderSummary/order-summary.component');
var account_profile_component_1 = require('./accountProfile/account-profile.component');
var post_close_component_1 = require('./postClose/post-close.component');
var pre_close_component_1 = require('./preClose/pre-close.component');
var order_title_component_1 = require('./orderTitle/order-title.component');
var title_clearance_component_1 = require('./titleClearance/title-clearance.component');
var security_control_component_1 = require('./configuration/securityControl/security-control.component');
var security_form_component_1 = require('./configuration/securityForm/security-form.component');
var security_form_control_component_1 = require('./configuration/securityFormControl/security-form-control.component');
var security_form_control_config_component_1 = require('./configuration/securityFormControlConfig/security-form-control-config.component');
var forgot_password_component_1 = require('./forgotPassword/forgot-password.component');
var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'main-app',
            template: "\n\t<main-header></main-header>\t\n\t<div class=\"content-wrapper\">\n\t\t<router-outlet > </router-outlet>\n\t</div>\n\t",
            directives: [router_deprecated_1.ROUTER_DIRECTIVES,
                main_header_component_1.MainHeaderComponent]
        }),
        router_deprecated_1.RouteConfig([
            { path: '/login', name: 'Login', component: login_component_1.LoginComponent, useAsDefault: true },
            { path: '/dashboard', name: 'DashBoard', component: dashboard_component_1.DashBoardComponent },
            { path: '/register', name: 'Register', component: register_component_1.RegisterComponent },
            { path: '/password-reset', name: 'PasswordReset', component: password_reset_component_1.PasswordResetComponent },
            { path: '/change-password', name: 'ChangePassword', component: change_password_component_1.ChangePasswordComponent },
            { path: '/order-summary', name: 'OrderSummary', component: order_summary_component_1.OrderSummaryComponent },
            { path: '/order-entry', name: 'OrderEntry', component: order_entry_component_1.OrderEntryComponent },
            { path: '/order-detail', name: 'OrderDetail', component: order_detail_component_1.OrderDetailComponent },
            { path: '/order-notes', name: 'Notes', component: order_notes_component_1.NotesComponent },
            { path: '/order-document', name: 'Documents', component: order_document_component_1.OrderDocumentComponent },
            { path: '/property-detail', name: 'PropertyDetail', component: property_detail_component_1.PropertyDetailComponent },
            { path: '/account-profile', name: 'AccountProfile', component: account_profile_component_1.AccountProfileComponent },
            { path: '/post-close', name: 'Close', component: post_close_component_1.PostCloseComponent },
            { path: '/pre-close', name: 'PreClose', component: pre_close_component_1.PreCloseComponent },
            { path: '/order-title', name: 'Title', component: order_title_component_1.OrderTitleComponent },
            { path: '/title-clearance', name: 'Clearance', component: title_clearance_component_1.TitleClearanceComponent },
            { path: '/security-control', name: 'SecurityControl', component: security_control_component_1.SecurityControlComponent },
            { path: '/security-form', name: 'SecurityForm', component: security_form_component_1.SecurityFormComponent },
            { path: '/security-form-control', name: 'SecurityFormControl', component: security_form_control_component_1.SecurityFormControlComponent },
            { path: '/security-form-control-config', name: 'SecurityFormControlConfig', component: security_form_control_config_component_1.SecurityFormControlConfigComponent },
            { path: '/forgot-password', name: 'ForgotPassword', component: forgot_password_component_1.ForgotPasswordComponent }
        ])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map