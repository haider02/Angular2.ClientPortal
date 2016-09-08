import {Component, OnInit, Input, Inject, provide, AfterViewInit, ViewChild} from '@angular/core';
import {ClientStorageConstants} from '../common/constants';
import {Route, Router, RouteParams, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {DocumentService} from './order-document.service';
import {ReferenceDataService} from '../referenceData/reference-data.service';
import {OrderNotesService} from '../OrderNotes/order-notes.service';
import {PdfViewerComponent} from '../pdfViewer/pdf-viewer.component'
import {DirectoryViewComponent} from "../treeView/tree-view.component"
import {DocumentModel} from './order-document.model';
import {TreeNodeModel} from '../treeView/tree-node.model'
import {LoggingService} from '../common/logging';
import {Config, APP_CONFIG, CONFIG} from '../app-config';
import {enmTabs} from "../common/enumerations";
import {NotificationsComponent} from '../notifications/notifications.component';
import {MultiSelectComponent} from '../multiSelect/multi-select.component';
import {MultiSelectColumn} from '../multiSelect/column';
import {LeftNavigationComponent} from '../common/left-navigation.component';
import {HeaderDetailComponent} from '../common/header-detail.component';
import {Utility} from '../common/utility';
import {AccountProfileService} from '../accountProfile/account-profile.service';
import {ClientStorage} from '../common/ClientStorage';
declare var jQuery;
declare var ApplyMask;

@Component({
    selector: 'order-document',
    templateUrl: '../dev/tpl/order-document.html',
    directives: [DirectoryViewComponent, PdfViewerComponent, NotificationsComponent, MultiSelectComponent, LeftNavigationComponent, HeaderDetailComponent],
    providers: [
        provide(APP_CONFIG, { useValue: CONFIG }),         
        ReferenceDataService, DocumentService, AccountProfileService, LoggingService]
})
export class OrderDocumentComponent implements OnInit, AfterViewInit {
    /** --Property Segment--
    * List of the properties.
    **/
    @ViewChild(NotificationsComponent) notificationHelper: NotificationsComponent;
    appConfig: Config;
    getData: string;
    postData: string;
    clientTab: enmTabs;
    _refernceService: ReferenceDataService;
    public isDirSelected = true;
    public isEditMode = false;
    public isDeleteClicked = false;
    public isLockClicked = false;
    public isUnlockClicked = false;
    public isMergeClicked = false;
    public SelectedViewEnum = 0;
    public isCheckboxEnabled = 0;
    public file: any;
    public nodeSelected: TreeNodeModel;
    public treeViewList = new TreeNodeModel(0, '', false, '');
    public displaySuccessMsg: boolean;
    public displayErrorMsg: boolean;
    public alerttype: string;
    public alertmsg: string;
    public temp = {};
    public ProductList = [];
    public documentType = [];
    public productList = [];
    public folderTypeList = [{ TypeId: -1, TypeName: "" }, { TypeId: 2, TypeName: "Other" }];
    public docTypesList = [{ TypeId: -1, TypeName: "" }, { TypeId: 2, TypeName: "Other" }];
    public documentModel = new DocumentModel();
    selectedNodes = new Array<TreeNodeModel>();
    selectedDocNodes = new Array<DocumentModel>();    
    documentService: DocumentService;   
    referenceDataService: ReferenceDataService;
    public isUploadedFromWeb: boolean = false;
    routeParams: RouteParams;
    orderNo: any;
    message: any;
    apiEndpoint: string;
    contactsColumns: Array<MultiSelectColumn>;
    lstATitle: string;
    lstBTitle: string;
    subject: string;
    selectedSentTo: any;
    fromEmail: any = "Please Select";
    sentToCSV: string = '';
    emailModel: EmailModel = new EmailModel();
    sentToInternalList: any = [];
    contactList: any = [];
    sentToList: any = [];
    fromList = new Array<any>();
    utility = new Utility();
    accountProfileService: AccountProfileService;    
    screenName: string = ClientStorageConstants.LS_OrderDocument;
    viewDeleteButton: boolean = true;
    visibleMergeAllIcon: boolean = false;
    logService: LoggingService;
    /** --Constructor--
    *   _service: Service object injection
    *   _appConfig: Config object injection 
    **/
    constructor( @Inject(DocumentService) _service,
        @Inject(APP_CONFIG) _appConfig: Config,
        @Inject(ReferenceDataService) _referenceDataService,
        @Inject(AccountProfileService) _accountProfileService,
        @Inject(RouteParams) _routeParams,
        @Inject(Router) _router,
        @Inject(LoggingService) _logservice
       ) {
        this.appConfig = _appConfig;
        this.apiEndpoint = _appConfig.apiBaseUrl + "/Document";
        this.logService = _logservice;
        this.documentService = _service;
        this.routeParams = _routeParams;
        this.referenceDataService = _referenceDataService;
        this.clientTab = enmTabs.OrderDocuments;
        this.accountProfileService = _accountProfileService;
        this.referenceDataService.getDocumentFolders()
            .subscribe(
                data => this.setDocumentFolders(data),
                error => { },
                () => { }
                );

        this.referenceDataService.getDocumentTypesSelectAllByProdCat("O")
            .subscribe(
                data => this.setDocumentTypesSelectAllByProdCat(data),
                error => { },
                () => { }
                );
    }

    ngAfterViewInit() {
        this.validateorder();
        ApplyMask();        

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
   
    validateorder() {
        let orderno = +ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_RP_orderno);
        if (orderno > 0) {             
            this.orderNo = orderno;
            this.loadDocuments(orderno);
            this.getOrderDetail();
        }
    }

    getOrderDetail() {
        this.documentService.GetOrderDetail(this.orderNo)
            .subscribe(
            data => this.setOrderDetailsItems(data),
            error => { this.logService.log(error) },
            () => { }
            );
    }


    /** 
    *   product type list set/success handler
	**/
    public setOrderDetailsItems(data) {
        this.productList = [];        
        this.productList = data;
    }

    

    /** 
    *   document type list set/success handler
	**/
    public setDocumentFolders(data) {
        //if (data && data.length > 0) {
        //    data.splice(0, 0, { RowId: null, cboEntry: 'Please select' });
        //} else {
        //    data.splice(0, 0, { RowId: null, cboEntry: 'Not available' });
        //} 
        this.folderTypeList = data;
    }
    /** 
    *   document type list set/success handler
	**/
    public setDocumentTypesSelectAllByProdCat(data) {
        //if (data && data.length > 0) {
        //    data.splice(0, 0, { RowID: "", Description: 'Please select' });
        //} else {
        //    data.splice(0, 0, { RowID: null, Description: 'Not available' });
        //} 
        this.documentModel.DocTypeID = 0;
        this.docTypesList = data;
    }

    /** 
    *   Document list set/success handler
	**/
    public setDocumentList(data) {
        if (data.length < 1)
            this.viewDeleteButton = false;
        else
            this.viewDeleteButton = true;

        if (data.length > 0)
            this.visibleMergeAllIcon = true;
        else
            this.visibleMergeAllIcon = false;

        this.notificationHelper.hideLoader();
        this.treeViewList = this.formatData(data);
    }
           
    /** 
    *   Constructs data as required tree form
	**/
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
            ch.UploadBy = doc.UploadBy;
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
               
    /** 
    *   to get required data, in initilization of component
	**/
    ngOnInit() {
    }

    /** 
    *   nodeSelection_Clicked, emited my child component/on tree node selection
	**/
    islocked: boolean = false;
    public nodeSelection_Clicked(object: TreeNodeModel) {
        this.removeSelection(this.treeViewList);
        this.islocked = object.islocked;
        if (object.islocked)
            return;
        this.isEditMode = false;
        object.isClicked = false;
        //this.nodeSelected = object;        
        this.nodeSelected = object;
        if (this.SelectedViewEnum !== 3) {
            if (object.childNodes == null || (object.childNodes !== null && object.childNodes.length == 0)) {

                if (this.nodeSelected.UploadBy == this.getCurrentUserID())
                    this.isDirSelected = false;
                else
                    this.isDirSelected = true;

                object.FilePath = object.FilePath.trim();
                this.documentService.GetDocPath(object.RowId)
                    .subscribe(
                        data => {
                            if (this.nodeSelected.FilePath.substr(object.FilePath.length - 4) == '.pdf') {
                                this.SelectedViewEnum = 5;
                            } else {
                                this.SelectedViewEnum = 6;
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
    
    /** 
    *   Add documents event,
	**/
    private documentAdd_Clicked() {
        this.removeTooltip();
        this.isUploadedFromWeb = true;
        this.showCheckBox(this.treeViewList, false);
        this.isEditMode = false;
        this.isDirSelected = true;
        this.SelectedViewEnum = 1;
        this.documentModel = new DocumentModel();
    }

    /** 
    *   Edit documents event,
	**/
    private documentEdit_Clicked() {
        this.removeTooltip();
        this.isEditMode = true;
        this.SelectedViewEnum = 1;
        this.documentModel = new DocumentModel();
        var tempDoc = new DocumentModel();
        //this.documentModel.file = null;
        if (this.nodeSelected.UploadfromWeb)
            this.isUploadedFromWeb = true;
        else
            this.isUploadedFromWeb = false;
        tempDoc.ID2 = this.nodeSelected.ID2;
        tempDoc.DocTypeID = this.nodeSelected.DocTypeID;
        tempDoc.DocumentFolder = this.nodeSelected.DocumentFolder;
        //tempDoc.Description = this.nodeSelected.Description;
        tempDoc.RowId = this.nodeSelected.RowId;
        tempDoc.Description = this.nodeSelected.DocDescription;
        this.documentModel = tempDoc;
        //setTimeout(x=> { this.documentModel.DocTypeID = this.nodeSelected.DocTypeID }, 100); 

    }

    /** 
    *   Merge documents event, shows check boxes tree
	**/
    private documentMerge_Clicked() {
        this.removeTooltip();
        this.showCheckBoxWithUnlockedAndPDF(this.treeViewList, true);
        this.selectedNodes = new Array<TreeNodeModel>();
        this.SelectedViewEnum = 3;
        this.isMergeClicked = true;
        this.documentModel = new DocumentModel();
        //this.isCheckboxEnabled = 1; 
    }

    getCurrentUserID() {

        let contactId = this.utility.getContactId(); 

        if (contactId !== null)
            return contactId;

        return null;
    }

    
    /** 
    *   save order clicked
	**/
    private saveorderDocument_Click() {
        this.removeTooltip();
        this.isDirSelected = true;
        this.documentModel.ID1 = this.orderNo;
        //this.documentModel.EnteredBy = this.orderNo;
        this.documentModel.UploadfromWeb = true;
        this.documentModel.UploadBy = this.getCurrentUserID();
        if (this.isEditMode) {
            this.notificationHelper.showLoader();
            this.documentService.updateDocument(this.documentModel)
                .subscribe(
                    data=> {
                        this.notificationHelper.showSaveSuccessNotification();
                        this.SuccessHandler(data)
                    },
                    error => {
                        this.notificationHelper.hideLoader();
                        this.notificationHelper.showSaveErrorNotification();
                    },
                    () => { }
                    );
        } else {
            if (this.documentModel.file
                && (this.documentModel.DocumentFolder.toLowerCase() !== "please select" || this.documentModel.DocumentFolder !== "")
                && this.documentModel.Description !== "") {
                this.notificationHelper.showLoader();
                this.saveUploadDocument(this.documentModel);
            }
            else {
                if (this.documentModel.DocumentFolder.toLowerCase() == "please select" || this.documentModel.DocumentFolder == "")
                    alert('Please select folder from dropdown');
                else if (!this.documentModel.file)
                    alert('please select file to upload');
                else if (this.documentModel.Description == "")
                { }
            }

        }
    }

    SuccessHandler(data) {
        this.notificationHelper.hideLoader();
        if (data == -1) {
            //this.displayErrorMsg = true;
            this.notificationHelper.showSaveErrorNotification();
        } else {
            //this.displaySuccessMsg = true; 
            this.notificationHelper.showSaveSuccessNotification();
            this.validateorder();
            this.SelectedViewEnum = 0;
        }
    }
 
    /** 
    *   load order documents
	**/
    loadDocuments(orderNo) {
        this.notificationHelper.showLoader();
        this.documentService.getDocuments(orderNo)
            .subscribe(
                data => this.setDocumentList(data),
                error => {
                    this.notificationHelper.hideLoader();
                },
                () => { }
                );
    }

    /** 
    *   cancel order doc merge clicked
	**/
    private canvelorderDocMerge_Click() {
        this.removeTooltip();
        this.isMergeClicked = false;
        this.showCheckBox(this.treeViewList, false);
        this.deSelectCheckBox(this.treeViewList, false);
        this.SelectedViewEnum = 0;
    }

    /** 
    *   cancel order doc merge clicked
	**/
    private saveorderDocMerge_Click() {
        this.removeTooltip();
        this.documentModel.ID1 = this.orderNo;
        this.documentModel.EnteredBy = JSON.parse(ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_LoggedInUserObject)); //this.appConfig.loggedInUser;
        this.getCheckedDocuments(this.treeViewList);
        if (this.selectedDocNodes.length >= 2) {
            if ((this.documentModel.DocumentFolder.toLowerCase() !== "please select" || this.documentModel.DocumentFolder !== "")
                && this.documentModel.Description !== "") {

                var mergDocModel = { MergeDocuments: this.selectedDocNodes, DocumentDetails: this.documentModel }
                this.documentService.mergeDocument(mergDocModel)
                    .subscribe(
                        data => {
                            this.validateorder();
                            this.SelectedViewEnum = 0;
                            this.showCheckBox(this.treeViewList, false);
                            this.deSelectCheckBox(this.treeViewList, false);
                            this.isMergeClicked = false;
                            this.notificationHelper.showSuccessNotification('Document has been merged successfully', 'Success');
                        },
                        error => {
                            this.notificationHelper.hideLoader();
                            this.notificationHelper.showErrorNotification('Documents could not be merged successfully', 'Failure');
                        },
                        () => { }
                        );
            }
            else {
                if (this.documentModel.DocumentFolder.toLowerCase() == "please select" || this.documentModel.DocumentFolder == "")
                    alert('Please select folder from dropdown');
                else if (this.documentModel.Description == "") {
                    alert('Please enter description.');
                }
            }
        } else {
            this.notificationHelper.showErrorNotification('Please select minimum two documents.', 'Failure');
        }
    }

    /** 
    *  show checked box tree for delete
	**/
    private showDeleteTree_Clicked() {
        this.removeTooltip();
        this.showCheckBoxWithUploadfromWeb(this.treeViewList, false);
        this.isDeleteClicked = true;
        this.SelectedViewEnum = 0;
    }

    /** 
    *  reset tree
	**/
    private hideDeleteTree_Clicked() {
        this.removeTooltip();
        this.showCheckBox(this.treeViewList, false);
        this.deSelectCheckBox(this.treeViewList, false);
        this.isDeleteClicked = false;
        this.SelectedViewEnum = 0;
    }

    /** 
    *  delete event 
	**/
    private documentDel_Clicked() {
        this.removeTooltip();
        //this.getCheckedDocuments(this.treeViewList);
        this.getCheckedUnLockedDocuments(this.treeViewList);
        if (this.selectedDocNodes.length !== 0) {
            this.isDeleteClicked = false;
            this.isDirSelected = true;
            this.showCheckBox(this.treeViewList, false);
            this.deSelectCheckBox(this.treeViewList, false);
            if (confirm('Do you really want to delete the document?')) {
                this.documentService.deleteDocuments(this.selectedDocNodes)
                    .subscribe(
                        data=> {
                            this.notificationHelper.showSuccessNotification('Documents deleted successfuly', 'Success');
                            this.loadDocuments(this.orderNo)
                        },
                        error => {
                            this.notificationHelper.hideLoader();
                            this.notificationHelper.showErrorNotification('Document/s could not delete, please try again', 'Error!')
                        },
                        () => { }
                        );
            }
            this.selectedDocNodes = new Array<DocumentModel>();
            this.SelectedViewEnum = 0;
        } else {
            this.notificationHelper.showWarningNotification('Please select document first', 'Warning');
        }
    }

    /** 
    *  show checked boxes tree for lock
	**/
    private showLockTreeLock_Clicked() {
        this.removeTooltip();
        this.showCheckBoxWithUnlocked(this.treeViewList, true);
        this.isLockClicked = true;
        this.SelectedViewEnum = 0;
    }

    /** 
    *  reset tree
	**/
    private hideLockTree_Clicked() {
        this.removeTooltip();
        this.isLockClicked = false;
        this.showCheckBox(this.treeViewList, false);
        this.deSelectCheckBox(this.treeViewList, false);
        this.SelectedViewEnum = 0;
    }

    /** 
    *  Lock document tree clicked
	**/
    private documentLock_Clicked() {
        this.removeTooltip();
        this.getCheckedDocuments(this.treeViewList);
        if (this.selectedDocNodes.length !== 0) {
            this.isLockClicked = false;
            this.showCheckBox(this.treeViewList, false);
            this.deSelectCheckBox(this.treeViewList, false);
            this.notificationHelper.showLoader();
            this.documentService.lockDocuments(this.selectedDocNodes, true)
                .subscribe(
                    data=> {
                        this.notificationHelper.showSuccessNotification('Document/s locked successfully', 'Success');
                        this.loadDocuments(this.orderNo)
                    },
                    error => {
                        this.notificationHelper.hideLoader();
                        this.notificationHelper.showErrorNotification('Document/s cannot be locked, please try again', 'Error!');
                    },
                    () => { }
                    );
            this.selectedDocNodes = new Array<DocumentModel>();
            this.SelectedViewEnum = 0;
        } else {
            this.notificationHelper.showWarningNotification('Please select document first', 'Warning');
        }
    }

    /** 
    *  show checked boxes tree for lock
	**/
    private showUnlockTreeLock_Clicked() {
        this.removeTooltip();
        this.showCheckBoxWithUploadfromWeb(this.treeViewList, true);
        this.isUnlockClicked = true;
        this.SelectedViewEnum = 0;
    }

    /** 
    *  reset tree
	**/
    private hideUnlockTree_Clicked() {
        this.removeTooltip();
        this.isUnlockClicked = false;
        this.showCheckBox(this.treeViewList, false);
        this.deSelectCheckBox(this.treeViewList, false);
        this.SelectedViewEnum = 0;
    }

    /** 
    *  Lock document tree clicked
	**/
    private documentUnlock_Clicked() {
        this.removeTooltip();
        this.getCheckedDocuments(this.treeViewList);
        if (this.selectedDocNodes.length !== 0) {
            this.isUnlockClicked = false;
            this.showCheckBox(this.treeViewList, false);
            this.deSelectCheckBox(this.treeViewList, false);
            this.notificationHelper.showLoader();
            this.documentService.lockDocuments(this.selectedDocNodes, false)
                .subscribe(
                    data=> {
                        this.notificationHelper.showSuccessNotification('Document/s unlocked successfully', 'Success');
                        this.loadDocuments(this.orderNo)
                    },
                    error => {
                        this.notificationHelper.hideLoader();
                        this.notificationHelper.showErrorNotification('Document/s cannot be unlocked, please try again', 'Error!');
                    },
                    () => { }
                    );
            this.selectedDocNodes = new Array<DocumentModel>();
            this.SelectedViewEnum = 0;
        } else {
            this.notificationHelper.showWarningNotification('Please select document first', 'Warning')
        }
    }
    
    /** 
    *  Lock document tree clicked
	**/
    private canvelOrderDocAddUpdate_Click() {
        this.removeTooltip();
        this.SelectedViewEnum = 0;
        this.isDirSelected = true;
    } 
    
    /** 
    *  file selection clicked
	**/
    public fileChange(obj) {
        var uploadedFile = obj.target.files[0];
       
        this.documentModel.file = uploadedFile;
    }
    
    /** 
    *  retirves selected nodes from tree
	**/
    getCheckedDocuments(dir: TreeNodeModel) {
        if (dir !== null && dir.childNodes !== null) {
            dir.childNodes.forEach(d => {
                if (d.childNodes == null || d.childNodes.length == 0)
                    if (d.checked) {
                        this.selectedNodes.push(d);
                        var tdoc = new DocumentModel();
                        tdoc.ID2 = d.ID2;
                        tdoc.DocTypeID = d.DocTypeID;
                        tdoc.Description = d.Description;
                        tdoc.RowId = d.RowId;
                        tdoc.DocPath = d.FilePath;
                        this.selectedDocNodes.push(tdoc);

                    }
                this.getCheckedDocuments(d);
            })
        }
    } 
    
    /** 
   *  retirves Unlocked Documents
   **/
    getCheckedUnLockedDocuments(dir: TreeNodeModel) {
        if (dir !== null && dir.childNodes !== null) {
            dir.childNodes.forEach(d => {
                if (d.childNodes == null || d.childNodes.length == 0)
                    if (d.checked && !d.islocked) {
                        this.selectedNodes.push(d);
                        var tdoc = new DocumentModel();
                        tdoc.ID2 = d.ID2;
                        tdoc.DocTypeID = d.DocTypeID;
                        tdoc.Description = d.Description;
                        tdoc.RowId = d.RowId;
                        this.selectedDocNodes.push(tdoc);

                    }
                this.getCheckedUnLockedDocuments(d);
            })
        }
    } 

    /** 
    *  removes selection from tree 
	**/
    removeSelection(dir: TreeNodeModel) {
        if (dir !== null && dir.childNodes !== null) {
            dir.childNodes.forEach(d => {
                d.isClicked = false;
                this.removeSelection(d);
            })
        }
    }

    /** 
    *  show check boxes in tree 
	**/
    showCheckBox(dir: TreeNodeModel, isShown: boolean) {
        if (dir !== null && dir.childNodes !== null) {
            dir.childNodes.forEach(d => {
                d.showCheckBox = isShown;
                this.showCheckBox(d, isShown);
            })
        }
    }

    /** 
    *  show check boxes in tree with unlock
	**/
    showCheckBoxWithUnlocked(dir: TreeNodeModel, isShown: boolean) {
        if (dir !== null && dir.childNodes !== null) {
            dir.childNodes.forEach(d => {
                if (!d.islocked)
                    d.showCheckBox = isShown;
                this.showCheckBoxWithUnlocked(d, isShown);
            })
        }
    }
    /** 
    *  show check boxes in tree with unlock
	**/
    showCheckBoxWithUnlockedAndPDF(dir: TreeNodeModel, isShown: boolean) {
        if (dir !== null && dir.childNodes !== null) {
            dir.childNodes.forEach(d => {
                if (!d.islocked && d.FilePath.search('.pdf') > 0)
                    d.showCheckBox = isShown;
                this.showCheckBoxWithUnlockedAndPDF(d, isShown);
            })
        }
    }

    /** 
    *  show check boxes in tree with locked
	**/
    showCheckBoxWithUploadfromWeb(dir: TreeNodeModel, isShown: boolean) {
        if (dir !== null && dir.childNodes !== null) {
            dir.childNodes.forEach(d => {
                if (d.UploadfromWeb && d.UploadBy==this.getCurrentUserID())
                    d.showCheckBox = true;
                else
                    d.showCheckBox = false;
                this.showCheckBoxWithUploadfromWeb(d, isShown);
            })
        }
    }
    
    /** 
    *  reset checkboxes
	**/
    deSelectCheckBox(dir: TreeNodeModel, selectionStatus: boolean) {
        if (dir !== null && dir.childNodes !== null) {
            dir.childNodes.forEach(d => {
                d.checked = selectionStatus;
                this.deSelectCheckBox(d, selectionStatus);
            })
        }
    }
    
    /*
    * remove tool tip using jquery
    */
    removeTooltip() {
        //jQuery('.tooltip[role="tooltip"]').remove();
    }
    /*
    *
    */
    saveUploadDocument(data: DocumentModel) {
        this.notificationHelper.showLoader();
        var f = new FormData();
        f.append(data.file.name, data.file);
        f.append('BorrowerViewable', data.BorrowerViewable);
        f.append('EnteredBy', JSON.parse(ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_LoggedInUserObject)) /*this.appConfig.loggedInUser*/);
        f.append('BranchID', data.BranchID);
        f.append('ClientViewable', data.ClientViewable);
        f.append('Description', data.Description);
        f.append('DisbursementID', data.DisbursementID);
        f.append('DocDescription', data.DocDescription);
        f.append('DocPath', data.DocPath);
        f.append('DocSource', data.DocSource);
        f.append('DocType', data.DocType);
        f.append('DocTypeID', data.DocTypeID);
        f.append('DocumentFolder', data.DocumentFolder);
        //f.append('EnteredDate', data.EnteredDate);
        f.append('EventId', data.EventId);
        f.append('FullDescription', data.FullDescription);
        f.append('ID1', data.ID1);
        f.append('ID2', data.ID2);
        f.append('IsLocked', data.IsLocked);
        f.append('Ordered', data.Ordered);
        f.append('ProductCategory', data.ProductCategory);
        f.append('RawDescription', data.RawDescription);
        f.append('RowId', data.RowId);
        //f.append('uidDisbursement', data.uidDisbursement);
        //f.append('uidHUDLine', data.uidHUDLine);
        f.append('VendorViewable', data.VendorViewable); 
        f.append('UploadfromWeb', data.UploadfromWeb);
        f.append('UploadBy', data.UploadBy);
        this.notificationHelper.showLoader();

        //this.documentService.SaveUploadDocument(f)
        //    .subscribe(
        //    data => this.documentAddSuccess(data),
        //    error => this.documentAddFaiure(error),
        //    () => { }
        //);        

        jQuery.ajax({
            url: this.apiEndpoint + '/SaveUploadDocument',
            headers: { 'Authorization': 'Bearer ' + ClientStorage.getLocalStorageItem("id_token") },
            data: f,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: d => this.documentAddSuccess(d),
            error: d => this.documentAddFaiure(d)
        }
        );
    }

    documentAddSuccess(data) {
        if (data == -1) {
            this.notificationHelper.hideLoader();
            //this.displayErrorMsg = true;
            this.notificationHelper.showSaveErrorNotification();
        } else {
            //this.displaySuccessMsg = true;
            this.validateorder();
            this.SelectedViewEnum = 0;
            this.notificationHelper.showSuccessNotification('Document has been uploaded successfully', 'Success');//.showSaveSuccessNotification();
        }
    }
    documentAddFaiure(data) {
        //this.displayErrorMsg = true;
        this.notificationHelper.hideLoader();
        this.notificationHelper.showSaveErrorNotification();
    }

    
    
    
}

export class EmailModel
{
    constructor(
        public EmailToCSV: string = '',
        public EmailFrom: string = 'Please Select',
        public Subject: string = '',
        public Body: string = '',
        public AttachmentsCSV: string = '',
        public DocumentID: number = null) { }
}