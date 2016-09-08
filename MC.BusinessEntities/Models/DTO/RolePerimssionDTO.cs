using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models.DTO
{
    public class RolePerimssionDTO
    {
        public int RoleId { get; set; }
        public string frmName { get; set; }
        public string CtrlName { get; set; }
        public string CtrlType { get; set; }
        public bool IsVisible { get; set; }
        public bool IsEnabled { get; set; }
        public string Parent { get; set; }
    }
}
