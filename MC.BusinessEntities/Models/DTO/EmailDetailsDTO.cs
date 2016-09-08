using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace MC.BusinessEntities.Models.DTO
{
    public class EmailDetailsDTO
    {
        [Required]
        public string EmailToCSV { get; set; }
        [Required]
        public string EmailFrom { get; set; }
        [Required]
        public string Subject { get; set; }
        public string Body { get; set; }
        public string AttachmentsCSV { get; set; }
        public int    DocumentID { get; set; }
    }
}
