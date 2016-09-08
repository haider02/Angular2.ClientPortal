using MC.BusinessEntities.Models.DTO;
using System.Collections.Generic;

namespace MC.BusinessServices
{
    public interface IAccountServices
    {
        IEnumerable<object> GetAccountProfileData(int contactId);
        IEnumerable<RolePerimssionDTO> CpGetPermissionsAgainstRole(int roleId, string screenName);
        IEnumerable<object> GetAllWebRoles(string type, string partyType);
    }
}
