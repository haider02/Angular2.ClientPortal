import {Component, EventEmitter, Output, OnInit, OnChanges, Inject, provide} from '@angular/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {LoggingService} from '../common/logging';
import {Column} from './column';
import {Sorter} from './sorter';
declare var moment: any;

@Component( {
    selector: 'data-grid',
	templateUrl: '../dev/tpl/grid.html',
    inputs: ['rows: rows', 'columns: columns', 'defaultSort: defaultSort'],
    providers: [ROUTER_DIRECTIVES,LoggingService,provide(APP_CONFIG, { useValue: CONFIG })]
})

export class GridComponent implements OnInit, OnChanges{
    @Output() editSelectedRow = new EventEmitter();
    @Output() deleteSelectedRow = new EventEmitter();
    @Output() viewSelectedRow = new EventEmitter();
    @Output() summarySelectedRow = new EventEmitter();
    @Output() detailSelectedRow = new EventEmitter();
    @Output() checkedRow = new EventEmitter();

	columns: Array<Column>;
    defaultSort: string;
    currentRow: {};
    rows: Array<any>;
    rowsCopy: Array<any>;    
    pageSize: number;
    pageOffset: number;
    pageNumber: number;
    totalRows: number;
    rowsTemp: Array<any>;
    currentRowsCount: number;
    totalPages: number;
    router: Router;
    appConfig: Config;
    sorter = new Sorter();
    IsPrint: boolean = false;
    logService: LoggingService;

    sort( key ) {
        this.sorter.sort(key, this.rowsCopy);
        this.goToPageNumber(this.pageNumber);
    }
    onFirstTime = true;
   

  /** --Constructor--
  * _http: Service object injection
  * _appConfig: Config object injection 
  **/
    constructor( @Inject(Router) _router, @Inject(APP_CONFIG) _appConfig: Config, @Inject(LoggingService) _logservice) {
        this.router = _router;
        this.appConfig = _appConfig;
        this.logService = _logservice;
    }
    //#endregion 




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
            this.logService.log(this.rows)
    }


    ngOnInit() {
        if (typeof this.defaultSort !== "undefined") {
            var sorter = new Sorter();                        
            //sorter.sort(this.defaultSort, this.rows);
        }
    }
    
    


    editRow(row) {
        this.currentRow = row;
        this.editSelectedRow.emit(row);
    }    

    deleteRow(row) {
        this.currentRow = row;
        this.deleteSelectedRow.emit(row);
    }

    viewRow(row) {
        this.currentRow = row;
        this.viewSelectedRow.emit(row);
    }

    summaryRow(row) {
        this.currentRow = row;
        this.summarySelectedRow.emit(row);
    }

    detailRow(row) {
        this.currentRow = row;
        this.detailSelectedRow.emit(row);
    }

    CheckRow(row, isChecked) {
       
        this.logService.log(row);
        //this.logService.log(isChecked)
        var dict = {};
        dict = row;
        dict['IsChecked'] = isChecked.checked;
        this.currentRow = row;
        this.checkedRow.emit(dict);
    }

    checkDate(value,colName) {
        var param = value;
        var checkDate = moment(param, moment.ISO_8601, true).isValid();// moment(param).isValid();;
        if (checkDate) {
            if (colName == "Zip")
                return param;
            return moment(param).format('MM/DD/YYYY');
        } else {
            return param;
        }
    }
    goToPageNumber(page) {
        this.pageNumber =page;
        this.rowsTemp = [];
        this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
        this.currentRowsCount = this.rowsTemp.length;
        this.rows = this.rowsTemp;
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

    public GenerateCsv() {

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
                row = Object.keys(row).map(function (k) { return row[k] });
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
    }
}
