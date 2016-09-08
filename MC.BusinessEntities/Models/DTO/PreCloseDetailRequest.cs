using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace MC.BusinessEntities.Models.DTO
{
    public class PreCloseDetailRequest
    {
        [Required]
        public int OrderNo { get; set; }

        public string SignatureRequirements { get; set; }
        public string Status { get; set; }
        public DateTime ScheduledCloseDate { get; set; }
        public string CloserName { get; set; }

        [Required]
        public string UserName { get; set; }
        [Required]
        public string Client { get; set; }
        public DateTime AnticipatedCloseDate { get; set; }
        public string AnticipatedCloseBy { get; set; }
    }
}
