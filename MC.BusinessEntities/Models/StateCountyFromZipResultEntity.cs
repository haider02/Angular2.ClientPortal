using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models
{
    public class StateCountyFromZipResultEntity
    {
       public string CityName { get; set; }
       public string StateAbbr { get; set; }
       public string CountyName { get; set; }
       public string CountyCode { get; set; }
       public int RateJurisdictionId { get; set; }

       public bool RefinancePrevAmtsNeeded { get; set; }

       public bool RefinanceOrigAmtsNeeded { get; set; }

    }
}
