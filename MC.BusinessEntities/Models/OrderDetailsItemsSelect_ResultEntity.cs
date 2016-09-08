using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models
{
    public class OrderDetailsItemsSelect_ResultEntity
    {
        public string AdditionalInfo { get; set; }
        public int ItemNo { get; set; }
        public string ProductCode { get; set; }
        public string ProductCategory { get; set; }
        public Nullable<int> LoanCategory { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string BranchId { get; set; }
        public bool Lockout { get; set; }
        public bool Recording { get; set; }
        public bool RecordingRequired { get; set; }
        public bool Alta { get; set; }
        public string ClientRefNo { get; set; }
        public bool COD { get; set; }
        public Nullable<bool> HasPiggyBack { get; set; }
        public Nullable<int> ClientBundleID { get; set; }
        public string ItemDescription { get; set; }
        public string DisburseDate { get; set; }
        public string Processor { get; set; }
        public string AssignedTitleOps { get; set; }
        public string AssignedClosing { get; set; }
        public string AssignedTitleRec { get; set; }
        public string AssignedTyping { get; set; }
        public string AssignedTC { get; set; }
        public string AssignedTaxes { get; set; }
        public string AssignedAppraisal { get; set; }
        public bool isClosingCollaborationRequest { get; set; }
    }
}
