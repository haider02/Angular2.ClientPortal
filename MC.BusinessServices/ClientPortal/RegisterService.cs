using System;
using System.Net;
using System.Net.Mail;
using MC.BusinessEntities.Models.DTO;
using MC.DataModel.UnitOfWork;

namespace MC.BusinessServices.ClientPortal
{
    public class RegisterService : IRegisterService
    {
        private readonly UnitOfWork _unitOfWork;

        /// <summary>
        /// Public constructor.
        /// </summary>
        public RegisterService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public RegisterDetail RegisterClient(RegisterDetail request)
        {
            string responseMessage, passwordResetUrl, contactId, webRoleId;
            RegisterDetail response = new RegisterDetail();

            _unitOfWork.RegisterClient(request.InvitationCode, request.FirstName, request.LastName, request.Email, out responseMessage, out passwordResetUrl,
                                        out contactId, out webRoleId);

            response.InvitationCode = request.InvitationCode;
            response.FirstName = request.FirstName;
            response.LastName = request.LastName;
            response.Email = request.Email;
            response.ContactId = contactId;
            response.WebRoleId = webRoleId;
            response.ResponseMessage = responseMessage;            
            response.PasswordResetUrl = passwordResetUrl;
            response.SmtpServerIP = "";
            response.SmtpServerPort = 0;
            response.SmtpServerUsername = "";
            response.SmtpServerPassword = "";
            response.EmailObject = new EmailMessage();
            response.EmailObject.From = "";
            response.EmailObject.To = "";
            response.EmailObject.Subject = "";
            response.EmailObject.Body = "";
            return response;
        }

        public int SendEmail(RegisterDetail request)
        {
            var client = new SmtpClient(request.SmtpServerIP, request.SmtpServerPort)
            {
                Credentials = new NetworkCredential(request.SmtpServerUsername, request.SmtpServerPassword),
                EnableSsl = true,
                UseDefaultCredentials = false
            };
            client.Send(request.EmailObject.From, request.EmailObject.To, request.EmailObject.Subject, request.EmailObject.Body);

            return 1;
        }

        public PasswordResetDetail PasswordReset(int contactId, DateTime qsDateTime, int passwordResetTokenValidHours)
        {            
            DateTime dtCurrentDateTime = DateTime.Now;
            PasswordResetDetail response = new PasswordResetDetail();
            if (dtCurrentDateTime > qsDateTime.AddHours(passwordResetTokenValidHours))
            {
                response.Message = "The account activation request has Expired. Please request again to receive a new URL via email.";
                response.isSuccess = false;
                response.ContactId = "";
                return response;
            }

            _unitOfWork.ContactsSetRequireUserToChangePassword(contactId, true);
            response.Message = "";
            response.isSuccess = true;
            response.ContactId = contactId.ToString();
            return response;
        }

        public RegisterDetail GetRegisterUserDetails(RegisterDetail request)
        {
            int clientId , webRoleId , sequenceNo , webContactId ;
            RegisterDetail response = new RegisterDetail();

            request.Suffix = "CM";
            _unitOfWork.GetRegisterUserDetails(request.InvitationCode, request.XRefId, request.Suffix, out clientId, out webRoleId, out sequenceNo, out webContactId);

            response.ClientId = clientId;
            response.WebRoleId = webRoleId.ToString();
            response.SequenceNo = sequenceNo;
            response.ContactId = webContactId.ToString();
            return response;
        }

        public int WebUserRolesUpdate(int contactId, int roleId)
        {
            return _unitOfWork.WebUserRolesUpdate(contactId, roleId);
        }

        public int EmailQueueInsert(string @from, string to, string subject, string body, string attachment)
        {
            return _unitOfWork.EmailQueueInsert(@from, to, subject, body, attachment);
        }
    }
}
