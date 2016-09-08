using System.Collections.Generic;
using MC.BusinessEntities.Models;

namespace MC.BusinessServices
{
    /// <summary>
    /// Menu Service Contract
    /// </summary>
    public interface IMenuServices
    {
        IEnumerable<MenuEntity> GetAllMenu();
    }
}
