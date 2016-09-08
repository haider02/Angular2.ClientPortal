import {Component, OnInit, Inject, provide, ViewChild, AfterViewInit} from '@angular/core';
import {Router, RouteParams} from '@angular/router-deprecated';
import {AccountProfile} from './account-profile.model';
import {Http} from '@angular/http';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {AccountProfileService} from './account-profile.service';
import {Utility} from '../common/utility';
import {ClientStorage} from '../common/ClientStorage';
import {ChangePasswordComponent} from '../changePassword/change-password.component';
import {LoggingService} from '../common/logging';
import {ClientStorageConstants} from '../common/constants';
@Component({
    selector : 'ac-profile',
    templateUrl: '../dev/tpl/account-profile.html',
    directives: [ChangePasswordComponent],
    providers: [provide(APP_CONFIG, { useValue: CONFIG }), AccountProfileService, LoggingService]
})
export class AccountProfileComponent implements AfterViewInit {
    @ViewChild(ChangePasswordComponent) child: ChangePasswordComponent;
    routeParams: RouteParams;
    router: Router;
    logService: LoggingService;
    model = new AccountProfile();
    httpService: AccountProfileService;
    fullAddress: string = "";
    contactId: string = "";    
    utility = new Utility();

    constructor( @Inject(AccountProfileService) _orderService, @Inject(Router) _router, @Inject(LoggingService) _logservice) {
        this.httpService = _orderService;
        this.router = _router;
        this.logService = _logservice;
    }

    ngAfterViewInit() {
        this.contactId = ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_user_ContactId);         
         this.getUserDetail();
    }
   
  getUserDetail()
  {
      this.httpService.getAccountDetails(this.contactId)
          .subscribe(
          data => this.loadUserData(data),
          error => this.logService.log(error + ": error while fetching user details"),
          () => this.logService.log("user detials loaded Successfully!")
          );
  }

  loadUserData(data)
  {
      if (data.length > 0) {
          this.model.Name = data[0].Name;
          this.model.Line1 = data[0].Line1;
          this.model.Line2 = data[0].Line2;
          this.model.city = data[0].city;
          this.model.State = data[0].State;
          this.model.Zip = data[0].Zip;
          this.model.MainContact = data[0].MainContact;
          this.model.FullName = data[0].FullName;
          this.model.Email = data[0].Email;
          this.model.MyRole = data[0].MyRole;
          this.model.Contact = data[0].Contact;

          this.fullAddress = this.model.Line1 + " " + this.model.Line2 + " " + this.model.city + " " + this.model.State + " ," + this.model.Zip;
          this.child.SetUserData(this.model.Email, true, this.contactId);
      }
  }
 
   
}

