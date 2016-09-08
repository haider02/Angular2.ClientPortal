using MC.BusinessEntities.Models;
using MC.BusinessEntities.Models.DTO;
using System.Collections.Generic;

namespace MC.BusinessServices.ClientPortal
{
    public interface ISecurityFormControlService
    {
        IEnumerable<SecurityFromControlGridDTO> CpGetSecurityFormControls(int applicationId);
        bool CreateUpdateSecurityFormControl(SecurityFormControlEntity securityFormControl);
        int DeleteSecurityFormControl(int securityFormControlId);
    }
}
