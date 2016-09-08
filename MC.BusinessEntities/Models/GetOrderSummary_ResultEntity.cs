using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models
{
    public class GetOrderSummary_ResultEntity
    {
        public string FullName { get; set; }
        public string HomePhone { get; set; }
        public string CellPhone { get; set; }
        public string Email { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string County { get; set; }
        public string Address { get; set; }
        public string Note { get; set; }
        public Nullable<decimal> LoanAmount { get; set; }
        public string ProviderContact { get; set; }
    }
}
