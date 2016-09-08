using MC.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace MC.BusinessEntities.Models
{
    public class SecurityFormControlEntity
    {
        [Required]
        public int SecurityFormControlId { get; set; }
        [Required]
        public int SecurityFormId { get; set; }
        [Required]
        [StringLength(50)]
        public string Name { get; set; }
        [Required]
        public int SecurityControlId { get; set; }
        public Nullable<int> ParentId { get; set; }
        [Required]
        public bool Inactive { get; set; }
        [StringLength(30)]
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        [StringLength(30)]
        public string LastModBy { get; set; }
        public Nullable<System.DateTime> LastModDate { get; set; }

        public virtual SecurityControl SecurityControl { get; set; }
        public virtual SecurityForm SecurityForm { get; set; }
    }
}
