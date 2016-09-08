import {Component, Inject, OnInit, AfterViewInit, provide, Input, ViewChild} from '@angular/core';
import {NgForm}    from '@angular/forms';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from '@angular/router-deprecated';
import {NotificationsComponent} from '../notifications/notifications.component';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {Utility} from './utility';
import {ItemCheckListService} from './item-checklist.service';
import {LoggingService} from '../common/logging';
import {ClientStorage} from '../common/ClientStorage';
import {ClientStorageConstants} from '../common/constants';
declare var jQuery;

@Component({
    selector: 'item-checklist',
    templateUrl: '../dev/tpl/item-checklist.html',
    directives: [ROUTER_DIRECTIVES, NotificationsComponent],
    providers: [provide(APP_CONFIG, { useValue: CONFIG })
        , ItemCheckListService, LoggingService
    ]
})

export class ItemCheckListComponent implements AfterViewInit {

    @ViewChild(NotificationsComponent) notify: NotificationsComponent;
    router: Router;
    routeParams: RouteParams;
    appConfig: Config;
    menuList: Array<any>;
    headerList: Array<any>;
    httpService: ItemCheckListService;
    model = new ItemCheckList();
    utility = new Utility();
    isAttorneyEnable = false;
    logService: LoggingService;    

    constructor( @Inject(APP_CONFIG) _appConfig: Config
        , @Inject(Router) _router
        , @Inject(ItemCheckListService) _service
        , @Inject(RouteParams) _routeParams
        , @Inject(LoggingService) _logservice
    ) {
        this.appConfig = _appConfig;
        this.httpService = _service;
        this.router = _router;
        this.routeParams = _routeParams;    
        this.logService = _logservice;    
    }

    ngAfterViewInit() {
        let orderNo = +ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_orderno);
        this.model.OrderNo = orderNo;

