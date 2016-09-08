using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models.DTO
{
    public class PasswordResetDetail
    {
        public string ContactId { get; set; }
        public bool isSuccess { get; set; }
        public string Message { get; set; }
        public string Email { get; set; }
        public string Originator { get; set; }
    }
}
