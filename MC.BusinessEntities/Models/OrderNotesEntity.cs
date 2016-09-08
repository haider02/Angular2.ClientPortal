using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models
{
    public class OrderNotesEntity
    {
        public Nullable<int> NoteId { get; set; }
        public int OrderNo { get; set; }
        public Nullable<int> ItemNo { get; set; }
        public Nullable<int> Xref_RowId { get; set; }
        public string Suffix { get; set; }
        public string NoteSource { get; set; }
        public Nullable<int> EventId { get; set; }
        public string NoteType { get; set; }
        public string Note { get; set; }
        public string SentTo { get; set; }
        public Nullable<bool> Priority { get; set; }
        public Nullable<bool> ClientViewable { get; set; }
        public Nullable<bool> VendorViewable { get; set; }
        public Nullable<bool> BorrowerViewable { get; set; }
        public Nullable<bool> ClientActionReq { get; set; }
        public Nullable<System.DateTime> LastModDate { get; set; }
        public string LastModBy { get; set; }
        public byte[] SysTimeStamp { get; set; }
        public Nullable<bool> Inactive { get; set; }
    }
}
