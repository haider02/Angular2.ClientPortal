using System;

namespace MC.BusinessEntities.Models
{
    public class NotesEntity
    {
        public int NoteId { get; set; }
        public int XRefId { get; set; }
        public string Suffix { get; set; }
        public string NoteType { get; set; }
        public string Note { get; set; }
        public bool ClientViewable { get; set; }
        public bool VendorViewable { get; set; }
        public string SentTo { get; set; }
        public bool Priority { get; set; }
        public System.DateTime LastModDate { get; set; }
        public string LastModBy { get; set; }
        public byte[] SysTimeStamp { get; set; }
        public Nullable<bool> Inactive { get; set; }
    }
}
