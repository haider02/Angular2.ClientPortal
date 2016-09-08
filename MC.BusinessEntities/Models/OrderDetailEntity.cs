using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MC.BusinessEntities.Models;
using System.ComponentModel.DataAnnotations;

namespace MC.BusinessEntities.Models
{
    public class OrderDetailEntity
    {
        public int RowId { get; set; }
        [Required]
        public int OrderNo { get; set; }
        [Required]
        public int ItemNo { get; set; }
        public string BranchId { get; set; }
        public Nullable<int> ProcessRowId { get; set; }
        public System.DateTime EnteredDate { get; set; }
        public string EnteredBy { get; set; }
        public bool Lockout { get; set; }
        public bool DelayLockout { get; set; }
        public bool GPMLockout { get; set; }
        public bool LockOverride { get; set; }
        public string ProductCategory { get; set; }
        public string ProductCode { get; set; }
        public string ClientRefNo { get; set; }
        public Nullable<System.DateTime> CompletedDate { get; set; }
        public Nullable<System.DateTime> CancelledDate { get; set; }
        public decimal ClientPrice { get; set; }
        public int ClientAR_RowId { get; set; }
        public decimal GPM { get; set; }
        public Nullable<double> GPMPercentage { get; set; }
        public string Status { get; set; }
        public bool Assigned { get; set; }
        public Nullable<System.DateTime> FollowUpDate { get; set; }
        public Nullable<int> HcopySentDays { get; set; }
        public string Contact { get; set; }
        public string ContactExt { get; set; }
        public Nullable<int> ClientContactId { get; set; }
        public string VendorInstructions { get; set; }
        public string InternalInstructions { get; set; }
        public string PaymentMtd { get; set; }
        public Nullable<decimal> CODAmtDue { get; set; }
        public string ResponseMtd { get; set; }
        public string ResponseTo { get; set; }
        public bool CompPhotos { get; set; }
        public bool InteriorPhotos { get; set; }
        public bool DigitalPhotos { get; set; }
        public Nullable<int> HardcopyCnt { get; set; }
        public string HardcopyDlvyMtd { get; set; }
        public string AcresAbove5 { get; set; }
        public string AccountNo { get; set; }
        public bool PayOffRecv { get; set; }
        public bool DeedXfer { get; set; }
        public Nullable<int> YearsLived { get; set; }
        public string MtgHolder { get; set; }
        public string LegalDesc { get; set; }
        public Nullable<int> NoOfClosings { get; set; }
        public bool DocPrepReq { get; set; }
        public bool DocPrepDeed { get; set; }
        public bool DocPrepSub { get; set; }
        public bool DocPrepOther { get; set; }
        public string ClsAddresses { get; set; }
        public bool DisburseFunds { get; set; }
        public bool Accomodation { get; set; }
        public string InitClsLoc { get; set; }
        public Nullable<System.DateTime> InitSchedReq { get; set; }
        public string LienPosition { get; set; }
        public bool TaxesInEscrow { get; set; }
        public Nullable<int> LastDelay_RowId { get; set; }
        public string PiggybackCode { get; set; }
        public bool PiggyBackOverride { get; set; }
        public string EDIReference { get; set; }
        public Nullable<decimal> BusinessTurnTime { get; set; }
        public Nullable<decimal> CalendarTurnTime { get; set; }
        public bool ManualAssignEnabled { get; set; }
        public string MIS_OrderNo { get; set; }
        public string MIS_Branch { get; set; }
        public string MIS_DeptID { get; set; }
        public string MIS_TeamID { get; set; }
        public string MIS_XWingID { get; set; }
        public string VendorOrderNo { get; set; }
        public bool ShowOnOrderWIP { get; set; }
        public Nullable<int> ClientBundleID { get; set; }
        public Nullable<int> BundleDetailsID { get; set; }
        public bool UpgradeDowngrade { get; set; }
        public System.DateTime LastModDate { get; set; }
        public string LastModBy { get; set; }
        public byte[] SysTimeStamp { get; set; }
        public Nullable<int> LoanType { get; set; }
        public Nullable<decimal> InterestRate { get; set; }
        public Nullable<int> PiggyLoanType { get; set; }
        public Nullable<decimal> PiggyInterestRate { get; set; }
        public Nullable<System.DateTime> ProposedClsDate { get; set; }
        public Nullable<int> GfeId { get; set; }
        public bool ttlAltAddress { get; set; }
        public Nullable<int> AltAddressId { get; set; }
        public Nullable<bool> InstantTitle { get; set; }
        public int Ordered { get; set; }

        //public virtual AddressEntity Address { get; set; }
        //[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        //public virtual ICollection<VendorAssignment> VendorAssignments { get; set; }
        //[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        //public virtual ICollection<VendorAssigReject> VendorAssigRejects { get; set; }
    }
}
