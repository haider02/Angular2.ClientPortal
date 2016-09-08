using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models.DTO
{
    public class AccountProfileDTO
    {
        public GetCompanyDetails_Entity CompanyDetails { get; set; }

        public GetClientDetails_Entity ClientDetails { get; set; }
    }
}
