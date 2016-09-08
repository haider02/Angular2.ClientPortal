using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models.DTO
{
    public class ChangePasswordDetail
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmNewPassword { get; set; }
        public string SecurityCode { get; set; }
        public int QuestionID { get; set; }
        public string Answer { get; set; }
        public string Email { get; set; }
        public string ContactId { get; set; }
        public bool isSuccess { get; set; }
        //public string WebRoleId { get; set; }
        //public string ResponseMessage { get; set; }
        public string SmtpServerIP { get; set; }
        public int SmtpServerPort { get; set; }
        public string SmtpServerUsername { get; set; }
        public string SmtpServerPassword { get; set; }
        public EmailMessage EmailObject { get; set; }
        public string PasswordResetUrl { get; set; }
    }
}
