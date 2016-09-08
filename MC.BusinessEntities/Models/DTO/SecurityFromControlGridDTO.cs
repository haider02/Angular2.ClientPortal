using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models.DTO
{
    public class SecurityFromControlGridDTO
    {
        public int SecurityFormControlId { get; set; }
        public int SecurityControlId { get; set; }
        public int SecurityFormId { get; set; }
        public string SecurityFormControlName { get; set; }
        public string SecyrityControlType { get; set; }
        public string SecurityControlDesc { get; set; }
        public string SecurityFormName { get; set; }
        public string SecurityFormDesc { get; set; }
        public Nullable<int> ParentId { get; set; }
        public string ParentName { get; set; }
    }
}
