using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models
{
    public class CityEntity
    {
        public string ZipCode { get; set; }
        public string City { get; set; }
        public string CityType { get; set; }
        public string StateAbbr { get; set; }
        public Nullable<int> RateJurisdictionID { get; set; }



    }
}
