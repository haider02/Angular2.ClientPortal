using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models
{
    public class WebRolesEntity
    {
        public int RoleID { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public string PartyType { get; set; }
    }
}