        var status = ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_status);
        this.model.OrderStatus = status;
    }

    getCheckList(pCode) {
        this.model.ProductCode = pCode;

        this.httpService.getItemCheckList(this.model.OrderNo, this.model.ProductCode)
            .subscribe(
            data => this.loadCheckList(data),
            error => this.logService.log(error + ": error in CheckList call"),
            () => this.logService.log("CheckList loaded Successfully!")
            );
    }

    loadCheckList(data) {
        this.model.ItemCheckList = data;
        var maxDate, minDate;
        var deptCompletedone = 0;

        if (this.model.ProductCode == "Refinance") {
            //Opened
            minDate = this.utility.findMin(data, "Opened");
            this.model.OpenedItemDate = this.utility.getDateTime(minDate);
            
            //Departmental
            var departmentalCompleteList = data.filter(x => x.DepartmentalCompleteExists == 1);
            if (departmentalCompleteList.length == 0) {
                jQuery(".departmentalItem").remove();
                deptCompletedone = 1;
            }
            else {
                if (this.utility.findNull(departmentalCompleteList, "DepartmentalComplete") == false) {
                    maxDate = this.utility.findMax(departmentalCompleteList, "DepartmentalComplete");
                    this.model.DepartmentalItemDate = this.utility.getDateTime(maxDate);
                    this.model.DepartmentalItemStatus = "Complete";
                    deptCompletedone = 1;
                }
            }

            //Title
            var titleCompleteList = data.filter(x => x.TitleCompleteExists == 1);
            maxDate = this.utility.findMax(titleCompleteList, "TitleComplete");
            if (maxDate !== null && deptCompletedone == 1) {
                this.model.TitleItemDate = this.utility.getDateTime(maxDate);
                this.model.TitleItemStatus = "Complete";
            }

            //Collateral
            var collateralList = data.filter(x => x.CollateralDocumentExists == 1);
            maxDate = this.utility.findMax(collateralList, "CollateralDocument");
            if (maxDate !== null) {
                this.model.CollateralItemDate = this.utility.getDateTime(maxDate);
                this.model.CollateralItemStatus = "Complete";
            }

            //Attorney
            var attorneyList = data.filter(x => x.AttorneyCleartoCloseEnable == true);
            if (attorneyList.length > 0)
                this.isAttorneyEnable = true;
            maxDate = this.utility.findMax(data, "AttorneyCleartoCloseDate");
            if (maxDate !== null) {
                this.model.AttorneyItemDate = this.utility.getDateTime(maxDate);
                this.model.AttorneyItemStatus = "Complete";
            }

            //Mortgage Connect
            var cleartocloseList = data.filter(x => x.TitleClearedExists == 1);
            maxDate = this.utility.findMax(cleartocloseList, "TitleCleared");
            if (maxDate !== null) {
                this.model.MortgageConnectItemDate = this.utility.getDateTime(maxDate);
                this.model.MortgageConnectItemStatus = "Complete";
            }
            else {
                maxDate = this.utility.findMax(cleartocloseList, "ClearedDate");
                if (maxDate !== null) {
                    this.model.MortgageConnectItemDate = this.utility.getDateTime(maxDate);
                    this.model.MortgageConnectItemStatus = "Complete";
                }
            }

            //Title Bill
            var titleBillList = data.filter(x => x.TitleBillUpdatedExists == 1);
            maxDate = this.utility.findMax(titleBillList, "TitleBillUpdated");
            if (maxDate !== null) {
                this.model.TitleBillItemDate = this.utility.getDateTime(maxDate);
                this.model.TitleBillItemStatus = "Complete";
            }

            //Recording
            var recordingList = data.filter(x => x.DocumentRecordedExists == 1);
            maxDate = this.utility.findMax(recordingList, "DocumentRecorded");
            if (maxDate !== null) {
                this.model.RecordingItemDate = this.utility.getDateTime(maxDate);
                this.model.RecordingItemStatus = "Complete";
            }

            //Policy
            var policyList = data.filter(x => x.FinalPolicyIssuedExists == 1);
            maxDate = this.utility.findMax(policyList, "FinalPolicyIssued");
            if (maxDate !== null) {
                this.model.PolicyItemDate = this.utility.getDateTime(maxDate);
                this.model.PolicyItemStatus = "Complete";
            }

            //Title Update
            var titleUpdateList = data.filter(x => x.TitleUpdateExists == 1);
            if (titleUpdateList.length == 0)
                jQuery(".titleUpdateItem").remove();
            else {
                maxDate = this.utility.findMax(titleUpdateList, "TitleUpdate");
                if (maxDate !== null) {
                    this.model.TitleUpdateItemDate = this.utility.getDateTime(maxDate);
                    this.model.TitleUpdateItemStatus = "Complete";
                }
            }
        }
        else if (this.model.ProductCode == "Purchase") {
            //Opened
            minDate = this.utility.findMin(data, "Opened");
            this.model.OpenedItemDate = this.utility.getDateTime(minDate);
            
            //Departmental
            var departmentalCompleteList = data.filter(x => x.DepartmentalCompleteExists == 1);
            if (departmentalCompleteList.length == 0) {
                deptCompletedone = 1;
                jQuery(".departmentalItem").remove();
            }
            else {
                if (this.utility.findNull(departmentalCompleteList, "DepartmentalComplete") == false) {
                    maxDate = this.utility.findMax(departmentalCompleteList, "DepartmentalComplete");
                    this.model.DepartmentalItemDate = this.utility.getDateTime(maxDate);
                    this.model.DepartmentalItemStatus = "Complete";
                    deptCompletedone = 1;
                }
            }

            //Title
            var titleCompleteList = data.filter(x => x.TitleCompleteExists == 1);
            maxDate = this.utility.findMax(titleCompleteList, "TitleComplete");
            if (maxDate !== null && deptCompletedone == 1) {
                this.model.TitleItemDate = this.utility.getDateTime(maxDate);
                this.model.TitleItemStatus = "Complete";
            }

            //Mortgage Connect
            var cleartocloseList = data.filter(x => x.TitleClearedExists == 1);
            maxDate = this.utility.findMax(cleartocloseList, "TitleCleared");
            this.model.CollateralItemText = "Mortgage Connect Clear to Close - Title Company Ready to Schedule";
            if (maxDate !== null) {
                this.model.CollateralItemDate = this.utility.getDateTime(maxDate);
                this.model.CollateralItemStatus = "Complete";
            }
            else {
                maxDate = this.utility.findMax(cleartocloseList, "ClearedDate");
                if (maxDate !== null) {
                    this.model.CollateralItemDate = this.utility.getDateTime(maxDate);
                    this.model.CollateralItemStatus = "Complete";
                }
            }

            //Title Update
            var titleUpdateList = data.filter(x => x.TitleUpdateExists == 1);
            maxDate = this.utility.findMax(titleUpdateList, "TitleUpdate");
            this.model.AttorneyItemText = "Title Update - Update of Title Report";

            if (titleUpdateList.length == 0)
                jQuery(".AttorneyItem").remove();
            else {
                if (maxDate !== null) {
                    this.model.AttorneyItemDate = this.utility.getDateTime(maxDate);
                    this.model.AttorneyItemStatus = "Complete";
                }
            }
            //Tax Update
            var titleBillList = data.filter(x => x.TitleTaxUpdateExists == 1);
            maxDate = this.utility.findMax(titleBillList, "TitleTaxUpdate");
            this.model.MortgageConnectItemText = "Tax Update - Update of Tax Information";
            if (titleBillList.length == 0)
                jQuery(".MortgageConnectItem").remove();
            else {
                if (maxDate !== null) {
                    this.model.MortgageConnectItemDate = this.utility.getDateTime(maxDate);
                    this.model.MortgageConnectItemStatus = "Complete";
                }
            }

            //Title Bill
            var titleBillList = data.filter(x => x.TitleBillUpdatedExists == 1);
            maxDate = this.utility.findMax(titleBillList, "TitleBillUpdated");
            this.model.TitleBillItemText = "Title Bill - Title Fees Prepared";
            if (maxDate !== null) {
                this.model.TitleBillItemDate = this.utility.getDateTime(maxDate);
                this.model.TitleBillItemStatus = "Complete";
            }

            //Scheduled Closing
            var scheduledClosingList = data.filter(x => x.ScheduledClosingExists == 1);
            maxDate = this.utility.findMax(scheduledClosingList, "ScheduledClosingEnteredDate");
            this.model.RecordingItemText = "Scheduled Closing - Appointment for Closing";
            if (maxDate !== null) {
                var maxIndex = this.utility.findMaxIndex(scheduledClosingList, "ScheduledClosingEnteredDate");
                if (scheduledClosingList.length !== 0 && scheduledClosingList[maxIndex]["ScheduledClosing"] !== null) {
                    maxDate = this.utility.findMax(scheduledClosingList, "ScheduledClosing");
                    if (maxDate !== null) {
                        this.model.RecordingItemDate = this.utility.getDateTime(maxDate);
                        this.model.RecordingItemStatus = "Complete";
                    }
                }
            }

            //Recording
            var recordingList = data.filter(x => x.DocumentRecordedExists == 1);
            maxDate = this.utility.findMax(recordingList, "DocumentRecorded");
            this.model.PolicyItemText = "Recording - Recordable Documents of Record";
            if (maxDate !== null) {
                this.model.PolicyItemDate = this.utility.getDateTime(maxDate);
                this.model.PolicyItemStatus = "Complete";
            }

            //Policy
            var policyList = data.filter(x => x.FinalPolicyIssuedExists == 1);
            maxDate = this.utility.findMax(policyList, "FinalPolicyIssued");
            this.model.TitleUpdateItemText = "Policy - Final Policy Issued";
            if (maxDate !== null) {
                this.model.TitleUpdateItemDate = this.utility.getDateTime(maxDate);
                this.model.TitleUpdateItemStatus = "Complete";
            }
        }
        else if (this.model.ProductCode == "COOP") {
            //Opened
            minDate = this.utility.findMin(data, "Opened");
            this.model.OpenedItemDate = this.utility.getDateTime(minDate);

            //Lien Search
            this.model.DepartmentalItemText = "Lien Search - Data being collected and reviewed";
            var lienSearchList = data.filter(x => x.LienSearchExists == 1);
            maxDate = this.utility.findMax(lienSearchList, "LienSearch");
            if (maxDate !== null) {
                this.model.DepartmentalItemDate = this.utility.getDateTime(maxDate);
                this.model.DepartmentalItemStatus = "Complete";
            }

            //Contin - Lien Search
            this.model.TitleItemText = "Contin. - Update of Lien Search";
            var lienSearchList = data.filter(x => x.ContinUpdateExists == 1);
            maxDate = this.utility.findMax(lienSearchList, "ContinUpdate");
            if (maxDate !== null) {
                this.model.TitleItemDate = this.utility.getDateTime(maxDate);
                this.model.TitleItemStatus = "Complete";
            }

            //UCC-1 Requested
            this.model.CollateralItemText = "UCC-1 Requested - Recording is in progress";
            var ucc1RequestedList = data.filter(x => x.UCC1RequestedExists == 1);
            maxDate = this.utility.findMax(ucc1RequestedList, "UCC1Requested");
            if (maxDate !== null) {
                this.model.CollateralItemDate = this.utility.getDateTime(maxDate);
                this.model.CollateralItemStatus = "Complete";
            }

            //UCC-1 Recorded
            this.model.AttorneyItemText = "UCC-1 Recorded";
            var ucc1RecordedList = data.filter(x => x.UCC1RecordedExists == 1);
            maxDate = this.utility.findMax(ucc1RecordedList, "UCC1Recorded");
            if (maxDate !== null) {
                this.model.AttorneyItemDate = this.utility.getDateTime(maxDate);
                this.model.AttorneyItemStatus = "Complete";
            }

            //UCC-3 Requested
            this.model.MortgageConnectItemText = "UCC-3 Requested - Recording is in progress";
            var ucc3RequestedList = data.filter(x => x.UCC3RequestedExists == 1);
            maxDate = this.utility.findMax(ucc3RequestedList, "UCC3Requested");
            if (maxDate !== null) {
                this.model.MortgageConnectItemDate = this.utility.getDateTime(maxDate);
                this.model.MortgageConnectItemStatus = "Complete";
            }

            //UCC-3 Recorded
            this.model.TitleBillItemText = "UCC-3 Recorded";
            var ucc3RecordedList = data.filter(x => x.UCC3RecordedExists == 1);
            maxDate = this.utility.findMax(ucc3RecordedList, "UCC3Recorded");
            if (maxDate !== null) {
                this.model.TitleBillItemDate = this.utility.getDateTime(maxDate);
                this.model.TitleBillItemStatus = "Complete";
            }

            //No need of more than 7 items incase of COOP
            jQuery(".recordingItem").remove();
            jQuery(".policyItem").remove();
            jQuery(".titleUpdateItem").remove();
        }
    }

    onSave() {        
        this.notify.showLoader();
        this.httpService.saveOrderStatus(this.model.OrderNo)
            .subscribe(
            data => this.OrderStatusSaved(data),
            error => {           
                this.notify.hideLoader();   
                this.notify.showErrorNotification("error in Attorney Clear to Close call" + error, "Error !");
            },
            () => this.logService.log("Order Status Saved Successfully!")
            );
    }

    OrderStatusSaved(data) {                               
        this.notify.hideLoader();
        this.notify.showSuccessNotification("Order Status Saved Successfully!", "Success!");        
        setTimeout(d => { window.location.reload(false);  }, 1000);
    }
}

