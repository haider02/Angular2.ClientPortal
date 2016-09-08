using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models.DTO
{
    public class OrderDetailDTO
    {
        public int RowId { get; set; }
        public int OrderNo { get; set; }
        public int ItemNo { get; set; }
        public string ProductCategory { get; set; }
        public string ProductCode { get; set; }
    }
}
