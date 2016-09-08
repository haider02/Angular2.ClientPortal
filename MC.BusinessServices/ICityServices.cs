using System.Collections.Generic;
using MC.BusinessEntities.Models;

namespace MC.BusinessServices
{
    public interface  ICityServices
    {
        IEnumerable<CityEntity> GetAllCityByStates(string stateAbbr);

        IEnumerable<CityEntity> GetAll();
    }
}
