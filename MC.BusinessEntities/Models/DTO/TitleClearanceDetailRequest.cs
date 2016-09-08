using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace MC.BusinessEntities.Models.DTO
{
    public class TitleClearanceDetailRequest
    {
        [Required]
        public int OrderNo { get; set; }

        public string ClearedBy { get; set; }
        public string FileClearanceRequestedBy { get; set; }
        public Nullable<int> TCD_RowId { get; set; }
        public string AssignedTitleOps { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}
