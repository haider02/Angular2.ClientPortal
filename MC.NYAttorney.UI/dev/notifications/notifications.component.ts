import {Component, OnInit, Input, Inject, provide, OnChanges} from '@angular/core';

@Component({
    selector: 'notification-msg',
    templateUrl: '../dev/tpl/notifications.html'
})
export class NotificationsComponent implements OnChanges {
    @Input() helperModel: any = {};
    ngOnChanges() {
        //setTimeout(d=> { this.helperModel.helperEnum=0 },3000);
    }

    showSuccessNotification(msg: string, title: string) {
        this.helperModel.msgTitle = title;
        this.helperModel.msgDesc = msg;
        this.helperModel.helperEnum = 4;
        this.hideNotification();
    }
    showErrorNotification(msg: string, title: string) {
        this.helperModel.msgTitle = title;
        this.helperModel.msgDesc = msg;
        this.helperModel.helperEnum = 2;
        this.hideNotification();
    }
    showWarningNotification(msg: string, title: string) {
        this.helperModel.msgTitle = title;
        this.helperModel.msgDesc = msg;
        this.helperModel.helperEnum = 3;
        this.hideNotification();
    }
    showInfoNotification(msg: string, title: string) {
        this.helperModel.msgTitle = title;
        this.helperModel.msgDesc = msg;
        this.helperModel.helperEnum = 1;
        this.hideNotification();
    }
    showSaveSuccessNotification() {
        this.helperModel.msgTitle = 'Success';
        this.helperModel.msgDesc = 'Data saved successfully.';
        this.helperModel.helperEnum = 4;
        this.hideNotification();
    }
    showDeleteNotification() {
        this.helperModel.msgTitle = 'Success !';
        this.helperModel.msgDesc = 'Record has been deleted.';
        this.helperModel.helperEnum = 4;
        this.hideNotification();
    }
    showSaveErrorNotification() {
        this.helperModel.msgTitle = 'Failure!';
        this.helperModel.msgDesc = 'Data save failed, please try again.';
        this.helperModel.helperEnum = 2;
        this.hideNotification();
    }

    showSessionTimeoutNotification(msg: string, title: string) {
        this.helperModel.msgTitle = title;
        this.helperModel.msgDesc = msg;
        this.helperModel.helperEnum = 5;
        setTimeout(d => { this.helperModel.helperEnum = 0 }, 900);
    }

    hideNotification() {
        setTimeout(d => { this.helperModel.helperEnum = 0 }, 5000);
    }
    showLoader() {
        this.helperModel.showLoader = true;
    }
    hideLoader() {
        this.helperModel.showLoader = false;
    }
}
