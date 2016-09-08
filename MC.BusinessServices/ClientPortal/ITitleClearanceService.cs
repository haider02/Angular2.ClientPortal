using System.Collections.Generic;
using MC.BusinessEntities.Models.DTO;

namespace MC.BusinessServices.ClientPortal
{
    public interface ITitleClearanceService
    {
        IEnumerable<object> GetClearanceItems(int orderNo);
        int SaveNewYorkAttorneyItem(TitleClearanceDetailRequest request);
        int SaveFileClearanceRequested(TitleClearanceDetailRequest request);
        IEnumerable<object> GetTcCleartoCloseDetail(int orderNo);
        IEnumerable<object> TcRequestQuestionsAnswered(int orderNo, string requestType);
    }
}
