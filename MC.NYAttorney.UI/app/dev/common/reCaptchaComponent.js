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
var app_config_1 = require('../app-config');
var ReCaptchaComponent = (function () {
    function ReCaptchaComponent(_appConfig) {
        this.site_key = null;
        window['verifyCallback'] = this.recaptchaCallback.bind(this);
        window['verifyExpired'] = this.recaptchaExpirationCallback.bind(this);
        this.appConfig = _appConfig;
        this.site_key = this.appConfig.GoogleRecaptchaSiteKey;
        this.verified = false;
    }
    ReCaptchaComponent.prototype.recaptchaCallback = function (response) {
        this.verified = true;
    };
    ReCaptchaComponent.prototype.recaptchaExpirationCallback = function () {
        this.verified = false;
    };
    /*Display captcha form/image*/
    ReCaptchaComponent.prototype.showCaptcha = function () {
        var doc = document.body;
        var script = document.createElement('script');
        script.innerHTML = '';
        script.src = 'https://www.google.com/recaptcha/api.js';
        script.async = true;
        script.defer = true;
        doc.appendChild(script);
    };
    ReCaptchaComponent.prototype.ngOnInit = function () {
        this.showCaptcha();
    };
    ReCaptchaComponent = __decorate([
        core_1.Component({
            selector: 're-captcha',
            template: '<div class="g-recaptcha" [attr.data-sitekey]="site_key" data-callback="verifyCallback" data-expired-callback="verifyExpired" ></div>',
            providers: [core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG })]
        }),
        __param(0, core_1.Inject(app_config_1.APP_CONFIG))
    ], ReCaptchaComponent);
    return ReCaptchaComponent;
}());
exports.ReCaptchaComponent = ReCaptchaComponent;
//# sourceMappingURL=reCaptchaComponent.js.map