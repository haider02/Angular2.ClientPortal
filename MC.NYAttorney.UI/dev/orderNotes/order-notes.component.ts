import {Component, OnInit, provide, Inject, ViewChild, AfterViewInit,enableProdMode} from '@angular/core';
import {Http} from '@angular/http';
import {Router, RouteParams, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {enmTabs} from "../common/enumerations";
import {LoggingService} from '../common/logging';
import {NgForm}    from '@angular/forms';
import {NotificationsComponent} from '../notifications/notifications.component';
import {OrderNotesModel} from './order-notes.model';
import {OrderNotesService} from './order-notes.service';
import {LeftNavigationComponent} from '../common/left-navigation.component';
import {HeaderDetailComponent} from '../common/header-detail.component';
import {ReferenceDataService } from '../referenceData/reference-data.service';
import {Utility} from '../common/utility';
import {AccountProfileService} from '../accountProfile/account-profile.service';
import {ClientStorage} from '../common/ClientStorage';
import {ClientStorageConstants} from '../common/constants';
declare var moment: any;
declare var jQuery;

enableProdMode();
@Component({
    selector: 'notes',
    templateUrl: '../../dev/tpl/order-notes.html',
    directives: [NgForm, NotificationsComponent, LeftNavigationComponent, HeaderDetailComponent],
    providers: [ OrderNotesService, ReferenceDataService, AccountProfileService,
        provide(APP_CONFIG, { useValue: CONFIG }), LoggingService]

})

export class NotesComponent implements  AfterViewInit {

    _refernceService: ReferenceDataService;
    routeParams: RouteParams;
    orderId: number;
    clientTab: enmTabs;
    httpService: OrderNotesService;
    NotesModelList: Array<OrderNotesModel>;
    NotesModelListCopy: Array<OrderNotesModel>;
    @ViewChild(NotificationsComponent) child: NotificationsComponent;
    model = new OrderNotesModelClass();
    modelTemp: OrderNotesModelClass;    
    isNoNoteFound: boolean=false;
    apiEndpoint: string;
    fromList = new Array<any>();    
    noteCopy: string;    
    rowsCopy: Array<OrderNotesModel>; 
    pageSize: number;
    pageOffset: number;
    pageNumber: number;
    totalRows: number;
    rowsTemp: Array<OrderNotesModel>;
    currentRowsCount: number;
    totalPages: number;
    onFirstTime = true;
    pageNumberInput: number;
    pageNumberList: Array<number>;
    appConfig: Config;   
    loggedUser: string = "";
    noteTypeList = new Array<any>();
    ImageList = new Array<string>();
    noteFormVisible: boolean = false;
    noteTypeListInPopup = new Array<any>();
    utility = new Utility();
    accountProfileService: AccountProfileService;
    logService: LoggingService;
    screenName: string = ClientStorageConstants.LS_OrderNotes;
    active = true;

    constructor( @Inject(OrderNotesService) _service,
        @Inject(APP_CONFIG) _appConfig: Config,
        @Inject(Router) _router,
        @Inject(ReferenceDataService) _refService,
        @Inject(AccountProfileService) _accountProfileService,
        @Inject(RouteParams) _routeParams,
        @Inject(LoggingService) _logservice) {  
        this.NotesModelList = [];
        this.routeParams = _routeParams;
        this.httpService = _service;
        this.appConfig = _appConfig;
        this._refernceService = _refService;
        this.accountProfileService = _accountProfileService;
        this.noteTypeList = [];
        this.ImageList = ['PAYROL', 'ACCOUNTING', 'ACCOUNTINGISSUE', 'COUNSELING', 'COVERAGE', 'FOLLOWUP', 'GENERALNOTETOFILE', 'INITIALCALL', 'PAYMENT', 'PERFORMANCE', 'PROBLEMRESPONSE', 'ROUTINE', 'WORKFLOW'];
        this.clientTab = enmTabs.OrderNotes;
        this.logService = _logservice;
    }

    ngAfterViewInit() {
        this.validateOrder();
        if (JSON.parse(ClientStorage.getSessionStorageItem(this.screenName)) == null)
            this.accountProfileService.getPermissionsAgainstRole(this.screenName)
                .subscribe(
                data => {
                    ClientStorage.setSessionStorageItem(this.screenName, JSON.stringify(data));
                    this.loadRolesAndPermissions(data);
                },
                error => this.logService.log(error));
        else
            this.loadRolesAndPermissions(JSON.parse(ClientStorage.getSessionStorageItem(this.screenName)));        
    }
       
    
    loadRolesAndPermissions(data) {
        if (data.length > 0) {
            for (var index in data) {
                if (!data[index]["IsVisible"]) {
                    jQuery("#" + data[index]["CtrlName"]).hide();
                } else if (!data[index]["IsEnabled"]) {
                    jQuery("#" + data[index]["CtrlName"] + " :input").attr("disabled", true);
                }
            }
        }
    }
    
    addBtnForm() {
        this.model.Note = null;
        this.noteFormVisible = true;
        this.active = false;
        setTimeout(() => this.active = true, 0);
    }

    getCurrentUserID() {
        let contactId = this.utility.getContactId(); 
        if (contactId !== null)
            return contactId;
        return null;
    }

    submitted = false;
    onSubmit() {
        this.model.NoteId = 0;
        this.submitted = true;       
        this.model.LastModBy = this.getCurrentUserID();
        this.model.OrderNo = this.orderId;
        this.model.Note = this.model.Note.replace(/(?:\r\n|\r|\n)/g, '</br>');
        this.model.NoteType = "[SYSTEM]";
        this.model.ClientViewable = true;
        this.model.ItemNo = 1;
        this.model.Suffix = "OT";
        this.model.NoteSource = "C";        
        this.child.showLoader();
        this.httpService.createNotes(this.model).subscribe(
            response => this.successCreator(response),
            this.logError,
            () => this.logService.log('Creation Call Sent')
        );       
    }
    
    setNoteTypeList(data) {
        this.child.hideLoader();
        this.noteTypeListInPopup = data;
        this.noteTypeList = data;
        this.getNotes();

        this.findAndRemove(this.noteTypeListInPopup, 'cboEntry', '[ALL]');
        this.findAndRemove(this.noteTypeListInPopup, 'cboEntry', 'Please Select');

    }

    findAndRemove(array, property, value) {
        array.forEach(function (result, index) {
            if (result[property] === value) {
                array.splice(index, 1);
            }
        });
    }

    createPageNumberArray() {
        this.pageNumberList = new Array<number>();
        for (var i = 1; i <= this.totalPages; i++)
            this.pageNumberList.push(i);
    }    

    validateOrder() {
        let orderNo = +ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_orderno);
        this.orderId = orderNo;  
        this.fillNotesType();  
        
    }

    getNotes() {
        this.child.showLoader();
        this.httpService.getNotesByOrder(this.orderId)
            .subscribe(
                data => this.setData(data),
                error => this.returnResponse(error),
                () => this.logService.log("API Call Finished Successfully!")
        );
    }

    fillNotesType() {        
        this.child.showLoader();
        this._refernceService.getddlType('OrderNoteType')
            .subscribe(
            data => this.setNoteTypeList(data),
            error => { this.logService.log(error) },
            () => this.logService.log("API Call Finished Successfully!")
        );
        this.child.hideLoader()
    }

   

    filterNotes(sender) {        
        
        this.searchNotes(sender.target.value);
    }

    searchNotes(noteType) {
        this.NotesModelList = [];

        if (noteType == "[ALL]" && noteType!=="Please Select") {            
            this.NotesModelList = this.NotesModelListCopy;
        }
        else if (noteType !== "[ALL]" && noteType !== "Please Select") {
            for (var index in this.NotesModelListCopy) {
                if (this.NotesModelListCopy[index]["NoteType"] == noteType) {
                    this.NotesModelListCopy[index]["LastModDate"] = moment(this.NotesModelListCopy[index]["LastModDate"]).format('MM/DD/YYYY');
                    this.NotesModelList.push(this.NotesModelListCopy[index]);
                }
            }
        }
    }

    logError(err) {
        this.child.hideLoader();
        this.child.showSaveErrorNotification();
        console.error('There was an error: ' + err);
    } 

    addIcon(noteType) {
        var type = noteType.replace(/\s/g, '');
        if (this.ImageList.indexOf(type.toUpperCase()) > -1) {           
            type = type.toUpperCase();
            return type;
        } else {            
            return 'DEFAULT';
        }
    }

    successCreator(res) {                
        this.child.hideLoader();        
        this.child.showSaveSuccessNotification();        
        this.getNotes();
        this.isNoNoteFound = false;
        jQuery("#cancelBtn").click();
    }

   

    public setData(data) {
        
        this.child.hideLoader();
        this.NotesModelList = [];
        
        for (var index in data) {
            var date = data[index]["LastModDate"];
            
            data[index]["LastModDate"] = moment(data[index]["LastModDate"]).format('MM/DD/YYYY HH:mm A');
            this.NotesModelList.push(data[index]);
        }
        this.NotesModelListCopy = data;
        this.addPagination();
       
    }

    addPagination() {
        if (/*this.onFirstTime &&*/ this.NotesModelList) {

            this.rowsCopy = this.NotesModelList;
            this.pageNumber = 1;
            this.pageSize = this.appConfig.pageSize;
            this.totalRows = this.rowsCopy.length;
            this.rowsTemp = [];
            this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
            this.NotesModelList = this.rowsTemp;
            this.currentRowsCount = this.rowsTemp.length;
            this.onFirstTime = false;


            var totalPages = (this.totalRows + this.pageSize - 1) / this.pageSize;
            this.totalPages = parseInt(totalPages.toString());

            this.createPageNumberArray();
        }
        if (this.NotesModelList)
            this.logService.log(this.NotesModelList)
    }

    returnResponse(err) {        
        this.child.hideLoader();
        this.logService.log(err);
        if (err.statusText == "Ok") {
            this.isNoNoteFound = true;            
            jQuery(".paginationBtn").prop("disabled", true);
        }
        else {
            this.child.showWarningNotification("Order Notes not Found!", "Warning !");
        }
        
    }

    

    gotoPageNumberInput(sender) {
        this.goToPageNumber(sender.target.value);
    }

    goToPageNumber(page) {
        this.pageNumber = page;
        this.rowsTemp = [];
        this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
        this.currentRowsCount = this.rowsTemp.length;
        this.NotesModelList = this.rowsTemp;
    }

    Next() {
        this.pageNumber += 1;
        this.rowsTemp = [];
        this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
        this.currentRowsCount = this.rowsTemp.length;
        this.NotesModelList = this.rowsTemp;
    }

    Previous() {
        this.pageNumber -= 1;
        this.rowsTemp = [];
        this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
        this.currentRowsCount = this.rowsTemp.length;
        this.NotesModelList = this.rowsTemp;
    }



    First() {
        this.pageNumber = 1;

        this.rowsTemp = [];
        this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
        this.currentRowsCount = this.rowsTemp.length;
        this.NotesModelList = this.rowsTemp;
    }

    Last() {
        this.pageNumber = this.totalPages;
        this.rowsTemp = [];
        this.rowsTemp = this.rowsCopy.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
        this.currentRowsCount = this.rowsTemp.length;
        this.NotesModelList = this.rowsTemp;
    }
}


class OrderNotesModelClass implements OrderNotesModel {
    public file: any; 
    constructor(
       
        public NoteId: number=null,
        public OrderNo: number=null,
        public ItemNo: number = null,
        public Xref_RowId: number = null,
        public Suffix: string = null,
        public NoteSource: string = null,
        public EventId: number = null,
        public NoteType: string = null,
        public Note: string = null,
        public SentTo: string = null,
        public Priority: boolean = null,
        public ClientViewable: boolean = null,
        public VendorViewable: boolean = null,
        public BorrowerViewable: boolean = null,
        public ClientActionReq: boolean = null,
        public LastModDate: string = null,
        public LastModBy: string = null,
        public SysTimeStamp: string = null,
        public Inactive: boolean = null

        ) { }
}