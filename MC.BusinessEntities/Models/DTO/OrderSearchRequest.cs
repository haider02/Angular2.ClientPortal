using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models.DTO
{
    public class OrderSearchRequest
    {
        public int MinOrderNo { get; set; }
        public int MaxOrderNo { get; set; }
        public int ClientId { get; set; }
        public string Status { get; set; }
        public string LoanNo { get; set; }
        public string AssignedUser { get; set; }
        public DateTime DisbursedDate { get; set; }
        public string BorrowerName { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string ProductCode { get; set; }
        public bool Appraisal { get; set; }
        public bool Title { get; set; }
        public bool Closing { get; set; }
        public bool Other { get; set; }
        public string LoanOfficer { get; set; }
        public string TransactionType { get; set; }
        public int ShowAllClients { get; set; }
        public int ShowAllChildrens { get; set; }
        public int IsDefaultView { get; set; }
    }
}
