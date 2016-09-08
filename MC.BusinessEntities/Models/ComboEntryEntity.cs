using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models
{
    public class ComboEntryEntity
    {
        public string cboId { get; set; }
        public string cboEntry { get; set; }
        public string cboBehavior { get; set; }
        public int RowId { get; set; }
        public bool Internal { get; set; }
        public System.DateTime EnteredDate { get; set; }
        public string EnteredBy { get; set; }
        public byte[] SysTimeStamp { get; set; }

      

    }
}
