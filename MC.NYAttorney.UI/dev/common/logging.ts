import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {Component, OnInit, Inject, Injectable, provide} from '@angular/core';

@Injectable()
export class LoggingService {
    appConfig: Config;
    
    constructor(  @Inject(APP_CONFIG) _appConfig: Config) {        
        this.appConfig = _appConfig;        
    }

    public log(log: any) {
        this.consoleLog(log);
    }

    consoleLog(log: string) {
        if (this.appConfig.devLogging) {
            console.log(log);
        }
    }
}