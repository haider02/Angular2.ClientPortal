using System.Collections.Generic;
using MC.BusinessEntities.Models.DTO;
using MC.DataModel.UnitOfWork;

namespace MC.BusinessServices.ClientPortal
{
    public class PreCloseService : IPreCloseService
    {
        private readonly UnitOfWork _unitOfWork;

        /// <summary>
        /// Public constructor.
        /// </summary>
        public PreCloseService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IEnumerable<object> GetSignatureRequirement(int orderNo)
        {
            return _unitOfWork.GetSignatureRequirement(orderNo);
        }

        public IEnumerable<object> GetPreCloseDetails(int orderNo)
        {
            return _unitOfWork.GetPreCloseDetails(orderNo);
        }

        public IEnumerable<object> GetPreCloseDocuments(int orderNo)
        {
            return _unitOfWork.GetPreCloseDocuments(orderNo);
        }

        public int SavePreCloseDetail(PreCloseDetailRequest request)
        {
            _unitOfWork.SavePreClose(request.OrderNo, request.UserName, request.Client, request.ScheduledCloseDate,
                            request.AnticipatedCloseDate, request.AnticipatedCloseBy);
            return 1;
        }
    }
}
