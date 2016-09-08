using MC.BusinessEntities.Models;
using System.Collections.Generic;


namespace MC.BusinessServices.ClientPortal
{
    public interface ISecurityFormService
    {
        int DeleteSecurityControl(int securityControlId);
        bool CreateUpdateSecurityForm(SecurityFormEntity securityForm);
        IEnumerable<SecurityFormEntity> GetAllSecurityForms();
    }
}
