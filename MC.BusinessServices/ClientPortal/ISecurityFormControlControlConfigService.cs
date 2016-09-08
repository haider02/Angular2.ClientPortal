using MC.BusinessEntities.Models;
using MC.BusinessEntities.Models.DTO;
using System.Collections.Generic;

namespace MC.BusinessServices.ClientPortal
{
    public interface ISecurityFormControlControlConfigService
    {
        IEnumerable<SecurityFormControlConfigGridDTO> CpGetSecurityFormControlsConfig(int applicationId);
        bool CreateUpdateSecurityFormControlConfig(SecurityControlFormConfigEntity securityControlFormConfigEntity);

        int DeleteSecurityControlConfig(int securityControlConfigId);
    }
}
