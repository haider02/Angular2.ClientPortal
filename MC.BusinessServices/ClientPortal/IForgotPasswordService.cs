using MC.BusinessEntities.Models.DTO;

namespace MC.BusinessServices.ClientPortal
{
    public interface IForgotPasswordService
    {
        ChangePasswordDetail ValidateUserEmail(string email);
        bool SendEmail(ChangePasswordDetail request);
    }
}
