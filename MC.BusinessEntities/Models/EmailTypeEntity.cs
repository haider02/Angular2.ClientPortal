using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models
{
    public class EmailTypeEntity
    {
        public int RowId { get; set; }
        public string EmailName { get; set; }
        public string FromEmailType { get; set; }
        public string FromEmailOther { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public string LastModBy { get; set; }
        public Nullable<System.DateTime> LastModDate { get; set; }
        public bool IsActive { get; set; }
    }
}
