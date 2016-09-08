using System.Collections.Generic;
using MC.BusinessEntities.Models;
using MC.BusinessEntities.Models.DTO;

namespace MC.BusinessServices.ClientPortal
{
    public interface IOrderDetailService
    {
        List<GetMaritalStatus_ResultEntity> GetMaritalStatus();
        void SaveOrderDetail(OrderDetailRequestDTO request);
        GetOrderDetailsEntity GetOrderDetails(string orderNumber);
        IEnumerable<GetOrderPartyDetailsEntity> GetOrderPartyDetails(string orderNumber);
    }
}
