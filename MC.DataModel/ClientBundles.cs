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
    
    public partial class ClientBundles
    {
        public int Rowid { get; set; }
        public string BranchId { get; set; }
        public int ClientId { get; set; }
        public int BundleID { get; set; }
        public bool Inactive { get; set; }
        public System.DateTime LastModDate { get; set; }
        public string LastModBy { get; set; }
        public byte[] SysTimeStamp { get; set; }
    
        public virtual Bundles Bundles { get; set; }
    }
}
