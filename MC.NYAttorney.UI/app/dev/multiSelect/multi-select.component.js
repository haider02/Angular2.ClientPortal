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
var logging_1 = require('../common/logging');
var MultiSelectComponent = (function () {
    function MultiSelectComponent(_logservice) {
        this.sendListData = new core_1.EventEmitter();
        this.sendDeSelectListData = new core_1.EventEmitter();
        this.selectedA = [];
        this.selectedStates = [];
        this.deSelectArray = [];
        this.deSelectObject = { colName: "", colValue: "" };
        this.lstASelectAll = false;
        this.lstBSelectAll = false;
        this.lstASelectAllCheckbox = false;
        this.lstBSelectAllCheckbox = false;
        this.selectedStates = [];
        this.logService = _logservice;
    }
    MultiSelectComponent.prototype.selectA = function (code, isChecked, colName) {
        this.key = colName;
        if (isChecked == true) {
            var selectedObject = this.getObjects(this.listA, this.columns[0].code, code);
            this.selectedA.push(selectedObject[0]);
        }
        else {
            this.findAndRemove(this.selectedA, colName, code);
        }
    };
    MultiSelectComponent.prototype.ngOnInit = function () {
        //if (this.lstBSelected.length > 0) {            
        //    this.selectedStates = this.lstBSelected;
        //}
        this.logService.log("List A Constructor");
        this.logService.log(this.listA);
    };
    MultiSelectComponent.prototype.ngOnChanges = function () {
    };
    MultiSelectComponent.prototype.selectAllListA = function (check) {
        this.lstASelectAll = check;
    };
    MultiSelectComponent.prototype.deSelectAllListA = function (check) {
        this.lstBSelectAll = check;
        //for (var index in this.selectedStates) {
        //    for (var index2 in this.columns) {
        //        var codeValue = this.selectedStates[index][this.columns[index2]["code"]];
        //        var codeColumn = this.columns[index2]["code"];                
        //        this.deSelectB(codeValue, check, codeColumn);
        //    }
        //}
    };
    MultiSelectComponent.prototype.selectListA = function () {
        //
        if (this.lstASelectAll) {
            this.lstASelectAll = false;
            this.selectedStates = this.listA;
            this.listA = [];
        }
        else {
            if (!this.selectedStates)
                this.selectedStates = [];
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
    };
    MultiSelectComponent.prototype.deSelectB = function (code, isChecked, colName) {
        if (isChecked) {
            this.MultiSelectObject = new MultiSelectObject();
            this.MultiSelectObject.colName = colName;
            this.MultiSelectObject.colValue = code;
            this.deSelectArray.push(this.MultiSelectObject);
        }
        else {
        }
    };
    MultiSelectComponent.prototype.deSelectListB = function () {
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
    };
    MultiSelectComponent.prototype.SendListAData = function (stateCodeArray) {
        this.sendListData.emit(stateCodeArray);
    };
    MultiSelectComponent.prototype.toggleA = function (test) {
        if (this.selectedA.length > 0) {
            this.selectedA = [];
            for (var i = 0; i < this.listA.length; i++) {
                this.listA[i].ischecked = false;
            }
        }
        else {
            for (var i = 0; i < this.listA.length; i++) {
                this.selectedA.push(this.listA[i]);
                this.listA[i].ischecked = true;
            }
        }
    };
    MultiSelectComponent.prototype.getObjects = function (obj, key, val) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i))
                continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(this.getObjects(obj[i], key, val));
            }
            else if (i == key && obj[key] == val) {
                objects.push(obj);
            }
        }
        return objects;
    };
    MultiSelectComponent.prototype.findAndRemove = function (array, property, value) {
        array.forEach(function (result, index) {
            if (result[property] === value) {
                //Remove from array
                array.splice(index, 1);
            }
        });
    };
    __decorate([
        core_1.Output()
    ], MultiSelectComponent.prototype, "sendListData", void 0);
    __decorate([
        core_1.Output()
    ], MultiSelectComponent.prototype, "sendDeSelectListData", void 0);
    MultiSelectComponent = __decorate([
        core_1.Component({
            selector: 'multi-select',
            templateUrl: '../dev/tpl/multi-select.html',
            inputs: ['listA', 'columns', 'lstATitle', 'lstBTitle', 'selectedStates'],
            providers: [logging_1.LoggingService]
        }),
        __param(0, core_1.Inject(logging_1.LoggingService))
    ], MultiSelectComponent);
    return MultiSelectComponent;
}());
exports.MultiSelectComponent = MultiSelectComponent;
var MultiSelectObject = (function () {
    function MultiSelectObject(colName, colValue) {
        if (colName === void 0) { colName = null; }
        if (colValue === void 0) { colValue = null; }
        this.colName = colName;
        this.colValue = colValue;
    }
    return MultiSelectObject;
}());
//# sourceMappingURL=multi-select.component.js.map