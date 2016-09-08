using System.Collections.Generic;
using MC.BusinessEntities.Models;

namespace MC.BusinessServices
{
    public interface ICountyServices
    {
        IEnumerable<CountyEntity> GetAllCounty();


        IEnumerable<CountyEntity> GetAllCountyByStateAbbr(string stateAbbr);

        IEnumerable<CountyEntity> GetAllCountyByStates(List<string> states);


        IEnumerable<StateCountyFromZipResultEntity> GetStateCountyFromZip(string zip);


    }
}
