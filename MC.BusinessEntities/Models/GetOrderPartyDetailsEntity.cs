using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace MC.BusinessEntities.Models
{
    public class GetOrderPartyDetailsEntity
    {
        [Required]
        public int BorrowerId { get; set; }
        [Required]
        public Nullable<int> OrderNo { get; set; }
        
        public int SequenceNo { get; set; }
        public System.DateTime EnteredDate { get; set; }
        public string EnteredBy { get; set; }
        [Required]
        public string Type { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string SSN { get; set; }
        public string HomePhone { get; set; }
        public string CellPhone { get; set; }
        public string Email { get; set; }
        public string LastModBy { get; set; }
        public System.DateTime LastModDate { get; set; }
        public string FullName { get; set; }
        public Nullable<int> MaritalStatusId { get; set; }
        public string MaritalStatusText { get; set; }
    }
}
