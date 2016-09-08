import {Component, Inject, OnInit, AfterViewInit, provide, Input} from '@angular/core';
import {NgForm}    from '@angular/forms';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from '@angular/router-deprecated';

import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {Utility} from './utility';
import {MilestoneTrackerService} from './milestone-tracker.service';
import {LoggingService} from '../common/logging';
import {ClientStorage} from '../common/ClientStorage';
import {ClientStorageConstants} from '../common/constants';
declare var jQuery;

@Component({
    selector: 'milestone-tracker',
    templateUrl: '../dev/tpl/milestone-tracker.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [provide(APP_CONFIG, { useValue: CONFIG })
        , MilestoneTrackerService, LoggingService
    ]
})

export class MilestoneTrackerComponent implements AfterViewInit {

    router: Router;
    routeParams: RouteParams;
    appConfig: Config;
    menuList: Array<any>;
    headerList: Array<any>;
    httpService: MilestoneTrackerService;
    model = new MilestoneTracker();
    utility = new Utility();
    logService: LoggingService;
    
    constructor( @Inject(APP_CONFIG) _appConfig: Config
        , @Inject(Router) _router
        , @Inject(MilestoneTrackerService) _service
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

    getMileStoneTracker(pCode) {
        this.model.ProductCode = pCode;

        this.httpService.getMileStoneTracker(this.model.OrderNo, this.model.ProductCode)
            .subscribe(
            data => this.loadMileStoneTracker(data),
            error => this.logService.log(error + ": error in MileStone Tracker call"),
            () => this.logService.log("MileStone Tracker loaded Successfully!")
            );
    }

    loadMileStoneTracker(data) {
        this.model.MileStoneTrackerList = data;
        var maxDate, minDate;
        var deptCompletedone = 0;

        if (this.model.ProductCode == "Refinance" || this.model.ProductCode == "Purchase") {
            //Opened
            minDate = this.utility.findMin(data, "Opened");
            this.model.OpenedDate = this.utility.getDate(minDate);
            

            //Departmental Complete
            var departmentalCompleteList = data.filter(x => x.DepartmentalCompleteExists == 1);
            if (departmentalCompleteList.length == 0) {
                deptCompletedone = 1;
                jQuery(".departmentalComplete").parent().remove();
            }
            else {
                if (this.utility.findNull(departmentalCompleteList, "DepartmentalComplete") == false) {
                    maxDate = this.utility.findMax(departmentalCompleteList, "DepartmentalComplete");
                    this.model.DepartmentalCompleteDate = this.utility.getDate(maxDate);
                    jQuery(".departmentalComplete").parent().addClass("done");
                    deptCompletedone = 1;
                }
            }

            //Title Complete
            var titleCompleteList = data.filter(x => x.TitleCompleteExists == 1);
            maxDate = this.utility.findMax(titleCompleteList, "TitleComplete");
            if (maxDate !== null && deptCompletedone == 1) {
                this.model.TitleCompleteDate = this.utility.getDate(maxDate);
                jQuery(".titleComplete").parent().addClass("done");
            }

            //Title Cleared
            var titleClearedList = data.filter(x => x.TitleClearedExists == 1);
            maxDate = this.utility.findMax(titleClearedList, "TitleCleared");
            if (maxDate !== null) {
                this.model.TitleClearedDate = this.utility.getDate(maxDate);
                jQuery(".titleCleared").parent().addClass("done");
            }

            //Title Bill Update
            var titleBillUpdateList = data.filter(x => x.TitleBillUpdatedExists == 1);
            maxDate = this.utility.findMax(titleBillUpdateList, "TitleBillUpdated");
            if (maxDate !== null) {
                this.model.TitleBillUpdateDate = this.utility.getDate(maxDate);
                jQuery(".titleBillUpdate").parent().addClass("done");
            }

            //Document Recorded
            var documentRecordedList = data.filter(x => x.DocumentRecordedExists == 1);
            maxDate = this.utility.findMax(documentRecordedList, "DocumentRecorded");
            if (maxDate !== null) {
                this.model.DocumentRecordedDate = this.utility.getDate(maxDate);
                jQuery(".documentRecorded").parent().addClass("done");
            }

            //Final Policy Issued
            var finalPolicyIssuedList = data.filter(x => x.FinalPolicyIssuedExists == 1);
            maxDate = this.utility.findMax(finalPolicyIssuedList, "FinalPolicyIssued");
            if (maxDate !== null) {
                this.model.FinalPolicyIssuedDate = this.utility.getDate(maxDate);
                jQuery(".finalPolicyIssued").parent().addClass("done");
            }
        }
        else if (this.model.ProductCode == "COOP") {
            //Opened
            minDate = this.utility.findMin(data, "Opened");
            this.model.OpenedDate = this.utility.getDate(minDate);

            //Lien Search
            this.model.DepartmentalCompleteText = "Lien Search";
            var lienSearchList = data.filter(x => x.LienSearchExists == 1);
            maxDate = this.utility.findMax(lienSearchList, "LienSearch");
            if (maxDate !== null) {
                this.model.DepartmentalCompleteDate = this.utility.getDate(maxDate);
                jQuery(".departmentalComplete").parent().addClass("done");
            }

            //UCC-1 Requested
            this.model.TitleCompleteText = "UCC-1 Requested";
            var ucc1RequestedList = data.filter(x => x.UCC1RequestedExists == 1);
            maxDate = this.utility.findMax(ucc1RequestedList, "UCC1Requested");
            if (maxDate !== null) {
                this.model.TitleCompleteDate = this.utility.getDate(maxDate);
                jQuery(".titleComplete").parent().addClass("done");
            }

            //UCC-1 Recorded
            this.model.TitleClearedText = "UCC-1 Recorded";
            var ucc1RecordedList = data.filter(x => x.UCC1RecordedExists == 1);
            maxDate = this.utility.findMax(ucc1RecordedList, "UCC1Recorded");
            if (maxDate !== null) {
                this.model.TitleClearedDate = this.utility.getDate(maxDate);
                jQuery(".titleCleared").parent().addClass("done");
            }

            //UCC-3 Requested
            this.model.TitleBillUpdateText = "UCC-3 Requested";
            var ucc3RequestedList = data.filter(x => x.UCC3RequestedExists == 1);
            maxDate = this.utility.findMax(ucc3RequestedList, "UCC3Requested");
            if (maxDate !== null) {
                this.model.TitleBillUpdateDate = this.utility.getDate(maxDate);
                jQuery(".titleBillUpdate").parent().addClass("done");
            }

            //UCC-3 Recorded
            this.model.DocumentRecordedText = "UCC-3 Recorded";
            var ucc3RecordedList = data.filter(x => x.UCC3RecordedExists == 1);
            maxDate = this.utility.findMax(ucc3RecordedList, "UCC3Recorded");
            if (maxDate !== null) {
                this.model.DocumentRecordedDate = this.utility.getDate(maxDate);
                jQuery(".documentRecorded").parent().addClass("done");
            }

            //No need of 7th tracker item incase of COOP
            jQuery(".finalPolicyIssued").parent().remove();
            jQuery(".documentRecorded").find(".bar").remove();
        }
    }
}

export class MilestoneTracker {
    constructor(
        public OrderNo: number = null,
        public OrderStatus: string = null,
        public ProductCode: string = "",

        public OpenedText: string = "Opened",
        public OpenedDate: string = null,
        public TitleCompleteText: string = "Title Complete",
        public TitleCompleteDate: string = null,
        public DepartmentalCompleteText: string = "Departmental Complete",
        public DepartmentalCompleteDate: string = null,
        public TitleClearedText: string = "Title Cleared",
        public TitleClearedDate: string = null,
        public TitleBillUpdateText: string = "Title Bill Update",
        public TitleBillUpdateDate: string = null,
        public DocumentRecordedText: string = "Document Recorded",
        public DocumentRecordedDate: string = null,
        public FinalPolicyIssuedText: string = "Final Policy Issued",
        public FinalPolicyIssuedDate: string = null,

        public MileStoneTrackerList: Array<any> = new Array<any>()
    ) { }
}