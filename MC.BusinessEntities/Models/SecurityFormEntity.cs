using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace MC.BusinessEntities.Models
{
    public class SecurityFormEntity
    {
        [Required]
        public int SecurityFormId { get; set; }
        [Required]
        public int ApplicationId { get; set; }
        [Required]
        [StringLength(50)]
        public string Name { get; set; }
        [Required]
        [StringLength(500)]
        public string Description { get; set; }
        [Required]
        public bool Inactive { get; set; }
        [StringLength(30)]
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        [StringLength(30)]
        public string LastModBy { get; set; }
        public Nullable<System.DateTime> LastModDate { get; set; }
    }
}
