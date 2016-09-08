using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models
{
    public class GetCompanyDetails_Entity
    {
        public string Name { get; set; }
        public string Line1 { get; set; }
        public string Line2 { get; set; }
        public string city { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string MainContact { get; set; }
    }
}
