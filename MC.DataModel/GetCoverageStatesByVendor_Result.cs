//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace MC.DataModel
{
    using System;
    
    public partial class GetCoverageStatesByVendor_Result
    {
        public string StateCode { get; set; }
        public string StateAbbr { get; set; }
        public string StateName { get; set; }
        public string SecurityInstrument { get; set; }
        public string RecordingName1 { get; set; }
        public string RecordingName2 { get; set; }
        public int TT_AppInterior { get; set; }
        public int TT_AppExterior { get; set; }
        public int TT_PropertyRep { get; set; }
        public int TT_TitleCommit { get; set; }
        public int TT_FinalPolicy { get; set; }
        public bool RiskRate { get; set; }
        public bool AllInclusive { get; set; }
        public bool IsLicensingByState { get; set; }
        public string CompanyName { get; set; }
        public string CompanyLogo { get; set; }
        public bool Inactive { get; set; }
        public System.DateTime LastModDate { get; set; }
        public string LastModBy { get; set; }
        public string TitleEscrowTemplate { get; set; }
        public string WireBankName { get; set; }
        public string WireBankAddress { get; set; }
        public string WireABA { get; set; }
        public string WireAccount { get; set; }
        public string WireAccountName { get; set; }
        public bool IsAttorneyClosingState { get; set; }
        public string DefaultTaxType { get; set; }
        public string DefaultTaxPeriod { get; set; }
        public bool IsRateCalcEnabled { get; set; }
        public string AdditionalInformation { get; set; }
        public bool rcRefiPrevAmtsNeeded { get; set; }
        public bool rcRefiOrigAmtsNeeded { get; set; }
        public decimal EstimatedRecording { get; set; }
        public string StateMessages { get; set; }
        public bool Marital { get; set; }
        public Nullable<bool> IsWorkshare { get; set; }
        public Nullable<bool> IsQuickClose { get; set; }
        public Nullable<int> TimeZoneOffSet { get; set; }
        public Nullable<bool> RequiredRecToDisb { get; set; }
        public Nullable<bool> AttorneyDisburseState { get; set; }
        public bool InternalDeedPrep { get; set; }
        public string IsHUDSignatureRequired { get; set; }
        public string HUDSignatureBy { get; set; }
        public Nullable<bool> MCDeedPrep { get; set; }
        public bool BeingClause { get; set; }
        public string StateSpecificInstructions { get; set; }
        public Nullable<int> TimezoneOffSetDST { get; set; }
        public bool IsVendorDisburseState { get; set; }
        public Nullable<bool> isAttorneyDisburseState { get; set; }
        public string AutoVendorId { get; set; }
    }
}
