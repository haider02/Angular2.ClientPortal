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
    
    public partial class SecurityControl
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public SecurityControl()
        {
            this.SecurityFormControl = new HashSet<SecurityFormControl>();
        }
    
        public int SecurityControlId { get; set; }
        public string ControlType { get; set; }
        public string Description { get; set; }
        public bool Inactive { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public string LastModBy { get; set; }
        public Nullable<System.DateTime> LastModDate { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SecurityFormControl> SecurityFormControl { get; set; }
    }
}
