"use strict";
var DocumentModel = (function () {
    function DocumentModel() {
        this.documentNodes = Array();
        this.BorrowerViewable = false;
        this.BranchID = "";
        this.ClientViewable = true;
        this.Description = "";
        this.DisbursementID = 0;
        this.DocDescription = "";
        this.DocPath = "test_path";
        this.DocSource = "I";
        this.DocType = "O";
        this.DocTypeID = 0;
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
        this.UploadfromWeb = true;
        this.UploadBy = "SYSTEM";
    }
    DocumentModel.prototype.toggle = function () {
        this.expanded = !this.expanded;
        this.nodeclick();
    };
    DocumentModel.prototype.nodeclick = function () {
    };
    return DocumentModel;
}());
exports.DocumentModel = DocumentModel;
//# sourceMappingURL=order-document.model.js.map