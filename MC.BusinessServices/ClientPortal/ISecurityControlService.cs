using System.Collections.Generic;
using MC.BusinessEntities.Models;

namespace MC.BusinessServices.ClientPortal
{
    public interface ISecurityControlService
    {
        int DeleteSecurityControl(int securityControlId);
        bool CreateUpdateSecurityControl(SecurityControlEntity securityControlEntity);
        IEnumerable<SecurityControlEntity> GetAllSecurityControls();
    }
}
