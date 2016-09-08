using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models.DTO
{
    public class RegisterDetail
    {
        public string InvitationCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string ContactId { get; set; }
        public string WebRoleId { get; set; }
        public string ResponseMessage { get; set; }
        public string PasswordResetUrl { get; set; }
        public string SmtpServerIP { get; set; }
        public int SmtpServerPort { get; set; }
        public string SmtpServerUsername { get; set; }
        public string SmtpServerPassword { get; set; }
        public EmailMessage EmailObject { get; set; }
        public int XRefId { get; set; }
        public string Suffix { get; set; }
        public int ClientId { get; set; }
        public int SequenceNo { get; set; }
    }
}
