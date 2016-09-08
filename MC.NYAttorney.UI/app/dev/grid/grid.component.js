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
        this.editSelectedRow = new core_1.EventEmitter();
        this.deleteSelectedRow = new core_1.EventEmitter();
        this.viewSelectedRow = new core_1.EventEmitter();
        this.summarySelectedRow = new core_1.EventEmitter();
        this.detailSelectedRow = new core_1.EventEmitter();
        this.checkedRow = new core_1.EventEmitter();
        this.sorter = new sorter_1.Sorter();
        this.IsPrint = false;
        this.onFirstTime = true;
        this.router = _router;
        this.appConfig = _appConfig;
        this.logService = _logservice;
    }
    GridComponent.prototype.sort = function (key) {
        this.sorter.sort(key, this.rowsCopy);
        this.goToPageNumber(this.pageNumber);
    };
    //#endregion 
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
    GridComponent.prototype.ngOnInit = function () {
        if (typeof this.defaultSort !== "undefined") {
            var sorter = new sorter_1.Sorter();
        }
    };
    GridComponent.prototype.editRow = function (row) {
        this.currentRow = row;
        this.editSelectedRow.emit(row);
    };
    GridComponent.prototype.deleteRow = function (row) {
        this.currentRow = row;
        this.deleteSelectedRow.emit(row);
    };
    GridComponent.prototype.viewRow = function (row) {
        this.currentRow = row;
        this.viewSelectedRow.emit(row);
    };
    GridComponent.prototype.summaryRow = function (row) {
        this.currentRow = row;
        this.summarySelectedRow.emit(row);
    };
    GridComponent.prototype.detailRow = function (row) {
        this.currentRow = row;
        this.detailSelectedRow.emit(row);
    };
    GridComponent.prototype.CheckRow = function (row, isChecked) {
        this.logService.log(row);
        //this.logService.log(isChecked)
        var dict = {};
        dict = row;
        dict['IsChecked'] = isChecked.checked;
        this.currentRow = row;
        this.checkedRow.emit(dict);
    };
    GridComponent.prototype.onVendorSelect = function (row) {
        this.logService.log(row);
        this.router.navigate(['VendorMain', { vId: parseInt(row.ViewId) }]);
    };
    GridComponent.prototype.onCommunicationSelect = function (row) {
        this.logService.log(row);
        this.router.navigate(['Communication', { vId: parseInt(row.VendorId) }]);
    };
    GridComponent.prototype.checkDate = function (value, colName) {
        var param = value;
        var checkDate = moment(param, moment.ISO_8601, true).isValid(); // moment(param).isValid();;
        if (checkDate) {
            if (colName == "Zip")
                return param;
            return moment(param).format('MM/DD/YYYY');
        }
        else {
            return param;
        }
    };
    GridComponent.prototype.goToPageNumber = function (page) {
        this.pageNumber = page;
        this.rowsTemp = [];
        this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
        this.currentRowsCount = this.rowsTemp.length;
        this.rows = this.rowsTemp;
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
    GridComponent.prototype.GenerateCsv = function () {
        if (this.rowsCopy.length > 0) {
            var colsToRemove = [];
            var objKeys = Object.keys(this.rowsCopy[0]);
            //Pushing unnecessary Columns Into Array
            for (var index in objKeys) {
                var isExist = false;
                for (var index1 in this.columns) {
                    if (objKeys[index] == this.columns[index1]["name"]) {
                        isExist = true;
                    }
                }
                if (!isExist)
                    colsToRemove.push(objKeys[index]);
            }
            var csv;
            var col = [];
            for (var index2 in this.rowsCopy) {
                var row = [];
                var filteredRow = [];
                row = this.rowsCopy[index2];
                //Removing unnecassary columns from array
                if (colsToRemove.length > 0) {
                    for (var index3 in colsToRemove) {
                        delete row[colsToRemove[index3]];
                    }
                }
                //Adding Header
                if (index2 == '0') {
                    col = Object.keys(this.rowsCopy[index2]);
                    csv = col.join(',');
                    csv += "\n";
                }
                //Getting values from list
                row = Object.keys(row).map(function (k) { return row[k]; });
                var temp = [];
                //Creating Rows
                //for (var index4 in row) {
                //    var str = '';
                //    if (row[index4] !== null && typeof row[index4] !== "undefined")
                //        str = row[index4].toString();
                //    temp.push(str.replace(/,/g, ""));
                //}
                csv += '"' + row.join('","') + '"' + "\n";
            }
            var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
            var download_link = document.createElement('a');
            download_link.href = uri;
            var ts = new Date().getTime();
            download_link.setAttribute("download", ts + ".csv");
            document.body.appendChild(download_link);
            download_link.click();
            document.body.removeChild(download_link);
        }
    };
    __decorate([
        core_1.Output()
    ], GridComponent.prototype, "editSelectedRow", void 0);
    __decorate([
        core_1.Output()
    ], GridComponent.prototype, "deleteSelectedRow", void 0);
    __decorate([
        core_1.Output()
    ], GridComponent.prototype, "viewSelectedRow", void 0);
    __decorate([
        core_1.Output()
    ], GridComponent.prototype, "summarySelectedRow", void 0);
    __decorate([
        core_1.Output()
    ], GridComponent.prototype, "detailSelectedRow", void 0);
    __decorate([
        core_1.Output()
    ], GridComponent.prototype, "checkedRow", void 0);
    GridComponent = __decorate([
        core_1.Component({
            selector: 'data-grid',
            templateUrl: '../dev/tpl/grid.html',
            inputs: ['rows: rows', 'columns: columns', 'defaultSort: defaultSort'],
            providers: [router_deprecated_1.ROUTER_DIRECTIVES, logging_1.LoggingService, core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG })]
        }),
        __param(0, core_1.Inject(router_deprecated_1.Router)),
        __param(1, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(2, core_1.Inject(logging_1.LoggingService))
    ], GridComponent);
    return GridComponent;
}());
exports.GridComponent = GridComponent;
//# sourceMappingURL=grid.component.js.map