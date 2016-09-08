import {Component, EventEmitter, Output,  OnInit, OnChanges, provide} from '@angular/core';
import {City} from './city';
import {CityService} from './city.service';
import {Inject} from '@angular/core';
import {Config, APP_CONFIG, CONFIG} from '../../app-config';

@Component({
    selector: 'data-city',
    templateUrl: '../dev/tpl/city.html',
    inputs: ['stateInput: stateInput', 'cityList:cityList', "cityInput:cityInput"]
    , providers: [provide(APP_CONFIG, { useValue: CONFIG }), CityService]  
})

export class CityComponent implements OnChanges {

    /** --Property Segment--
    * List of the properties.
    **/
    cityService: CityService;
    cities: Array<City>;
    @Output() CitySelectedOutput = new EventEmitter();
    stateInput: string;
    cityList: Array<any>;
    cityInput: string;
    model: CityObject;
    appConfig: Config;
     
       /** --Constructor--
  * _http: Service object injection
  * _appConfig: Config object injection 
  **/
    constructor( @Inject(CityService) _service, @Inject(APP_CONFIG) _appConfig: Config ) {
        this.cityService = _service;
        this.cities = new Array<City>();
        this.model = new CityObject();
        this.appConfig = _appConfig;
    }

    ngOnChanges() {
        if(this.cityList)
            this.cities = this.cityList;
        if (this.cityInput) {
            var city = this.cityInput.toLowerCase()
            this.model.City = this.cityInput;           
        }
    }

     /** --Method Segment--
	* getColumns(): To initialized grid's columns array to be used by the view.
	**/
    onCityChange(sender) {
        this.cityInput = sender.target.value;
        this.CitySelectedOutput.emit(sender.target.value);
    }

    public setData(data) {
        this.cities = data;
    }
}


class CityObject {
    constructor(
        public ZipCode: string = null,
        public  City: string = null,
        public CityType: string= null, 
        public StateAbbr: string= null
    ) {
    }

}

