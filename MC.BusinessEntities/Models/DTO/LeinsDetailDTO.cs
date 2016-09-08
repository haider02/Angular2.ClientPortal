using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models.DTO
{
    public class LeinsDetailDTO
    {
        public string Plaintiff { get; set; }
        public string Defendant { get; set; }
        public Nullable<System.DateTime> RecordedDate { get; set; }
        public decimal LienAmount { get; set; }
    }
}
