import {Component, EventEmitter, Output, Input,  OnInit, OnChanges, provide} from '@angular/core';
import {Http} from '@angular/http'; 
import {State} from './states';
import {StateService} from './state.service';
import {CityService} from '../city/city.service';
import {Inject} from '@angular/core';
import {CountyService} from '../county/county.service';
import {Config, APP_CONFIG, CONFIG} from '../../app-config';
import {LoggingService} from '../../common/logging';

@Component({
    selector: 'data-state',
    templateUrl: '../dev/tpl/state.html',
    inputs: ['stateInput: stateInput', 'zip:zip', 'model:model'], 
    providers: [
        CountyService, CityService, StateService, LoggingService, 
        provide(APP_CONFIG, { useValue: CONFIG })]
})

export class StateComponent implements OnInit, OnChanges{

    /** --Property Segment--
    * List of the properties.
    **/
    stateService: StateService;
    cityService: CityService;
    countyService: CountyService;
    states: Array<State>;
    @Output() StateSelectedOutput = new EventEmitter();
    @Output() CityList = new EventEmitter();
    @Output() CountyList = new EventEmitter();
    zip: any;
    model: StateObject;
    stateInput: string;
    appConfig: Config;
    logService: LoggingService;
    //#endregion 


     /** --Constructor--
  * _http: Service object injection
  * _appConfig: Config object injection 
  **/
    constructor( @Inject(StateService) _service, @Inject(CityService) _cityService, @Inject(CountyService) _countyService, @Inject(APP_CONFIG) _appConfig: Config, @Inject(LoggingService) _logservice) {
        this.stateService = _service;
        this.cityService = _cityService;
        this.countyService = _countyService;
        this.logService = _logservice;        
    }      

    ngOnInit() {
        this.stateService.getState()
            .subscribe(
            data => this.setData(data),
            error => this.logError(error),
            () => this.logService.log("API Call Finished Successfully!")
            );
    }

   ngOnChanges() {      
       this.model.StateAbbr = this.stateInput;
       if (this.stateInput !== null && this.stateInput !== undefined) {
           this.cityService.getCitybyState(this.stateInput)
               .subscribe(
               data => this.getCitybyState(data),
               error =>this.logError(error),
               () => this.logService.log("API Call Finished Successfully!")
           );
       }
       
       if (this.stateInput !== null && this.stateInput !== undefined) {
           this.countyService.getCountyByState(this.stateInput)
               .subscribe(
               data => this.getCountybyState(data),
               error =>this.logError(error),
               () => this.logService.log("API Call Finished Successfully!")
               );
       }
    }
      
   logError(err) {
       this.logService.log('There was an error: ' + err);      
   }

   logCityError(err) {
       this.logService.log('There was an error: ' + err);
       this.CityList.emit([]);
   }
    
   logCountyError(err) {
       this.logService.log('There was an error: ' + err);
       this.CountyList.emit([]);
   }
    
    /** --Method Segment--
	*
	**/
    public setData(data) {        
        this.states = data;       
    }

    public getCitybyState(data) {
        
        this.CityList.emit(data);
    }


    public getCountybyState(data) {
        this.CountyList.emit(data);
    }
    
    onStateChange(sender) {
        this.model.StateAbbr = sender.target.value;
        this.StateSelectedOutput.emit(sender.target.value);

        this.cityService.getCitybyState(sender.target.value)
            .subscribe(
            data => this.getCitybyState(data),
            error => this.logCityError(error),
            () => this.logService.log("API Call Finished Successfully!")
        );

        this.countyService.getCountyByState(sender.target.value)
            .subscribe(
            data => this.getCountybyState(data),
            error => this.logCountyError(error),
            () => this.logService.log("API Call Finished Successfully!")
            );

    }
}


class StateObject {
    constructor(
        public StateCode: string = null,
        public StateAbbr: string = null,
        public StateName: string = null
    ) { }
}