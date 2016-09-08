using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models
{
    public class DocumentTypesSelectAllByProdCat_ResultEntity
    {
        public int RowID { get; set; }        
        public string ProductCategory { get; set; }
        public string Description { get; set; }
        public string EvtCode { get; set; }
        public string DocCode { get; set; }
        public bool Uploads_DefaultClientViewable { get; set; }
        public bool Uploads_DefaultVendorViewable { get; set; }

    }
}
