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
    
    public partial class SecurityFormControlConfig
    {
        public int SecurityFormControlConfigId { get; set; }
        public int SecurityFormControlId { get; set; }
        public int RoleId { get; set; }
        public bool IsVisible { get; set; }
        public bool IsEnabled { get; set; }
        public bool IsAuditEnabled { get; set; }
        public bool Inactive { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public string LastModBy { get; set; }
        public Nullable<System.DateTime> LastModDate { get; set; }
    
        public virtual SecurityFormControl SecurityFormControl { get; set; }
    }
}
