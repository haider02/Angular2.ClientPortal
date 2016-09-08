using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Common
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
    public class AuditableAttribute : Attribute
    {

        #region Constructors

        public AuditableAttribute()
            : base()
        { 
        }

        public AuditableAttribute(string description)
            : this()
        {
            Description = description;
        }

        #endregion

        public string Description { get; set; }  

        public string PrimaryKey { get; set; }

        public int SortOrder { get; set; }

    }
}
