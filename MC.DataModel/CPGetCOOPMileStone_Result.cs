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
    
    public partial class CPGetCOOPMileStone_Result
    {
        public int OrderNo { get; set; }
        public string ProductCode { get; set; }
        public Nullable<System.DateTime> Opened { get; set; }
        public int LienSearchExists { get; set; }
        public Nullable<System.DateTime> LienSearch { get; set; }
        public int UCC1RequestedExists { get; set; }
        public Nullable<System.DateTime> UCC1Requested { get; set; }
        public int UCC1RecordedExists { get; set; }
        public Nullable<System.DateTime> UCC1Recorded { get; set; }
        public int UCC3RequestedExists { get; set; }
        public Nullable<System.DateTime> UCC3Requested { get; set; }
        public int UCC3RecordedExists { get; set; }
        public Nullable<System.DateTime> UCC3Recorded { get; set; }
    }
}
