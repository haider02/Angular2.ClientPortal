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
    
    public partial class GetStateCountyFromZip_Result
    {
        public string CityName { get; set; }
        public string StateAbbr { get; set; }
        public string CountyName { get; set; }
        public string CountyCode { get; set; }
        public Nullable<int> RateJurisdictionId { get; set; }
        public bool RefinancePrevAmtsNeeded { get; set; }
        public bool RefinanceOrigAmtsNeeded { get; set; }
    }
}