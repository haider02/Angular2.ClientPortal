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
    
    public partial class BundleDetails
    {
        public int BundleDetailID { get; set; }
        public int BundleID { get; set; }
        public string ProductCode { get; set; }
        public decimal StandardPrice { get; set; }
        public decimal DiscountPrice { get; set; }
        public decimal DiscountPct { get; set; }
    
        public virtual Bundles Bundles { get; set; }
    }
}