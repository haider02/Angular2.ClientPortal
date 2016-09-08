using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models
{
    public class DocumentsSelectAll_ResultEntity
    {
        public int ID1 { get; set; }
        public Nullable<int> ID2 { get; set; }
        public int RowId { get; set; }
        public string DocSource { get; set; }
        public string DocumentFolder { get; set; }
        public string DocPath { get; set; }
        public Nullable<int> DocTypeId { get; set; }
        public string Description { get; set; }
        public string FullDescription { get; set; }
        public string DocDescription { get; set; }
        public string RawDescription { get; set; }
        public System.DateTime EnteredDate { get; set; }
        public bool ClientViewable { get; set; }
        public bool VendorViewable { get; set; }
        public bool BorrowerViewable { get; set; }
        public Nullable<int> EventId { get; set; }
        public string ProductCategory { get; set; }
        public string BranchID { get; set; }
        public Nullable<bool> IsLocked { get; set; }
        public string DocType { get; set; }
        public int Ordered { get; set; }
        public Nullable<System.Guid> uidHUDLine { get; set; }
        public Nullable<System.Guid> uidDisbursement { get; set; }
        public Nullable<int> DisbursementID { get; set; }
        public Nullable<bool> UploadfromWeb { get; set; }
        public string UploadBy { get; set; }
    }
}
