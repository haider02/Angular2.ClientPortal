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
    
    public partial class CPGetSecurityFormControlsConfig_Result
    {
        public int SecurityFormControlId { get; set; }
        public int SecurityControlId { get; set; }
        public int SecurityFormId { get; set; }
        public string SecurityFormControlName { get; set; }
        public string SecyrityControlType { get; set; }
        public string SecurityControlDesc { get; set; }
        public string SecurityFormName { get; set; }
        public string SecurityFormDesc { get; set; }
        public Nullable<int> ParentId { get; set; }
        public bool IsEnabled { get; set; }
        public bool IsVisible { get; set; }
        public int SecurityFormControlConfigId { get; set; }
        public int RoleId { get; set; }
        public string RoleDescription { get; set; }
    }
}
