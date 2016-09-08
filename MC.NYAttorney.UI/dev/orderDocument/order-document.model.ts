
export class DocumentModel {
    public nodeId: number;
    public parentId: number;
    public folderTypeId: number;
    public description: string;
    public nodeName: string;
    public file: any; 

    constructor() {
        this.BorrowerViewable = false;
        this.BranchID = "";
        this.ClientViewable = true;
        this.Description = "";
        this.DisbursementID = 0;
        this.DocDescription = "";
        this.DocPath = "test_path";     
        this.DocSource = "I";
        this.DocType = "O";
        this.DocTypeID =0;
        this.DocumentFolder = "";
        this.EnteredDate = new Date();
        this.EventId = 0;
        this.expanded = false;
        this.folderTypeId = 0;
        this.FullDescription = "";
        this.ID1 = 0;
        this.ID2 = 1;
        this.IsLocked = false;
        this.Ordered = 0;
        this.ProductCategory = "";
        this.RawDescription = "";
        this.RowId = 0;
        this.uidDisbursement = null;
        this.uidHUDLine = null;
        this.VendorViewable = false;
        this.EnteredBy = "SYSTEM";
        this.LastModifiedBy = "SYSTEM";
        this.LockedBy = "SYSTEM";
        this.UploadfromWeb=true;
        this.UploadBy="SYSTEM";
    }

    expanded: boolean;
    public toggle() {
        this.expanded = !this.expanded;
        this.nodeclick();
    }
    public nodeclick() {
        
    }
    
    public documentNodes = Array<DocumentModel>();
    ///
    public ID1: number;
    public ID2: number;
    public RowId: number;
    public DocSource: string;
    public DocumentFolder: string;
    public DocPath: string;
    public DocTypeID: number;
    public Description: string;
    public FullDescription: string;
    public DocDescription: string;
    public RawDescription: string;
    public EnteredBy: string;
    public EnteredDate: Date;

    public ClientViewable: boolean
    public VendorViewable: boolean
    public BorrowerViewable: boolean
    public EventId: number;
    public ProductCategory: string;
    public BranchID: string;
    public IsLocked: boolean;
    public DocType: string;
    public Ordered: number;
    public uidHUDLine: string;
    public uidDisbursement: string;
    public DisbursementID: number;
    public LastModifiedBy: string; 
    public LockedBy: string; 
    public UploadfromWeb: boolean;
    public UploadBy: string;
}