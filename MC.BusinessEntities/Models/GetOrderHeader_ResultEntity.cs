using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models
{
    public class GetOrderHeader_ResultEntity
    {
        public int OrderNo { get; set; }
        public string LoanNo { get; set; }
        public decimal LoanAmount { get; set; }
        public string OrderStatus { get; set; }
        public string Address { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string HomePhone { get; set; }
        public string CellPhone { get; set; }
        public string Note { get; set; }
        public string ProviderContact { get; set; }
    }
}
