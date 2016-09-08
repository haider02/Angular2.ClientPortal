using MC.BusinessEntities.Models.DTO;
using MC.DataModel.UnitOfWork;

namespace MC.BusinessServices.ClientPortal
{
    public class ForgotPasswordService : IForgotPasswordService
    {
        private readonly UnitOfWork _unitOfWork;

        public ForgotPasswordService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public ChangePasswordDetail ValidateUserEmail(string email)
        {
            ChangePasswordDetail response = new ChangePasswordDetail();
            string contactId;
            response.isSuccess = _unitOfWork.ValidateUserEmail(email,out contactId);
            response.Email = email;
            response.ContactId = contactId;
            
            return response;
        }

        public bool SendEmail(ChangePasswordDetail request)
        {
            int id = _unitOfWork.EmailQueueInsert(request.EmailObject.From, request.EmailObject.To, request.EmailObject.Subject, request.EmailObject.Body, null);
            if(id> 0)
                 return true;
            else 
                 return  false;

        }

    }
}
