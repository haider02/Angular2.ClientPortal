using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models.DTO
{
    public class OrderTitleDTO
    {
        public string TitleOrderDate { get; set; }
        public string TitleExpectedDate { get; set; }
        public string TitleCompletionDate { get; set; }
        public string TitleEffectiveDate { get; set; }
        public string SignatureRequirement { get; set; }
        public string ProposedInsured { get; set; }
        public Nullable<int> NumberofOpenMortgages { get; set; }
        public Nullable<int> NumberofOpenJudgments { get; set; }
        public string Emails { get; set; }
        public Nullable<int> IsTitleBillRequestCompleteOrCancel { get; set; }
        public Nullable<int> ItemNo { get; set; }
    }
}
