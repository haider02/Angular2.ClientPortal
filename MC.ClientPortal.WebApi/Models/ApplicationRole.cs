using Microsoft.AspNet.Identity.EntityFramework;
using System;

namespace MC.ClientPortal.WebApi.Models
{
    public class ApplicationRole : IdentityRole<Int32, ApplicationUserRole>
    {
        #region properties

        public string Type { get; set; }

        public string PartyType { get; set; }

        #endregion

    }
}
