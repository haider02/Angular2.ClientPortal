using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models
{
    public class GetClientContactNames_ResultEntity
    {
        public int ContactId { get; set; }
        public string FullName { get; set; }
        public string ContactType { get; set; }
        public int XRefID { get; set; }
        public string Email { get; set; }
        public string Fax { get; set; }
        public DateTime LastModDate { get; set; }
        public bool Inactive { get; set; }
        public string Phone1 { get; set; }
    }
}
