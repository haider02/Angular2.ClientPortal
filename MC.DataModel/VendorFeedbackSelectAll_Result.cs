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
    
    public partial class VendorFeedbackSelectAll_Result
    {
        public int RowId { get; set; }
        public int VendorId { get; set; }
        public string EnteredBy { get; set; }
        public System.DateTime EnteredDate { get; set; }
        public int FeedbackTypeId { get; set; }
        public string FeedbackType { get; set; }
        public bool IsImpactRanking { get; set; }
        public int OrderNo { get; set; }
        public int CategoryId { get; set; }
        public string Category { get; set; }
        public int PartyId { get; set; }
        public string Party { get; set; }
        public System.DateTime FeedbackDate { get; set; }
        public string Comments { get; set; }
        public bool IsActionComplete { get; set; }
        public string ActionBy { get; set; }
        public Nullable<System.DateTime> ActionDate { get; set; }
        public string ActionTaken { get; set; }
        public string LastModBy { get; set; }
        public System.DateTime LastModDate { get; set; }
        public Nullable<int> SeverityId { get; set; }
        public string SeverityText { get; set; }
    }
}
