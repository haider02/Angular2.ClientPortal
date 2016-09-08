using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models
{
    public class OrderSearchResultEntity
    {
        public string BorrowerName { get; set; }
        public string LoanNo { get; set; }
        public int OrderNo { get; set; }
        public System.DateTime OrderDate { get; set; }
        public string OrderedBy { get; set; }
        public string CloseDate { get; set; }
        public string ClosedBy { get; set; }
        public string OrderStatus { get; set; }
        public string OrderReceived { get; set; }
        public string TitleComplete { get; set; }
        public string CleartoClose { get; set; }
        public string PostClosetoComplete { get; set; }
        public string Completed { get; set; }
        public int IsCustomCss { get; set; }
        public string CustomCssName { get; set; }
        public string ClientName { get; set; }
        public string LoanOfficer { get; set; }
        public string ProductType { get; set; }
    }
}
