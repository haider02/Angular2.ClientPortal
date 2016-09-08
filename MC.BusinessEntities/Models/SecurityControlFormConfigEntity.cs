using MC.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace MC.BusinessEntities.Models
{
    public class SecurityControlFormConfigEntity
    {
        [Required]
        public int SecurityFormControlConfigId { get; set; }
        [Required]
        public int SecurityFormControlId { get; set; }
        [Required]
        public int RoleId { get; set; }
        [Required]
        public bool IsVisible { get; set; }
        [Required]
        public bool IsEnabled { get; set; }
        [Required]
        public bool IsAuditEnabled { get; set; }
        [Required]
        public bool Inactive { get; set; }
        [StringLength(30)]
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        [StringLength(30)]
        public string LastModBy { get; set; }
        public Nullable<System.DateTime> LastModDate { get; set; }

        public virtual SecurityFormControl SecurityFormControl { get; set; }
    }
}
