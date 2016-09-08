using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace MC.BusinessEntities.Models
{
    public class SecurityControlEntity
    {
        [Required]
        public int SecurityControlId { get; set; }
        [Required]
        [StringLength(50)]
        public string ControlType { get; set; }
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
