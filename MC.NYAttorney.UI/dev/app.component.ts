import {Component, enableProdMode} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {MainHeaderComponent} from './common/main-header.component';
import {OrderEntryComponent} from './orderEntry/order-entry.component';
import {RegisterComponent} from './register/register.component';
import {PasswordResetComponent} from './passwordReset/password-reset.component';
import {ChangePasswordComponent} from './changePassword/change-password.component';
import {OrderDetailComponent} from './orderDetail/order-detail.component';
import {NotesComponent} from './OrderNotes/order-notes.component';
import {DashBoardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';
import {PropertyDetailComponent} from './propertyDetail/property-detail.component';
import {OrderDocumentComponent} from './orderDocument/order-document.component';
import {OrderSummaryComponent} from './orderSummary/order-summary.component';
import {AccountProfileComponent} from './accountProfile/account-profile.component';
import {PostCloseComponent} from './postClose/post-close.component';
import {PreCloseComponent} from './preClose/pre-close.component';
import {OrderTitleComponent} from './orderTitle/order-title.component';
import {TitleClearanceComponent} from './titleClearance/title-clearance.component';
import {SecurityControlComponent} from './configuration/securityControl/security-control.component';
import {SecurityFormComponent} from './configuration/securityForm/security-form.component';
import {SecurityFormControlComponent} from './configuration/securityFormControl/security-form-control.component';
import {SecurityFormControlConfigComponent} from './configuration/securityFormControlConfig/security-form-control-config.component';
import {ForgotPasswordComponent} from './forgotPassword/forgot-password.component'

@Component({
    selector: 'main-app',
    template: `
	<main-header></main-header>	
	<div class="content-wrapper">
		<router-outlet > </router-outlet>
	</div>
	`,
    directives: [ROUTER_DIRECTIVES
        , MainHeaderComponent]
})
@RouteConfig([

        { path: '/login', name: 'Login', component: LoginComponent, useAsDefault: true },
        { path: '/dashboard', name: 'DashBoard', component: DashBoardComponent },
        { path: '/register', name: 'Register', component: RegisterComponent },
		{ path: '/password-reset', name: 'PasswordReset', component: PasswordResetComponent },
        { path: '/change-password', name: 'ChangePassword', component: ChangePasswordComponent },
        { path: '/order-summary', name: 'OrderSummary', component: OrderSummaryComponent },
        { path: '/order-entry', name: 'OrderEntry', component: OrderEntryComponent },
        { path: '/order-detail', name: 'OrderDetail', component: OrderDetailComponent },
        { path: '/order-notes', name: 'Notes', component: NotesComponent },
        { path: '/order-document', name: 'Documents', component: OrderDocumentComponent },        
        { path: '/property-detail', name: 'PropertyDetail', component: PropertyDetailComponent },        
        { path: '/account-profile', name: 'AccountProfile', component: AccountProfileComponent },
        { path: '/post-close', name: 'Close', component: PostCloseComponent },
        { path: '/pre-close', name: 'PreClose', component: PreCloseComponent },
        { path: '/order-title', name: 'Title', component: OrderTitleComponent },
        { path: '/title-clearance', name: 'Clearance', component: TitleClearanceComponent },        
        { path: '/security-control', name: 'SecurityControl', component: SecurityControlComponent },
        { path: '/security-form', name: 'SecurityForm', component: SecurityFormComponent },
        { path: '/security-form-control', name: 'SecurityFormControl', component: SecurityFormControlComponent },
        { path: '/security-form-control-config', name: 'SecurityFormControlConfig', component: SecurityFormControlConfigComponent },
        { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPasswordComponent}


])
export class AppComponent { }
