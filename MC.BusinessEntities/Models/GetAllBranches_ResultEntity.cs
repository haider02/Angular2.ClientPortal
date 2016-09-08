using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models
{
    public class GetAllBranches_ResultEntity
    {
        public string Branch { get; set; }
        public int rowid { get; set; }
        public string BranchId { get; set; }
        public string BranchName { get; set; }
        public string Alias { get; set; }
    }
}
