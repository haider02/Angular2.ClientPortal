using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace MC.BusinessEntities.Models.DTO
{
    public class DashBoardRequest
    {
        public int OrderNo { get; set; }
        [Required]
        public int ClientId { get; set; }
        public string Status { get; set; }
        public string LoanNo { get; set; }
        public string BorrowerName { get; set; }
        public string LoanOfficer { get; set; }
        public string TransactionType { get; set; }
        public int ClientFilterVal { get; set; }
        [Required]
        public bool ShowSubClients { get; set; }
        [Required]
        public int DefaultPastDays { get; set; }
    }
}
