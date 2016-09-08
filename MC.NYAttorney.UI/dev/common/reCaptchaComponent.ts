import {Component, OnInit, Input, Output, EventEmitter, NgZone, provide, Inject} from '@angular/core';
import {Config, APP_CONFIG, CONFIG} from '../app-config';

@Component({
    selector: 're-captcha',
    template: '<div class="g-recaptcha" [attr.data-sitekey]="site_key" data-callback="verifyCallback" data-expired-callback="verifyExpired" ></div>',
    providers: [ provide(APP_CONFIG, { useValue: CONFIG })]
})

/*Captcha functionality component*/
export class ReCaptchaComponent implements OnInit {
   
    site_key: string = null;    
    public verified: boolean;   
    appConfig: Config;

    constructor( @Inject(APP_CONFIG) _appConfig: Config) {
        
        window['verifyCallback'] = this.recaptchaCallback.bind(this); 
        window['verifyExpired'] = this.recaptchaExpirationCallback.bind(this); 
        this.appConfig = _appConfig;  
        this.site_key = this.appConfig.GoogleRecaptchaSiteKey;
        this.verified = false;
        
    }

    recaptchaCallback(response) {
        this.verified = true;
    }

    recaptchaExpirationCallback() {
        this.verified = false;
    }

    /*Display captcha form/image*/
    showCaptcha() {
        var doc = <HTMLDivElement>document.body;
        var script = document.createElement('script');
        script.innerHTML = '';
        script.src = 'https://www.google.com/recaptcha/api.js';
        script.async = true;
        script.defer = true;
        doc.appendChild(script);
    }

    ngOnInit() {
        this.showCaptcha();
    }
}