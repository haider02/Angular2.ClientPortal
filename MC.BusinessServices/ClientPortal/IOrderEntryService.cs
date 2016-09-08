using System.Collections.Generic;
using MC.BusinessEntities.Models;
using MC.BusinessEntities.Models.DTO;

namespace MC.BusinessServices.ClientPortal
{
    public interface IOrderEntryService
    {
        List<GetClientTransactionTypes_ResultEntity> GetClientTransactionTypes(int clientId);
        List<GetClientContactNames_ResultEntity> GetClientContactNames(int clientId, string suffix, bool isShowMultiLevels);
        List<GetMaritalStatus_ResultEntity> GetMaritalStatus();
        int SaveOrderEntry(OrderEntryDetailRequest request);
    }
}
