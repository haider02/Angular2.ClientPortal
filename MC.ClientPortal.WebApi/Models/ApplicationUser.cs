using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;
using System;

namespace MC.ClientPortal.WebApi.Models
{    
    public class ApplicationUser : IdentityUser<Int32, ApplicationUserLogin, ApplicationUserRole, ApplicationUserClaim>
    {
        #region properties
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Suffix { get; set; }
        public string ContactType { get; set; }
        public DateTime LastModDate { get; set; }
        public string LastModBy { get; set; }        
        public Int32 XRefId { get; set; }    
        public Int32 SequenceNo { get; set; }
        public string MiddleInit { get; set; }
        public string Generation { get; set; }
        public string FullName { get; set; }        
        public string Phone2 { get; set; }
        public string Fax { get; set; }
        public string Mobile { get; set; }
        public string Pager { get; set; }        
        public string WebSite { get; set; }
        public string EOInsurance { get; set; }
        public Nullable<DateTime> EOExpiration { get; set; }
        public string MPInsurance { get; set; }
        public Nullable<DateTime> MPExpiration { get; set; }
        public string LicenseNo { get; set; }
        public Nullable<DateTime> LicenseExpiration { get; set; }
        public Nullable<DateTime> WrkSampReceived { get; set; }
        public Nullable<DateTime> WrkSampApproved { get; set; }
        public Nullable<DateTime> WrkSampExpiration { get; set; }
        public bool FHAApproved { get; set; }
        public string FHANo { get; set; }
        public bool AppStateCertified { get; set; }            
        public string Password { get; set; }        
        public Nullable<DateTime> BackgroundCheckReceived { get; set; }
        public Nullable<DateTime> BackgroundCheckExpiration { get; set; }
        public Nullable<DateTime> LastLoginDate { get; set; }
        public Nullable<Int32> LoginCount { get; set; }
        public Nullable<Int32> TitleTeam { get; set; }
        public Nullable<Int32> AppraisalTeam { get; set; }
        public Nullable<Int32> ClosingTeam { get; set; }
        public string MailStop { get; set; }
        public bool ChangePasswordRequired { get; set; }
        public Nullable<Int32> SecretQuestionId { get; set; }
        public string SecretAnswer { get; set; }        
        public Nullable<DateTime> PasswordLastChanged { get; set; }
        public Nullable<bool> TitleProducer { get; set; }
        public Nullable<bool> TitleProducerNA { get; set; }
        public string TitleProducerLicenseNo { get; set; }
        public Nullable<DateTime> TitleProducerLicenseExpiration { get; set; }
        public Nullable<DateTime> AcceptedTerms { get; set; }
        public bool Inactive { get; set; }
        public Nullable<bool> DoNotContact { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public Nullable<DateTime> EliminatedDate { get; set; }
        public string City { get; set; }
        public Nullable<bool> isMultiLingual { get; set; }
        public string Address { get; set; }
        public string CountyID { get; set; }
        public string StateID { get; set; }
        public string ZipCode { get; set; }
        public bool IsNYAttorneyPortalUser { get; set; }
        
        
            #endregion

        #region methods

        public ApplicationUser()            
        {
            //this.PhoneNumberConfirmed = false;
        }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(ApplicationUserManager userManager, string authenticationType)
        {
            var userIdentity = await userManager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }

        #endregion
    }
}
