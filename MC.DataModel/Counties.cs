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
    using System.Collections.Generic;
    
    public partial class Counties
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Counties()
        {
            this.OrderMaster = new HashSet<OrderMaster>();
        }
    
        public string StateAbbr { get; set; }
        public string CountyCode { get; set; }
        public string CountyName { get; set; }
        public Nullable<int> AppraisalArea { get; set; }
        public Nullable<int> TitleArea { get; set; }
        public Nullable<int> ClosingArea { get; set; }
        public Nullable<decimal> DeedPrepAmt { get; set; }
        public Nullable<decimal> SubPrepAmt { get; set; }
        public Nullable<decimal> SatPrepAmt { get; set; }
        public Nullable<decimal> OtherPrepAmt { get; set; }
        public Nullable<decimal> MortBaseAmt { get; set; }
        public Nullable<int> MortBasePages { get; set; }
        public Nullable<decimal> MortXtraAmt1 { get; set; }
        public Nullable<decimal> MortXtraAmt2 { get; set; }
        public Nullable<decimal> DeedBaseAmt { get; set; }
        public Nullable<int> DeedBasePages { get; set; }
        public Nullable<decimal> DeedXtraAmt1 { get; set; }
        public Nullable<decimal> DeedXtraAmt2 { get; set; }
        public Nullable<decimal> TransTaxAmt1 { get; set; }
        public Nullable<decimal> TransTaxAmt2 { get; set; }
        public string MortTax { get; set; }
        public Nullable<int> RateJurisdictionID { get; set; }
        public string OtherTax { get; set; }
        public string TitleEscrowTemplate { get; set; }
        public bool IsSimplifile { get; set; }
        public bool IsDeed { get; set; }
        public bool IsMtg_DOT { get; set; }
        public bool IsSub { get; set; }
        public bool IsRelease { get; set; }
        public bool IsAssignment { get; set; }
        public bool IsPOA { get; set; }
        public bool IsModification { get; set; }
        public string ERecordingSite { get; set; }
        public Nullable<bool> ClosingLocRestriction { get; set; }
        public string StateCountyCode { get; set; }
        public string CountySpecificInstructions { get; set; }
    
        public virtual States States { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<OrderMaster> OrderMaster { get; set; }
    }
}
