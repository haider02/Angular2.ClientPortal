import {Component, OnChanges, EventEmitter, Output, OnInit, Inject} from '@angular/core';
import {LoggingService} from '../common/logging';
import {MultiSelectColumn} from './column';

@Component({
    selector: 'multi-select',
    templateUrl: '../dev/tpl/multi-select.html',
    inputs: ['listA', 'columns', 'lstATitle', 'lstBTitle', 'selectedStates'],
    providers: [LoggingService]
})

export class MultiSelectComponent implements OnChanges, OnInit {
    public toggle: boolean;
    logService: LoggingService;
    @Output() sendListData = new EventEmitter();
    @Output() sendDeSelectListData = new EventEmitter();
    constructor(@Inject(LoggingService) _logservice) {
        this.selectedStates = [];
        this.logService = _logservice;
    }  
    public selectedA = [];
    public selectedStates = [];
    public deSelectArray = [];
    public deSelectObject = { colName: "", colValue: "" };
    public listA: Array<any>;
    public lstBSelected: Array<any>;
    public CopylistA: Array<any>;
    public columns: Array<MultiSelectColumn>;    
    public MultiSelectObject: MultiSelectObject;
    public key: string;
    public lstATitle: string;
    public lstBTitle: string;
    public lstASelectAll: boolean = false;
    public lstBSelectAll: boolean = false;
    public lstASelectAllCheckbox: boolean = false;
    public lstBSelectAllCheckbox: boolean = false;

    public selectA(code, isChecked, colName) {
        this.key = colName;
        
        if (isChecked == true) {
            var selectedObject = this.getObjects(this.listA, this.columns[0].code, code);
            this.selectedA.push(selectedObject[0]);                        
        } else {            
            this.findAndRemove(this.selectedA, colName, code);            
        }        
    }

    ngOnInit() {
        //if (this.lstBSelected.length > 0) {            
        //    this.selectedStates = this.lstBSelected;
        //}
        this.logService.log("List A Constructor");
        this.logService.log(this.listA)
    }

    
    ngOnChanges() {
        
    }

    selectAllListA(check) {
        this.lstASelectAll = check;        
    }

    deSelectAllListA(check) {
        this.lstBSelectAll = check;       
        //for (var index in this.selectedStates) {
        //    for (var index2 in this.columns) {
        //        var codeValue = this.selectedStates[index][this.columns[index2]["code"]];
        //        var codeColumn = this.columns[index2]["code"];                
        //        this.deSelectB(codeValue, check, codeColumn);
        //    }
        //}
    }
    selectListA() {        
        //
        if (this.lstASelectAll) {
            this.lstASelectAll = false;
            this.selectedStates = this.listA;
            this.listA = [];
        }
        else {

            if (!this.selectedStates) this.selectedStates = [];

            if (this.selectedA.length > 0) {

                for (var index in this.selectedA) {
                    var obj = this.selectedA[index];
                    this.selectedStates.push(obj);
                    this.findAndRemove(this.listA, this.key, obj[this.key]);
                }
                this.selectedA = [];

                
            }
        }
        this.SendListAData(this.selectedStates);
    }

    deSelectB(code, isChecked, colName) {
        if (isChecked) {
            this.MultiSelectObject = new MultiSelectObject();

            this.MultiSelectObject.colName = colName;
            this.MultiSelectObject.colValue = code;            
            this.deSelectArray.push(this.MultiSelectObject);
            
        } else {
            //this.logService.log("Before");
            //this.logService.log(this.deSelectArray);
            //this.findAndRemove(this.deSelectArray, colName, code);
            //this.logService.log("After");
            //this.logService.log(this.deSelectArray);
        }

        
    }

    deSelectListB() {
      
        this.lstBSelectAllCheckbox = false;
        var deselectArray = [];
        
        if (this.lstBSelectAll) {
            this.lstBSelectAll = false;

            if (this.selectedStates.length > 0) {
                for (var index in this.selectedStates) {
                    this.listA.push(this.selectedStates[index]);
                    deselectArray.push(this.selectedStates[index]);
                }
                this.selectedStates = [];
            }
        }
        else {
            for (var index in this.deSelectArray) {
                var deSelectedObject = this.getObjects(this.selectedStates, this.deSelectArray[index].colName, this.deSelectArray[index].colValue);
                this.listA.push(deSelectedObject[0]);
                deselectArray.push(deSelectedObject[0]);
                this.findAndRemove(this.selectedStates, this.deSelectArray[index].colName, this.deSelectArray[index].colValue);
            }

            this.deSelectArray = [];
        }
        this.sendDeSelectListData.emit(deselectArray);
    }  

    SendListAData(stateCodeArray) {        
        this.sendListData.emit(stateCodeArray);
    }

    public toggleA(test) {
        if (this.selectedA.length > 0) {
            this.selectedA = [];
            for (var i = 0; i < this.listA.length; i++) { 
                this.listA[i].ischecked = false;
            }
           
        }
        else {
            for (var i = 0; i < this.listA.length;i++) {
                this.selectedA.push(this.listA[i]);
                this.listA[i].ischecked = true;
            }            
        }
    }


    getObjects(obj, key, val) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(this.getObjects(obj[i], key, val));
            } else if (i == key && obj[key] == val) {
                objects.push(obj);
            }
        }
        return objects;
    }

    findAndRemove(array, property, value) {
        array.forEach(function (result, index) {
            if (result[property] === value) {
                //Remove from array
                array.splice(index, 1);
            }
        });
    }

    
}

class MultiSelectObject {
    constructor(
        public colName: string = null,
        public colValue: string = null
    ) { }
}