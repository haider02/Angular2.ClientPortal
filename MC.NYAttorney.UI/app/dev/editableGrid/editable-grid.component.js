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
var router_deprecated_1 = require('@angular/router-deprecated');
var app_config_1 = require('../app-config');
var logging_1 = require('../common/logging');
var sorter_1 = require('./sorter');
var GridComponent = (function () {
    /** --Constructor--
    * _http: Service object injection
    * _appConfig: Config object injection
    **/
    function GridComponent(_router, _appConfig, _logservice) {
        this.deleteSelectedRow = new core_1.EventEmitter();
        this.sorter = new sorter_1.Sorter();
        this.onFirstTime = true;
        this.router = _router;
        this.appConfig = _appConfig;
        this.dirtyRows = [];
        this.logService = _logservice;
    }
    GridComponent.prototype.sort = function (key) {
        this.sorter.sort(key, this.rows);
    };
    //#endregion 
    GridComponent.prototype.ngAfterViewInit = function () {
    };
    GridComponent.prototype.ngOnChanges = function () {
        if (this.rows) {
            this.rowsCopy = this.rows;
            this.pageNumber = 1;
            this.pageSize = this.appConfig.pageSize;
            this.totalRows = this.rowsCopy.length;
            this.rowsTemp = [];
            this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
            this.rows = this.rowsTemp;
            this.currentRowsCount = this.rowsTemp.length;
            this.onFirstTime = false;
            var totalPages = (this.totalRows + this.pageSize - 1) / this.pageSize;
            this.totalPages = parseInt(totalPages.toString());
        }
        if (this.rows)
            this.logService.log(this.rows);
    };
    GridComponent.prototype.ngAfterContentInit = function () {
    };
    GridComponent.prototype.ngOnInit = function () {
        if (typeof this.defaultSort !== "undefined") {
            var sorter = new sorter_1.Sorter();
        }
    };
    GridComponent.prototype.Next = function () {
        this.pageNumber += 1;
        this.rowsTemp = [];
        this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
        this.currentRowsCount = this.rowsTemp.length;
        this.rows = this.rowsTemp;
    };
    GridComponent.prototype.Previous = function () {
        this.pageNumber -= 1;
        this.rowsTemp = [];
        this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
        this.currentRowsCount = this.rowsTemp.length;
        this.rows = this.rowsTemp;
    };
    GridComponent.prototype.First = function () {
        this.pageNumber = 1;
        this.rowsTemp = [];
        this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
        this.currentRowsCount = this.rowsTemp.length;
        this.rows = this.rowsTemp;
    };
    GridComponent.prototype.Last = function () {
        this.pageNumber = this.totalPages;
        this.rowsTemp = [];
        this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
        this.currentRowsCount = this.rowsTemp.length;
        this.rows = this.rowsTemp;
    };
    GridComponent.prototype.updateList = function (row, colName, value) {
        this.findAndRemove(this.dirtyRows, Object.keys(row)[0], row[Object.keys(row)[0]]);
        row[colName] = value;
        this.dirtyRows.push(row);
    };
    /** * findAndRemove(): Find and remove from list of array by key**/
    GridComponent.prototype.findAndRemove = function (array, property, value) {
        array.forEach(function (result, index) {
            if (result[property] === value) {
                this.logService.log("Removing");
                array.splice(index, 1);
            }
        });
    };
    GridComponent.prototype.getObjects = function (obj, key, val) {
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
    GridComponent.prototype.returnList = function () {
        return this.dirtyRows;
    };
    GridComponent.prototype.deleteRow = function (row) {
        var confirmDelete = confirm("Do you really want to delete?");
        if (confirmDelete == true) {
            this.deleteSelectedRow.emit(row);
            this.findAndRemove(this.rows, Object.keys(row)[0], row[Object.keys(row)[0]]);
        }
    };
    __decorate([
        core_1.Output()
    ], GridComponent.prototype, "deleteSelectedRow", void 0);
    GridComponent = __decorate([
        core_1.Component({
            selector: 'editable-data-grid',
            templateUrl: '../dev/tpl/editable-grid.html',
            inputs: ['rows: rows', 'columns: columns', 'defaultSort: defaultSort'],
            providers: [router_deprecated_1.ROUTER_DIRECTIVES, core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }), logging_1.LoggingService]
        }),
        __param(0, core_1.Inject(router_deprecated_1.Router)),
        __param(1, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(2, core_1.Inject(logging_1.LoggingService))
    ], GridComponent);
    return GridComponent;
}());
exports.GridComponent = GridComponent;
//# sourceMappingURL=editable-grid.component.js.map