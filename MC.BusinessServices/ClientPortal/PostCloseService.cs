using System.Collections.Generic;
using MC.DataModel.UnitOfWork;

namespace MC.BusinessServices.ClientPortal
{
    public class PostCloseService : IPostCloseService
    {
        private readonly UnitOfWork _unitOfWork;

        /// <summary>
        /// Public constructor.
        /// </summary>
        public PostCloseService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        
        public IEnumerable<object> GetRecordingDetails(int orderNo)
        {
            return _unitOfWork.GetRecordingDetails(orderNo);
        }

        public IEnumerable<object> GetLoanPolicyDetails(int orderNo)
        {
            return _unitOfWork.GetLoanPolicyDetails(orderNo);
        }

        public IEnumerable<object> GetPostCloseDocuments(int orderNo)
        {
            return _unitOfWork.GetPostCloseDocuments(orderNo);
        }
    }
}
