using System;
namespace MC.BusinessEntities.Models
{
    public class UserEntity
    {
        /*public int UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }*/


        public string UserId1 { get; set; }
        public Nullable<int> EmployeeID { get; set; }
        public string Password { get; set; }
        public bool SysAdmin { get; set; }
        public string Extension { get; set; }
        public bool Inactive { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string FullName { get; set; }
        public string Alias { get; set; }
        public string LastName2 { get; set; }
        public string Email { get; set; }
        public string BranchId { get; set; }
        public string Department { get; set; }
        public int ManagerNo { get; set; }
        public string FaxServer { get; set; }
        public string EmailMethod { get; set; }
        public string SMTPServer { get; set; }
        public string FaxNumber { get; set; }
        public bool AccountRep { get; set; }
        public Nullable<System.DateTime> LastLogin { get; set; }
        public int LoginCount { get; set; }
        public System.DateTime LastModDate { get; set; }
        public string LastModBy { get; set; }
        public byte[] SysTimeStamp { get; set; }
        public bool Employee { get; set; }
        public Nullable<System.Guid> uidUser { get; set; }
        public string txtHUDPermissions { get; set; }
        public Nullable<bool> flgTemplate { get; set; }
        public string txtAcctPermissions { get; set; }
        public Nullable<int> cdeAppServer { get; set; }
        public string FullNameCalc { get; set; }
        public decimal tsApprovalLimit { get; set; }
        public Nullable<bool> RRAccept { get; set; }
        public Nullable<int> RRMaxOrders { get; set; }
        public Nullable<System.DateTime> RRStartTime { get; set; }
        public Nullable<System.DateTime> RREndTime { get; set; }
        public string CellPhone { get; set; }
    }
}
