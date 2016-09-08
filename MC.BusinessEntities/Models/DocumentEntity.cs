using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace MC.BusinessEntities.Models
{
    public class DocumentEntity
    {
        public int RowID { get; set; }
        [Required]
        public int ID1 { get; set; }
        public Nullable<int> ID2 { get; set; }
        [Required]
        public string DocType { get; set; }
        [Required]
        public string DocPath { get; set; }
        public string Description { get; set; }
        public string DiscRefNo { get; set; }
        public Nullable<int> EventId { get; set; }
        [Required]
        public bool ClientViewable { get; set; }
        [Required]
        public bool VendorViewable { get; set; }
        [Required]
        public bool BorrowerViewable { get; set; }
        public int AccessCounter { get; set; }
        public string DocSource { get; set; }
        public Nullable<int> DocTypeID { get; set; }
        public string EnteredBy { get; set; }
        public System.DateTime EnteredDate { get; set; }
        public string LastAccessBy { get; set; }
        public Nullable<System.DateTime> LastAccessDate { get; set; }
        public string DocumentFolder { get; set; }
        public Nullable<bool> IsLocked { get; set; }
        public Nullable<System.DateTime> LockedDate { get; set; }
        public string LockedBy { get; set; }
        public Nullable<System.Guid> GUID { get; set; }
        public Nullable<System.Guid> uidHUDLine { get; set; }
        public Nullable<System.Guid> uidDisbursement { get; set; }
        public string S3KeyName { get; set; }
        public string S3eTag { get; set; }
        public Nullable<int> TCD_RowId { get; set; }
        public Nullable<int> DisbursementID { get; set; }
        public string LastModifiedBy { get; set; }
        public Nullable<bool> UploadfromWeb { get; set; }
        public string UploadBy { get; set; }
    }
}
