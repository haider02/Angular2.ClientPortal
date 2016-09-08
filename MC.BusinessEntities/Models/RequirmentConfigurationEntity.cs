using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models
{
    public class CfgRequirementEntity2
    {
        //DB columns
        public int RequirementID { get; set; }
        public int TypeID { get; set; }
        public string RequirementDescription { get; set; }
        public Nullable<int> DefaultCriteria { get; set; }
        public Nullable<bool> DefaultOnVendor { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }

        //Custom columns
        public int RowId { get; set; }
        public string ReqTypeDesc { get; set; }
        public int ReqTypeID { get; set; }
        public string RequirementDesc { get; set; }
        public int DefaultCriteriaID { get; set; }
        public string DefaultCriteriaDesc { get; set; } 

        //helpers for search request/custom request
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int StatusId { get; set; }

        //helpers for grid display
        public string CreatedDateString 
        {
            get { return ((DateTime)CreatedDate).ToString("mm/dd/yyyy"); } 
        
        }        
        public string Status
        {
            get { return (IsActive) ? "Active" : "InActive"; }
        }
    }
}
