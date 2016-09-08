using System;
using MC.BusinessEntities.Models.DTO;

namespace MC.BusinessServices.ClientPortal
{
    public interface IRegisterService
    {
        RegisterDetail RegisterClient(RegisterDetail request);
        int SendEmail(RegisterDetail request);
        PasswordResetDetail PasswordReset(int contactId, DateTime qsDateTime, int passwordResetTokenValidHours);
        RegisterDetail GetRegisterUserDetails(RegisterDetail request);
        int WebUserRolesUpdate(int contactId, int roleId);
        int EmailQueueInsert(string @from, string to, string subject, string body, string attachment);
    }
}
