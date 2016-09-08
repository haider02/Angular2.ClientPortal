import {Component, EventEmitter, Output, OnInit, AfterViewInit, OnChanges, Inject, provide, AfterContentInit} from '@angular/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {LoggingService} from '../common/logging';
import {Column} from './column';
import {Sorter} from './sorter';
declare var moment: any;
declare var jQuery;
@Component( {
    selector: 'editable-data-grid',
    templateUrl: '../dev/tpl/editable-grid.html',
    inputs: ['rows: rows', 'columns: columns', 'defaultSort: defaultSort'],
    providers: [ROUTER_DIRECTIVES, provide(APP_CONFIG, { useValue: CONFIG }), LoggingService]
})

export class GridComponent implements OnInit, OnChanges, AfterViewInit, AfterContentInit{
    
    @Output() deleteSelectedRow = new EventEmitter();    
   
	columns: Array<Column>;
    defaultSort: string;
    currentRow: {};
    rows: Array<any>;
    rowsCopy: Array<any>;
    dirtyRows: Array<any>;
    pageSize: number;
    logService: LoggingService;
    pageOffset: number;
    pageNumber: number;
    totalRows: number;
    rowsTemp: Array<any>;
    currentRowsCount: number;
    totalPages: number;
    router: Router;
    appConfig: Config;
    sorter = new Sorter();    

    sort( key ) {
        this.sorter.sort( key, this.rows );
    }
    onFirstTime = true;
   

  /** --Constructor--
  * _http: Service object injection
  * _appConfig: Config object injection 
  **/
    constructor( @Inject(Router) _router, @Inject(APP_CONFIG) _appConfig: Config, @Inject(LoggingService) _logservice) {
        this.router = _router;
        this.appConfig = _appConfig;
        this.dirtyRows = [];
        this.logService = _logservice;
    }
    //#endregion 

    ngAfterViewInit() {
    }


    ngOnChanges() {       
        if (/*this.onFirstTime &&*/ this.rows) {
            
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


    }

    ngAfterContentInit() {
        
    }


    ngOnInit() {
        if (typeof this.defaultSort !== "undefined") {
            var sorter = new Sorter();                        
            //sorter.sort(this.defaultSort, this.rows);
        }
    }    

    Next() {        
        this.pageNumber += 1;
        this.rowsTemp = [];
        this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
        this.currentRowsCount = this.rowsTemp.length;
        this.rows = this.rowsTemp;
    }

    Previous() {        
        this.pageNumber -= 1;
        this.rowsTemp = [];
        this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
        this.currentRowsCount = this.rowsTemp.length;
        this.rows = this.rowsTemp;
    }



    First() {
        this.pageNumber = 1;

        this.rowsTemp = [];
        this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
        this.currentRowsCount = this.rowsTemp.length;
        this.rows = this.rowsTemp;
    }

    Last() {
        this.pageNumber = this.totalPages;
        this.rowsTemp = [];
        this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
        this.currentRowsCount = this.rowsTemp.length;
        this.rows = this.rowsTemp;
    }

    updateList(row, colName, value) {
        this.findAndRemove(this.dirtyRows, Object.keys(row)[0], row[Object.keys(row)[0]]);
        row[colName] = value;
        this.dirtyRows.push(row);
    }

    /** * findAndRemove(): Find and remove from list of array by key**/
    findAndRemove(array, property, value) {
        array.forEach(function (result, index) {
            if (result[property] === value) {
                this.logService.log("Removing");
                array.splice(index, 1);
            }
        });

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

    returnList() {       
        return this.dirtyRows;
    }

    deleteRow(row) {
        var confirmDelete = confirm("Do you really want to delete?")
        if (confirmDelete == true) {
            this.deleteSelectedRow.emit(row);
            this.findAndRemove(this.rows,Object.keys(row)[0], row[Object.keys(row)[0]])
        }
    }
}
