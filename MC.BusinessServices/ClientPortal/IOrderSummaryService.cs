using System.Collections.Generic;
using MC.BusinessEntities.Models;

namespace MC.BusinessServices.ClientPortal
{
    public interface IOrderSummaryService
    {
        string GetProductCodeByOrder(int orderNo);
        IEnumerable<object> GetMileStoneTracker(int orderNo, string productCode);
        IEnumerable<object> GetCheckList(int orderNo, string productCode);

        List<GetOrderHeader_ResultEntity> CpOrderHeader(int orderNo);
        int SaveOrderStatus(int orderNo);
    }
}