export class ItemCheckList {
    constructor(
        public OrderNo: number = null,
        public OrderStatus: string = null,
        public ProductCode: string = "",
        
        public OpenedItemText: string = "Opened - Order received",
        public OpenedItemStatus: string = "Complete",
        public OpenedItemDate: string = null,
        public TitleItemText: string = "Title - Data being collected and Underwritten",
        public TitleItemStatus: string = "In-progress",
        public TitleItemDate: string = null,
        public DepartmentalItemText: string = "Departmental - Data being collected for review",
        public DepartmentalItemStatus: string = "In-progress",
        public DepartmentalItemDate: string = null,
        public CollateralItemText: string = "Collateral - Documents being collected for review",
        public CollateralItemStatus: string = "In-progress",
        public CollateralItemDate: string = null,
        public AttorneyItemText: string = "Attorney Clear to Close - Attorney ready to schedule",
        public AttorneyItemStatus: string = "In-progress",
        public AttorneyItemDate: string = null,
        public MortgageConnectItemText: string = "Mortgage Connect Clear to Close - Title Company Ready to Schedule",
        public MortgageConnectItemStatus: string = "In-progress",
        public MortgageConnectItemDate: string = null,
        public TitleBillItemText: string = "Title Bill - Title Fees Prepared",
        public TitleBillItemStatus: string = "In-progress",
        public TitleBillItemDate: string = null,
        public RecordingItemText: string = "Recording - Recordable Documents of Record",
        public RecordingItemStatus: string = "In-progress",
        public RecordingItemDate: string = null,
        public PolicyItemText: string = "Policy - Final Policy Issued",
        public PolicyItemStatus: string = "In-progress",
        public PolicyItemDate: string = null,
        public TitleUpdateItemText: string = "Title Update - Update of Title Report",
        public TitleUpdateItemStatus: string = "In-progress",
        public TitleUpdateItemDate: string = null,

        public ItemCheckList: Array<any> = new Array<any>()
    ) { }
}