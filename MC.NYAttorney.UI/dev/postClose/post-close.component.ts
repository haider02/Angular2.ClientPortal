import {Component, OnInit, Inject, provide, ViewChild, AfterViewInit} from '@angular/core';
import {Http} from '@angular/http';
import {NgForm} from '@angular/forms';
import {Router, RouteParams, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {ReferenceDataService} from '../referenceData/reference-data.service';
import {NotificationsComponent} from '../notifications/notifications.component';
import {ClientStorageConstants} from '../common/constants';
import {GridComponent} from '../grid/grid.component';
import {Column} from '../grid/column';
import {StateComponent} from '../DropDowns/state/state.component';
import {CityComponent} from '../DropDowns/city/city.component';
import {CountyComponent} from '../DropDowns/county/county.component';
import {CityService} from '../DropDowns/city/city.service';

import {Utility} from '../common/utility';
import {AccountProfileService} from '../accountProfile/account-profile.service';
import {PostCloseService} from './post-close.service';
import {PostClose} from './post-close.model';
import {LeftNavigationComponent} from '../common/left-navigation.component';
import {HeaderDetailComponent} from '../common/header-detail.component';
import {enmTabs} from "../common/enumerations";

import {DirectoryViewComponent} from "../treeView/tree-view.component";
import {DocumentModel} from '../orderDocument/order-document.model';
import {TreeNodeModel} from '../treeView/tree-node.model';
import {DocumentService} from '../orderDocument/order-document.service';
import {PdfViewerComponent} from '../pdfViewer/pdf-viewer.component'
import {ClientStorage} from '../common/ClientStorage';
import {LoggingService} from '../common/logging';
declare var jQuery;
declare var moment: any;

@Component({
    selector: 'post-close',
    templateUrl: '../dev/tpl/post-close.html',
    inputs: ['state'],
    directives: [ROUTER_DIRECTIVES, NotificationsComponent, GridComponent, StateComponent, CityComponent, CountyComponent
        , LeftNavigationComponent
        , HeaderDetailComponent
        , DirectoryViewComponent
        , PdfViewerComponent
    ],
    providers: [provide(APP_CONFIG, { useValue: CONFIG }), ReferenceDataService
        , CityService
        , PostCloseService
        , DocumentService
        , AccountProfileService
        , LoggingService
    ]
})

export class PostCloseComponent implements OnInit, AfterViewInit {
    router: Router;
    routeParams: RouteParams;
    appConfig: Config;
    referenceDataService: ReferenceDataService;
    @ViewChild(NotificationsComponent) child: NotificationsComponent;
    successMessageDisplay: boolean;
    active = true;
    utility = new Utility();
    httpService: PostCloseService;
    model = new PostClose();
    clientTab: enmTabs;
    logService: LoggingService;
    orderNo: number;
    recordingDetailGridColumns: Array<Column>;

    public treeViewList = new TreeNodeModel(0, '', false, '');
    islocked: boolean = false;
    public nodeSelected: TreeNodeModel;
    public isDirSelected = true;
    public SelectedViewEnum = 0;
    documentService: DocumentService;

    rowIds: Array<string>;
    visibleMergeAllIcon: boolean = false;
    accountProfileService: AccountProfileService;
    screenName: string = ClientStorageConstants.LS_PostClose;

    constructor( @Inject(APP_CONFIG) _appConfig: Config, @Inject(ReferenceDataService) _referenceData, @Inject(Router) _router
        , @Inject(RouteParams) _routeParams
        , @Inject(PostCloseService) _service
        , @Inject(DocumentService) _docservice
        , @Inject(AccountProfileService) _accountProfileService
        , @Inject(LoggingService) _logservice
    ) {
        this.appConfig = _appConfig;
        this.referenceDataService = _referenceData;
        this.router = _router;
        this.routeParams = _routeParams;
        this.httpService = _service;
        this.clientTab = enmTabs.PostClose;
        this.documentService = _docservice;
        this.accountProfileService = _accountProfileService;
        this.logService = _logservice;
    }

    ngOnInit() {
        
    }

    ngOnChanges() {

    }

    ngAfterViewInit() {
        this.child.showLoader();

        if (this.utility.getClientId() !== null) {
            this.orderNo = +ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_orderno);
            this.model.OrderNo = this.orderNo;
            this.rowIds = [];

            this.getRecordingDetails();
            this.getLoanPolicyDetails();
            this.getPostCloseDocuments();

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

        this.recordingDetailGridColumns = this.getRecordingDetailGridColumns();
        var obj = JSON.parse(ClientStorage.getSessionStorageItem(this.screenName));
        for (var index in obj) {
            if (obj[index]["Parent"] == "PostCloseRecordingDetail") {
                if (!obj[index]["IsVisible"])
                    this.findAndRemove(this.recordingDetailGridColumns, "name", obj[index]["CtrlName"]);
            }
        }
    }

    findAndRemove(array, property, value) {
        array.forEach(function (result, index) {
            if (result[property] === value) {
                //Remove from array
                array.splice(index, 1);
            }
        });
    }
        
    getCurrentDateTime() {
        return moment().format('MM/DD/YYYY');
    }

    getDate(date) {
        if (date == null)
            return null;
        return moment(date).format("MM/DD/YYYY");
    }

    getDateTime(dateTime) {
        if (dateTime == null)
            return null;
        return moment(dateTime).format("MM/DD/YYYY  HH:mm A");
    }

    
    getRecordingDetails() {

        this.httpService.getRecordingDetails(this.model.OrderNo)
            .subscribe(
            data => this.loadRecordingDetails(data),
            error => this.logService.log(error + ": error in Recording Detail call"),
            () => this.logService.log("Recording Detail loaded Successfully!")
            );
    }

    loadRecordingDetails(data) {
        this.model.RecordingDetailList = data;    
    }

    getLoanPolicyDetails() {

        this.httpService.getLoanPolicyDetails(this.model.OrderNo)
            .subscribe(
            data => this.loadLoanPolicyDetails(data),
            error => this.logService.log(error + ": error in Loan Policy Details call"),
            () => this.logService.log("Loan Policy Details loaded Successfully!")
            );
    }

    loadLoanPolicyDetails(data) {
        this.model.LoanPolicyList = data;
        if (data.length>0) {
            this.model.LoanPolicyIssueDate = this.getDate(data[0].EffectiveDate);
            this.model.PolicyNumber = data[0].LoanPolicyNo;
        }        
    }

    getPostCloseDocuments() {

        this.httpService.getPostCloseDocuments(this.model.OrderNo)
            .subscribe(
            data => this.loadPostCloseDocuments(data),
            error => this.logService.log(error + ": error in Post Close Documents call"),
            () => this.logService.log("Post Close Documents loaded Successfully!")
            );
    }

    loadPostCloseDocuments(data) {
        this.model.PostCloseDocumentList = data;
        this.treeViewList = this.formatData(data);
        if (data.length > 0)
            this.visibleMergeAllIcon = true;
        else
            this.visibleMergeAllIcon = false;
        this.child.hideLoader();
    }

    getRecordingDetailGridColumns(): Array<Column> {
        return [
            new Column('DocumentType', 'Document Type'),
            new Column('Status', 'Status'),
            new Column('RecordingDetails', 'Recording Details')
        ];
    }

    private formatData(data) {
        var dictionary = {};
        var temp = new TreeNodeModel(-1, "", false, "");
        var main = new TreeNodeModel(1, "Post Close Documents", false, "");
        main.expanded = true;
        var childs = new Array<Node>();
        var docList = new Array<DocumentModel>();
        for (var counter = 0; counter < data.length; counter++) {
            var doc = new DocumentModel();
            doc.BorrowerViewable = data[counter].BorrowerViewable;
            doc.BranchID = data[counter].BranchID;
            doc.ClientViewable = data[counter].ClientViewable;
            doc.Description = data[counter].Description;
            doc.DisbursementID = data[counter].DisbursementID;
            doc.DocDescription = data[counter].DocDescription;
            doc.DocPath = data[counter].DocPath;
            doc.DocSource = data[counter].DocSource;
            doc.DocType = data[counter].DocType;
            doc.DocTypeID = data[counter].DocTypeId;
            doc.DocumentFolder = data[counter].DocumentType;
            doc.EnteredDate = data[counter].EnteredDate;
            doc.EventId = data[counter].EventId;
            doc.FullDescription = data[counter].FullDescription;
            doc.ID1 = data[counter].ID1;
            doc.ID2 = data[counter].ID2;
            doc.IsLocked = data[counter].IsLocked;
            doc.Ordered = data[counter].Ordered;
            doc.ProductCategory = data[counter].ProductCategory;
            doc.RawDescription = data[counter].RawDescription;
            doc.RowId = data[counter].RowId;
            this.rowIds.push(data[counter].RowId);
            doc.uidDisbursement = data[counter].uidDisbursement;
            doc.uidHUDLine = data[counter].uidHUDLine;
            doc.VendorViewable = data[counter].VendorViewable;
            doc.UploadfromWeb = data[counter].UploadfromWeb;
            doc.UploadBy = data[counter].UploadBy;
            docList.push(doc);

            var ch = new TreeNodeModel(0, '', true, '');
            ch.Description = doc.Description;
            if (doc.RawDescription !== null) {
                ch.nodeName = doc.RawDescription;
            }
            else {
                ch.nodeName = doc.DocDescription;
            }
            //ch.nodeName = doc.Description;
            ch.nodeId = doc.RowId;
            ch.isLeaf = true;
            ch.ID2 = doc.ID2;
            ch.DocTypeID = doc.DocTypeID;
            ch.RowId = doc.RowId;
            ch.DocumentFolder = doc.DocumentFolder;
            ch.islocked = doc.IsLocked;
            ch.FilePath = doc.DocPath;
            ch.UploadfromWeb = doc.UploadfromWeb;
            ch.DocDescription = doc.DocDescription;
            if (doc.DocumentFolder !== null || doc.DocumentFolder !== "") {
                if (dictionary[doc.DocumentFolder])
                    dictionary[doc.DocumentFolder].push(ch);
                else {
                    dictionary[doc.DocumentFolder] = [];
                    dictionary[doc.DocumentFolder].push(ch);
                }
            }
        }
        var subtree = new Array<DocumentModel>();
        main.childNodes = new Array<TreeNodeModel>();
        for (var propt in dictionary) {
            var doc = new DocumentModel();
            var ch = new TreeNodeModel(0, '', false, '');
            ch.childNodes = (dictionary[propt]);
            ch.nodeName = propt;
            ch.nodeId = (dictionary[propt])[0].RowId;
            main.childNodes.push(ch);
        }
        temp.childNodes = new Array<TreeNodeModel>();//
        temp.childNodes.push(main);
        return temp;
    }

    public nodeSelection_Clicked(object: TreeNodeModel) {
        this.removeSelection(this.treeViewList);
        this.islocked = object.islocked;
        if (object.islocked)
            return;
        //this.isEditMode = false;
        object.isClicked = false;
        //this.nodeSelected = object;

        this.nodeSelected = object;
        if (this.SelectedViewEnum !== 3) {
            if (object.childNodes == null || (object.childNodes !== null && object.childNodes.length == 0)) {
                this.isDirSelected = false;
                object.FilePath = object.FilePath.trim();
                this.documentService.GetDocPath(object.RowId)
                    .subscribe(
                    data => {
                        if (this.nodeSelected.FilePath.substr(object.FilePath.length - 4) == '.pdf') {
                            this.SelectedViewEnum = 1;
                        } 
                        var node = this.nodeSelected;
                        node.FilePath = data;
                        this.nodeSelected = node;
                    },
                    error => { },
                    () => { }
                    );
                //GetDocPath
            } else {
                this.isDirSelected = true;
                this.SelectedViewEnum = 0;
            }
        }
        object.isClicked = true;
    }

    removeSelection(dir: TreeNodeModel) {
        if (dir !== null && dir.childNodes !== null) {
            dir.childNodes.forEach(d => {
                d.isClicked = false;
                this.removeSelection(d);
            })
        }
    }

    private docMerge_Click() {

        if (this.rowIds.length >= 2) {
            this.nodeSelected = new TreeNodeModel(0, '', false, '');
            this.child.showLoader();            
            this.documentService.mergeTitleDocument(this.rowIds)
                .subscribe(
                data => {
                    this.SelectedViewEnum = 1;
                    this.nodeSelected.FilePath = data;
                    this.child.hideLoader();                    
                    jQuery("#download").attr("href", data);
                    document.getElementById('download').click();

                },
                error => {
                    this.SelectedViewEnum = 0;
                    this.child.hideLoader();
                    this.child.showErrorNotification('Documents could not be downloaded successfully', 'Failure');
                },
                () => { }
                );
        }
        else {
            this.child.showErrorNotification('Please select minimum two documents.', 'Failure');
        }
    }
}