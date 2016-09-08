import {Component, EventEmitter, Output,  OnInit, OnChanges, provide} from '@angular/core';
import {Http} from '@angular/http'; 
import {County} from './county';
import {CountyService} from './county.service';
import {Inject} from '@angular/core';
import {Config, APP_CONFIG, CONFIG} from '../../app-config';
import {LoggingService} from '../../common/logging';

@Component({
    selector: 'data-county',
    templateUrl: '../dev/tpl/county.html',
    inputs: ['countyInput:countyInput', 'countiesList: countiesList'], 
        providers: [
            CountyService, LoggingService, 
            provide(APP_CONFIG, { useValue: CONFIG })]
   
})

export class CountyComponent implements OnChanges {

     /** --Property Segment--
    * List of the properties.
    **/
    countyService: CountyService;
    counties: Array<County>;
    @Output() CountySelectedOutput = new EventEmitter();
    countiesList: Array<any>;
    countyInput: string;
    model: CountyObject;
    appConfig: Config;
    logService: LoggingService;
    
  /** --Constructor--
  * _http: Service object injection
  * _appConfig: Config object injection 
  **/
    constructor( @Inject(CountyService) _service, @Inject(APP_CONFIG) _appConfig: Config, @Inject(LoggingService) _logservice) {
        this.countyService = _service;
        this.counties = new Array<County>();
        this.model = new CountyObject();
        this.logService = _logservice;
    }      

    ngOnChanges() {     
        this.logService.log(this.countiesList);
        this.counties = this.countiesList;
        if (this.countyInput!== null)
          this.model.CountyName = this.countyInput;     
    }
    
    /** --Method Segment--
	* getColumns(): To initialized grid's columns array to be used by the view.
	**/
    onCountyChange(sender) {
        this.countyInput = sender.target.value;
        this.CountySelectedOutput.emit(sender.target.value);
    }

    public setData(data) {
        this.counties = data;
    }
}

class CountyObject {
    constructor(
       public  StateAbbr: string = null,
       public CountyCode: string = null,
       public  CountyName: string =null
    ) {
    }

}
