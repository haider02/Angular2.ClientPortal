using System.Collections.Generic;
using MC.BusinessEntities.Models.DTO;

namespace MC.BusinessServices.ClientPortal
{
    public interface IPreCloseService
    {
        IEnumerable<object> GetSignatureRequirement(int orderNo);
        IEnumerable<object> GetPreCloseDetails(int orderNo);
        IEnumerable<object> GetPreCloseDocuments(int orderNo);
        int SavePreCloseDetail(PreCloseDetailRequest request);
    }
}
