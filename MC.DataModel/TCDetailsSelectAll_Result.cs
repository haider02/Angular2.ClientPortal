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
    
    public partial class TCDetailsSelectAll_Result
    {
        public string ClearingType { get; set; }
        public string ClearingTypeName { get; set; }
        public int DML_RowId { get; set; }
        public string Name1 { get; set; }
        public int Paragraph_RowId { get; set; }
        public Nullable<int> EL_RowId { get; set; }
        public string Status { get; set; }
        public string AttorneyApprovalStatus { get; set; }
        public Nullable<bool> DisplayAttorneyStatusColumn { get; set; }
        public string Team { get; set; }
        public bool Cleared { get; set; }
        public string ClearedBy { get; set; }
        public Nullable<System.DateTime> ClearedDate { get; set; }
        public int TCD_RowId { get; set; }
        public Nullable<System.DateTime> FollowUpDate { get; set; }
        public string FollowUpAction { get; set; }
        public Nullable<System.DateTime> DueDate { get; set; }
        public Nullable<System.DateTime> ExpectedDate { get; set; }
        public Nullable<int> RequestsTotal { get; set; }
        public bool ReqApproval { get; set; }
        public string RequestTypes { get; set; }
        public string RequestOpen { get; set; }
        public string TCMethod { get; set; }
        public Nullable<int> SequenceNo { get; set; }
        public int ExcludeAttorney { get; set; }
    }
}
