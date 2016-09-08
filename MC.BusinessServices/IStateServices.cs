using System.Collections.Generic;
using MC.BusinessEntities.Models;


namespace MC.BusinessServices
{
    public interface IStateServices
    {

        IEnumerable<StatesEntity> GetAllStates();

    }
}
