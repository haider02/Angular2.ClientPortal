import {Component, OnInit, provide, Inject, ViewChild, AfterViewInit, enableProdMode} from '@angular/core';
import {Http} from '@angular/http';
import {Router, RouteParams, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {enmTabs} from "../common/enumerations";
import {LoggingService} from '../common/logging';
import {NgForm}    from '@angular/forms';
import {NotificationsComponent} from '../notifications/notifications.component';
import {LeftNavigationComponent} from '../common/left-navigation.component';
import {HeaderDetailComponent} from '../common/header-detail.component';
import {ReferenceDataService } from '../referenceData/reference-data.service';
import {OrderTitleDetails} from './order-title.model';
import {OrderTitleService} from './order-title.service';
import {PdfViewerComponent} from '../pdfViewer/pdf-viewer.component';
import {DirectoryViewComponent} from "../treeView/tree-view.component";
import {TreeNodeModel} from '../treeView/tree-node.model'
import {DocumentModel} from '../orderDocument/order-document.model';
import {DocumentService} from '../orderDocument/order-document.service';
import {AccountProfileService} from '../accountProfile/account-profile.service';
import {Utility} from '../common/utility';
import {ClientStorage} from '../common/ClientStorage';
import {ClientStorageConstants} from '../common/constants';
declare var moment: any;
declare var jQuery;

enableProdMode();
@Component({
    selector: 'order-title',
    templateUrl: '../../dev/tpl/order-title.html',
    directives: [NgForm, NotificationsComponent, LeftNavigationComponent, PdfViewerComponent, HeaderDetailComponent, DirectoryViewComponent, PdfViewerComponent],
    providers: [ReferenceDataService, OrderTitleService, DocumentService, AccountProfileService, LoggingService, 
        provide(APP_CONFIG, { useValue: CONFIG })]

})

export class OrderTitleComponent implements AfterViewInit {

    public _refernceService: ReferenceDataService;
    public _service: OrderTitleService;
    public accountProfileService: AccountProfileService;
    public routeParams: RouteParams;
    public orderId: number;
    public clientTab: enmTabs;       
    @ViewChild(NotificationsComponent) child: NotificationsComponent;
    public apiEndpoint: string;
    public model = new OrderTitleDetails();
    public nodeSelected: TreeNodeModel;
    public treeViewList = new TreeNodeModel(0, '', false, '');
    public documentService: DocumentService; 
    public SelectedViewEnum = 0;
    public appConfig: Config;
    public loggedUser: string = "";
    public documentModel = new DocumentModel();
    public rowIds: Array<string>;
    public visibleMergeAllIcon: boolean = false;
    screenName: string = ClientStorageConstants.LS_OrderTitle;
    logService: LoggingService;
    utility = new Utility();
    constructor( 
        @Inject(APP_CONFIG) _appConfig: Config,
        @Inject(Router) _router,
        @Inject(ReferenceDataService) _refService,
        @Inject(OrderTitleService) _orderDetailService,
        @Inject(DocumentService) _docService,
        @Inject(RouteParams) _routeParams,
        @Inject(AccountProfileService) _accountProfileService,
        @Inject(LoggingService) _logservice)
        {        
            this.routeParams = _routeParams;        
            this.appConfig = _appConfig;
            this._refernceService = _refService;
            this.clientTab = enmTabs.OrderTitle;
            this._service = _orderDetailService;
            this.documentService = _docService;
            this.accountProfileService = _accountProfileService;
            this.logService = _logservice;
        }
    
    
    ngAfterViewInit() {
        this.validateOrder();
        this.rowIds = [];    

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

    
    validateOrder() {
        let orderNo = +ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_orderno);
        this.orderId = orderNo;
        this.getTitleOrderDetail();
        this.loadDocuments(this.orderId);
    }

    loadDocuments(orderNo) {
        //this.child.showLoader();
        this._service.GetDocuments(orderNo)
            .subscribe(
            data => this.setDocumentList(data),
            error => {
                //this.child.hideLoader();
                this.visibleMergeAllIcon = false;
            }
            );
    }
        
    loadRolesAndPermissions(data) {        
        if (data.length > 0) {
            for (var index in data) {
                if (!data[index]["IsVisible"]) {
                    jQuery("#" + data[index]["CtrlName"]).hide();
                } else if (!data[index]["IsEnabled"]) {
                    jQuery("#" + data[index]["CtrlName"] +  " :input").attr("disabled", true);
                }
            }
        }
    }
    

    public setDocumentList(data) {
        //this.child.hideLoader();
        this.treeViewList = this.formatData(data);
        if(data.length > 0)
            this.visibleMergeAllIcon = true;
        else
            this.visibleMergeAllIcon = false;
    }

    public formatEmails(emails) {
        if (emails !== "undefined" && emails !== null && emails !== '')
            return jQuery("#emails").html(emails);
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
        temp.childNodes = new Array<TreeNodeModel>();
        temp.childNodes.push(main);
        return temp;
    }

    removeSelection(dir: TreeNodeModel) {
        if (dir !== null && dir.childNodes !== null) {
            dir.childNodes.forEach(d => {
                d.isClicked = false;
                this.removeSelection(d);
            })
        }
    }

    islocked: boolean = false;
    public nodeSelection_Clicked(object: TreeNodeModel) {
        this.removeSelection(this.treeViewList);
        this.islocked = object.islocked;        
       
        object.isClicked = false;
        this.nodeSelected = object;
        
        if (object.RowId == 0 && object.DocumentFolder.toLowerCase().indexOf("lien") > -1) {
            this.SelectedViewEnum = 1;
            var node = this.nodeSelected;
            node.FilePath = object.FilePath;
            this.nodeSelected = node;
        } else {
            if (object.childNodes == null || (object.childNodes !== null && object.childNodes.length == 0)) {

                object.FilePath = object.FilePath.trim();
                this.child.showLoader();
                this.documentService.GetDocPath(object.RowId)
                    .subscribe(
                    data => {
                        this.child.hideLoader();
                        if (this.nodeSelected.FilePath.substr(object.FilePath.length - 4) == '.pdf') {
                            this.SelectedViewEnum = 1;
                        }
                        var node = this.nodeSelected;
                        node.FilePath = data;
                        this.nodeSelected = node;
                    },
                    error => {
                        this.child.hideLoader();
                        this.child.showErrorNotification("File Not Found", "Error !");
                        this.logService.log(error);
                    });
            }
        }
        object.isClicked = true;
    }

    getTitleOrderDetail() {
        this._service.GetOrderTitleDetail(this.orderId)
            .subscribe(
            data => this.setTitleOrderData(data),
            error => this.logService.log(error + ": error in getTitleOrderDetail call"),
            () => this.logService.log("getTitleOrderDetail Successfully!")
            );
    }

    addTitleBillRequestEvent() {
        if (this.model.IsTitleBillRequestCompleteOrCancel > 0) {            
            this.child.showErrorNotification('Title Bill is already requested and in progress', 'Error!');
        } else {
            this.child.showLoader();
            this._service.AddTitleBillReqEvent(this.orderId)
                .subscribe(
                data => this.addBillRequestHandler(data),
                error => {
                    this.child.hideLoader();
                    this.child.showSaveErrorNotification();                    
                },
                () => this.logService.log("API Call Finished Successfully!")
                );
        }
    }

    addTitleProduct() {
        this.child.showLoader();
        this._service.CPAddTitleProduct(this.orderId)
            .subscribe(
            data => this.addTitleProductHandler(data),
            error => {
                this.child.hideLoader();
                this.child.showSaveErrorNotification();
            },
            () => this.logService.log("API Call Finished Successfully!")
            );
    }

    addTitleProductHandler(data) {
        this.child.hideLoader();
        if (!data)
            this.child.showErrorNotification('Error while adding product', 'Error!');
        else {                     
            this.child.showSuccessNotification("Update Product Added.", "Success !");
        }
    }

    addBillRequestHandler(data) {
        this.child.hideLoader();
        if (!data)
            this.child.showErrorNotification('Error while adding Title Bill Request Event', 'Error!');
        else {            
            this.child.showSuccessNotification("Title Bill Requested.", "Success !");            
            this.getTitleOrderDetail();
            
        }
    }

    setTitleOrderData(data) {
        this.logService.log(data);
        this.model = data[0];
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
                    this.child.showSuccessNotification('Document has been merged successfully', 'Success');
                    jQuery("#download").attr("href", data);
                    document.getElementById('download').click();
                    
                },
                error => {
                    this.SelectedViewEnum = 0;
                    this.child.hideLoader();
                    this.child.showErrorNotification('Documents could not be merged successfully', 'Failure');
                },
                () => { }
                );
        }            
         else {
            this.child.showErrorNotification('Please select minimum two documents.', 'Failure');
        }
    }
    
}

