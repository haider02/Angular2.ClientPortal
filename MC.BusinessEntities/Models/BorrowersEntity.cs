using System;
using System.ComponentModel.DataAnnotations;

namespace MC.BusinessEntities.Models
{
    public class BorrowersEntity
    {
        public int BorrowerId { get; set; }        
        public Nullable<int> OrderNo { get; set; }
        [Required]
        public int SequenceNo { get; set; }
        public System.DateTime EnteredDate { get; set; }
        public string EnteredBy { get; set; }
        public string Type { get; set; }
        [Required]
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string Suffix { get; set; }
        public string SSN { get; set; }
        public string HomePhone { get; set; }
        public string WorkPhone { get; set; }
        public string CellPhone { get; set; }
        public string OtherPhone { get; set; }
        public string Email { get; set; }
        public Nullable<System.DateTime> DateOfBirth { get; set; }
        public string LastModBy { get; set; }
        public System.DateTime LastModDate { get; set; }
        public byte[] SysTimeStamp { get; set; }
        public string Password { get; set; }
        public Nullable<System.Guid> IntegrationUID { get; set; }
        public string FullName { get; set; }
        public string FullName2 { get; set; }
        public Nullable<int> MaritalStatusId { get; set; }
        public Nullable<int> CDFPartyID { get; set; }
    }
}
