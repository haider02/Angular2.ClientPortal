using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace MC.BusinessEntities.Models
{
    public class GetOrderDetailsEntity
    {
        [Required]
        public int OrderNo { get; set; }
        [Required]
        public string OrderSource { get; set; }
        public string LoanNo { get; set; }
        public string PropertyType { get; set; }
        public bool NonOwnerOccupied { get; set; }
        public Nullable<int> NumberofUnits { get; set; }
        public Nullable<System.DateTime> PropertyAcquiredDate { get; set; }
        public Nullable<int> LoanCategory { get; set; }
        public Nullable<decimal> LoanAmount { get; set; }
        public string LoanRate { get; set; }
        public string LoanProductType { get; set; }
        public string LoanTerm { get; set; }
        public string LoanPurpose { get; set; }
        public Nullable<System.DateTime> RateLockDate { get; set; }
        public Nullable<System.DateTime> AnticipatedSettlementDate { get; set; }
        public string EnteredBy { get; set; }
    }
}
