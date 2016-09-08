using System.Collections.Generic;
using MC.BusinessEntities.Models;
using MC.BusinessEntities.Models.DTO;
using System.Data;

namespace MC.BusinessServices.ClientPortal
{
    public interface IOrderTitleService
    {
        IEnumerable<OrderTitleDTO> CpGetOrderTitleDetail(int orderNo);
        int CpAddTitleBillReqEvent(int orderNo);
        int CpAddTitleProduct(int orderNo);
        IEnumerable<DocumentsSelectAll_ResultEntity> CpGetTitleDocumentsSelectAll(int orderNo);
        IEnumerable<LeinsDetailDTO> CpGetLeinsDetail(int orderNo);
    }
}
