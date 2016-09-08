using System.Collections.Generic;
using MC.BusinessEntities.Models;
using MC.BusinessEntities.Models.DTO;

namespace MC.BusinessServices.ClientPortal
{
    public interface IDashBoardService
    {
        List<GetClientList_ResultEntity> GetClientList(int parentId);
        IEnumerable<OrderSearchResultEntity> GetDashBoardOrderSearch(DashBoardRequest request);
        List<GetOrderSummary_ResultEntity> GetOrderSummary(int orderNo);
        IEnumerable<object> OrderDetailsItemsSelect(int orderNo, bool titleOnly, bool closingOnly);
    }
}
