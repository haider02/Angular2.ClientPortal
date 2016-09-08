import {Component, OnInit, Inject, provide, ViewChild, AfterViewInit} from '@angular/core';
import {Http} from '@angular/http';
import {NgForm} from '@angular/forms';
import {Router, RouteParams, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {ClientStorageConstants} from '../common/constants';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {ReferenceDataService} from '../referenceData/reference-data.service';
import {NotificationsComponent} from '../notifications/notifications.component';
import {GridComponent} from '../grid/grid.component';
import {Column} from '../grid/column';
import {StateComponent} from '../DropDowns/state/state.component';
import {CityComponent} from '../DropDowns/city/city.component';
import {CountyComponent} from '../DropDowns/county/county.component';
import {CityService} from '../DropDowns/city/city.service';

import {Utility} from '../common/utility';
import {PreCloseService} from './pre-close.service';
import {PreClose} from './pre-close.model';
import {LeftNavigationComponent} from '../common/left-navigation.component';
import {HeaderDetailComponent} from '../common/header-detail.component';
import {enmTabs} from "../common/enumerations";
import {AccountProfileService} from '../accountProfile/account-profile.service';
import {DirectoryViewComponent} from "../treeView/tree-view.component";
import {DocumentModel} from '../orderDocument/order-document.model';
import {TreeNodeModel} from '../treeView/tree-node.model';
import {DocumentService} from '../orderDocument/order-document.service';
import {PdfViewerComponent} from '../pdfViewer/pdf-viewer.component';
import {ClientStorage} from '../common/ClientStorage';
import {LoggingService} from '../common/logging';

declare var jQuery;
declare var moment: any;

@Component({
    selector: 'pre-close',
    templateUrl: '../dev/tpl/pre-close.html',
    inputs: ['state'],
    directives: [ROUTER_DIRECTIVES, NotificationsComponent, GridComponent, StateComponent, CityComponent, CountyComponent
        , LeftNavigationComponent
        , HeaderDetailComponent
        , DirectoryViewComponent
        , PdfViewerComponent
    ],
    providers: [ provide(APP_CONFIG, { useValue: CONFIG }), ReferenceDataService
        , CityService
        , PreCloseService
        , DocumentService
        , AccountProfileService
        , LoggingService
    ]
})

export class PreCloseComponent implements AfterViewInit {
    router: Router;
    routeParams: RouteParams;
    appConfig: Config;
    referenceDataService: ReferenceDataService;
    @ViewChild(NotificationsComponent) child: NotificationsComponent;
    successMessageDisplay: boolean;
    active = true;
    utility = new Utility();
    httpService: PreCloseService;
    model = new PreClose();
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
    screenName: string = ClientStorageConstants.LS_PreClose;


    constructor( @Inject(APP_CONFIG) _appConfig: Config, @Inject(ReferenceDataService) _referenceData, @Inject(Router) _router
        , @Inject(RouteParams) _routeParams
        , @Inject(PreCloseService) _service
        , @Inject(DocumentService) _docservice
        , @Inject(AccountProfileService) _accountProfileService
        , @Inject(LoggingService) _logservice
    ) {
        this.appConfig = _appConfig;
        this.referenceDataService = _referenceData;
        this.router = _router;
        this.routeParams = _routeParams;
        this.httpService = _service;
        this.clientTab = enmTabs.PreClose;
        this.documentService = _docservice;
        this.accountProfileService = _accountProfileService;
        this.logService = _logservice;
    }
        
    ngAfterViewInit() {
        this.child.showLoader();
        if (this.utility.getClientId() !== null) {
            this.orderNo = +ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_orderno);
            this.model.OrderNo = this.orderNo;
            this.rowIds = [];

            this.getSignatureRequirement();
            this.getPreCloseDetails();
            this.getPreCloseDocuments();                                    

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
    }
        
    getCurrentUserID() {

        let contactId = this.utility.getContactId(); 
        if (contactId !== null)
            return contactId;        
        return null;
    }
    
    getClientID() {
        let clientId = this.utility.getClientId();
        if (clientId !== null) {
            return clientId;            
        }        
        return null;
    }
    
    getSignatureRequirement() {

        this.httpService.getSignatureRequirement(this.model.OrderNo)
            .subscribe(
            data => this.loadSignatureRequirement(data),
            error => this.logService.log(error + ": error in Signature Requirement call"),
            () => this.logService.log("Signature Requirement loaded Successfully!")
            );
    }

    loadSignatureRequirement(data) {
        this.model.SignatureRequirementList = data;
        if (data.length > 0) {
            this.model.SignatureRequirements = data[0];
        }    
    }

    getPreCloseDetails() {
        this.httpService.getPreCloseDetails(this.model.OrderNo)
            .subscribe(
            data => this.loadPreCloseDetails(data),
            error => this.logService.log(error + ": error in Pre Close Details call"),
            () => this.logService.log("Pre Close Details loaded Successfully!")
            );
    }

    loadPreCloseDetails(data) {
        this.model.PreCloseDetailList = data;
        if (data.length > 0) {
            this.model.Status = data[0].Status;
            this.model.ScheduledCloseDate = this.utility.getDate(data[0].ScheduledCloseDate, "YYYY-MM-DD");
            this.model.CloserName = data[0].CloserName;
        }        
    }

    getPreCloseDocuments() {
        this.httpService.getPreCloseDocuments(this.model.OrderNo)
            .subscribe(
            data => this.loadPreCloseDocuments(data),
            error => this.logService.log(error + ": error in Pre Close Documents call"),
            () => this.logService.log("Pre Close Documents loaded Successfully!")
            );
    }

    loadPreCloseDocuments(data) {
        this.model.PreCloseDocumentList = data;
        this.treeViewList = this.formatData(data);
        if (data.length > 0)
            this.visibleMergeAllIcon = true;
        else
            this.visibleMergeAllIcon = false;
        this.child.hideLoader();
    }
    
    private formatData(data) {
        var dictionary = {};
        var temp = new TreeNodeModel(-1, "", false, "");
        var main = new TreeNodeModel(1, "Main", false, "");
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
            doc.DocumentFolder = data[counter].DocumentFolder;
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
        object.isClicked = false;
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

    onSave() {
        this.child.showLoader();
        this.model.UserName = this.getCurrentUserID();
        this.model.Client = this.getClientID();
        this.model.AnticipatedCloseDate = this.model.ScheduledCloseDate;
        this.model.AnticipatedCloseBy = this.model.CloserName;

        this.httpService.savePreClose(this.model)
            .subscribe(
            data => this.saveHandler(data),
            error => {
                this.child.showSaveErrorNotification();
                this.child.hideLoader();
            },
            () => this.logService.log("API Call Finished Successfully!")
            );

        this.successMessageDisplay = true;
    }

    saveHandler(data) {
        this.child.hideLoader();
        if (data < 0)
            this.child.showErrorNotification('Pre Close Detail save failed', 'Error!');
        else {
            this.child.showSuccessNotification('Pre Close Detail saved successfully', 'Success!');            
        }
    }
}