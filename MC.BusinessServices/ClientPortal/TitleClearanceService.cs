using System.Collections.Generic;
using MC.BusinessEntities.Models.DTO;
using MC.DataModel.UnitOfWork;

namespace MC.BusinessServices.ClientPortal
{
    public class TitleClearanceService : ITitleClearanceService
    {
        private readonly UnitOfWork _unitOfWork;

        /// <summary>
        /// Public constructor.
        /// </summary>
        public TitleClearanceService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IEnumerable<object> GetClearanceItems(int orderNo)
        {
            return _unitOfWork.GetClearanceItems(orderNo);
        }
        
        public int SaveNewYorkAttorneyItem(TitleClearanceDetailRequest request)
        {
            _unitOfWork.SaveNewYorkAttorneyItem(request.OrderNo, request.ClearedBy, request.TCD_RowId);
            return 1;
        }

        public int SaveFileClearanceRequested(TitleClearanceDetailRequest request)
        {
            _unitOfWork.SaveFileClearanceRequested(request.OrderNo, request.FileClearanceRequestedBy, request.From, 
                                request.To, request.Subject, request.Body);
            return 1;
        }

        public IEnumerable<object> GetTcCleartoCloseDetail(int orderNo)
        {
            return _unitOfWork.GetTCCleartoCloseDetail(orderNo);
        }

        public IEnumerable<object> TcRequestQuestionsAnswered(int orderNo, string requestType)
        {
            return _unitOfWork.TCRequestQuestionsAnswered(orderNo, requestType);
        }
    }
}
