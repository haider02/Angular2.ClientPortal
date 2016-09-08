using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace MC.BusinessEntities.Models.DTO
{
    public class OrderEntryDetailRequest
    {
        [Required]
        public string OrderSource { get; set; }        
        public string OrderOrigination { get; set; }
        [Required]
        public string EnteredBy { get; set; }
        [Required]
        public int ClientId { get; set; }        
        public bool HaveAddress { get; set; }
        public bool HaveZip { get; set; }
        public string PropertyType { get; set; }
        public string StreetNo { get; set; }
        public string StreetName { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string County { get; set; }
        public string LoanNo { get; set; }
        public Nullable<decimal> LoanAmount { get; set; }
        public string LoanType { get; set; }
        public string Note { get; set; }
        [Required]
        public string ContactType { get; set; }
        [Required]
        public string ContactName { get; set; }
        [Required]
        public List<OrderDetailEntity> TransactionTypeList { get; set; }
        [Required]
        public List<BorrowersEntity> BorrowerList { get; set; }
    }
}
