"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var NotificationsComponent = (function () {
    function NotificationsComponent() {
        this.helperModel = {};
    }
    NotificationsComponent.prototype.ngOnChanges = function () {
        //setTimeout(d=> { this.helperModel.helperEnum=0 },3000);
    };
    NotificationsComponent.prototype.showSuccessNotification = function (msg, title) {
        this.helperModel.msgTitle = title;
        this.helperModel.msgDesc = msg;
        this.helperModel.helperEnum = 4;
        this.hideNotification();
    };
    NotificationsComponent.prototype.showErrorNotification = function (msg, title) {
        this.helperModel.msgTitle = title;
        this.helperModel.msgDesc = msg;
        this.helperModel.helperEnum = 2;
        this.hideNotification();
    };
    NotificationsComponent.prototype.showWarningNotification = function (msg, title) {
        this.helperModel.msgTitle = title;
        this.helperModel.msgDesc = msg;
        this.helperModel.helperEnum = 3;
        this.hideNotification();
    };
    NotificationsComponent.prototype.showInfoNotification = function (msg, title) {
        this.helperModel.msgTitle = title;
        this.helperModel.msgDesc = msg;
        this.helperModel.helperEnum = 1;
        this.hideNotification();
    };
    NotificationsComponent.prototype.showSaveSuccessNotification = function () {
        this.helperModel.msgTitle = 'Success';
        this.helperModel.msgDesc = 'Data saved successfully.';
        this.helperModel.helperEnum = 4;
        this.hideNotification();
    };
    NotificationsComponent.prototype.showDeleteNotification = function () {
        this.helperModel.msgTitle = 'Success !';
        this.helperModel.msgDesc = 'Record has been deleted.';
        this.helperModel.helperEnum = 4;
        this.hideNotification();
    };
    NotificationsComponent.prototype.showSaveErrorNotification = function () {
        this.helperModel.msgTitle = 'Failure!';
        this.helperModel.msgDesc = 'Data save failed, please try again.';
        this.helperModel.helperEnum = 2;
        this.hideNotification();
    };
    NotificationsComponent.prototype.showSessionTimeoutNotification = function (msg, title) {
        var _this = this;
        this.helperModel.msgTitle = title;
        this.helperModel.msgDesc = msg;
        this.helperModel.helperEnum = 5;
        setTimeout(function (d) { _this.helperModel.helperEnum = 0; }, 900);
    };
    NotificationsComponent.prototype.hideNotification = function () {
        var _this = this;
        setTimeout(function (d) { _this.helperModel.helperEnum = 0; }, 5000);
    };
    NotificationsComponent.prototype.showLoader = function () {
        this.helperModel.showLoader = true;
    };
    NotificationsComponent.prototype.hideLoader = function () {
        this.helperModel.showLoader = false;
    };
    __decorate([
        core_1.Input()
    ], NotificationsComponent.prototype, "helperModel", void 0);
    NotificationsComponent = __decorate([
        core_1.Component({
            selector: 'notification-msg',
            templateUrl: '../dev/tpl/notifications.html'
        })
    ], NotificationsComponent);
    return NotificationsComponent;
}());
exports.NotificationsComponent = NotificationsComponent;
//# sourceMappingURL=notifications.component.js.map