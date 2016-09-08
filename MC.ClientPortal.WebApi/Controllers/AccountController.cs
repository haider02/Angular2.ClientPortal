using System;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using MC.ClientPortal.WebApi.Models;
using MC.BusinessServices;
using System.Net;
using MC.BusinessEntities.Models.DTO;
using System.Text;
using System.Configuration;
using MC.BusinessServices.ClientPortal;
using MC.ClientPortal.WebApi.ActionFilters;


namespace MC.ClientPortal.WebApi.Controllers
{   
    [RoutePrefix("api/Account")]
    public class AccountController : ApiController
    {
        private readonly IAccountServices _accountServices;
        private readonly IRegisterService _registerServices;
        public static string LocalLoginProvider { get; } = "Local";
        private ApplicationUserManager _userManager;
        private readonly IForgotPasswordService _forgotPasswordService;

        public AccountController(IAccountServices accountServices, IRegisterService registerServices, IForgotPasswordService forgotPasswordService)
        {
            _accountServices = accountServices;
            _registerServices = registerServices;
            _forgotPasswordService = forgotPasswordService;
        }
        
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
        }
               
        // POST api/Account/Logout
        [Route("Logout")]
        [ApiAuthorization]
        public IHttpActionResult Logout()
        {
            Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
            return Ok();
        }
        
        // POST api/Account/ChangePassword
        [Route("ChangePassword")]
        [ApiAuthorization]
        public HttpResponseMessage ChangePassword(ChangePasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");
            }
            IdentityResult result =  UserManager.ChangePassword(Int32.Parse(User.Identity.GetUserId()), model.OldPassword, model.NewPassword);
            if (!result.Succeeded)
            {                
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetErrorResultString( result));
            }
            ApplicationUser user = UserManager.FindByName(model.Email);
            user.ChangePasswordRequired = false;
            user.PasswordLastChanged = DateTime.Now;
            UserManager.Update(user);
            int rowId = _registerServices.EmailQueueInsert(model.EmailObject.From, model.EmailObject.To, model.EmailObject.Subject, model.EmailObject.Body, "");
            if (rowId < 0)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Email Sending Failed.");
            }
            return Request.CreateResponse(HttpStatusCode.OK, "Password Changed");
        }

        // POST api/Account/SetPassword
        [Route("SetPassword")]
        [AllowAnonymous]
        public HttpResponseMessage SetPassword(SetPasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");
            }            
            int contactId = Convert.ToInt32( model.ContactID);
            UserManager.RemovePassword(contactId);
            IdentityResult result = UserManager.AddPassword(contactId, model.NewPassword);
            if (!result.Succeeded)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, GetErrorResultString(result));
            }
            int rowId = _registerServices.EmailQueueInsert(model.EmailObject.From, model.EmailObject.To, model.EmailObject.Subject, model.EmailObject.Body, "");
            if (rowId < 0)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Email Sending Failed.");
            }

            return Request.CreateResponse(HttpStatusCode.OK, "Password Changed");
        }

        [AllowAnonymous]
        [Route("RegisterUser")]
        public HttpResponseMessage RegisterUser([FromBody]RegisterDetail model)
        {               
            string lError = "";
            try
            {
                if (!ModelState.IsValid)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Model State is Invalid.");                
                }          

                //1. Get the ClientId and RoleId from SELECT @ClientId = ClientId, @WebRoleId = WebRoleId FROM ClientInvitationCodes WHERE InvitationCode = @invitationCode
                //2. Get the Max Sequence Number here
                RegisterDetail response = _registerServices.GetRegisterUserDetails(model);

                if ( response.WebRoleId == "0" || response.ClientId == 0)
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invitation Code is Invalid.");

                if (UserManager.FindByName(model.Email) != null)                
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Email Already Registered.");
                
                //3. Call this method                
                ApplicationUser user = new ApplicationUser() { UserName = model.Email, Email = model.Email, FirstName = model.FirstName, LastName = model.LastName,
                            FullName = model.FirstName + " " + model.LastName, PhoneNumberConfirmed = false, IsNYAttorneyPortalUser = true,
                            Suffix = model.Suffix, XRefId = response.ClientId, SequenceNo = response.SequenceNo, ContactType = "Registered",
                            LockoutEnabled = true, EmailConfirmed = false, CreatedBy="System" , CreatedDate= DateTime.Now, LastModDate = DateTime.Now, LastModBy = "System" };
                IdentityResult result = UserManager.Create(user);

                if (result.Succeeded)
                {
                    //4.Then call the webUserRolesUpdate
                    _registerServices.WebUserRolesUpdate(user.Id, int.Parse(response.WebRoleId));
                    string passswordResetUrl = ConfigurationManager.AppSettings["ForgotPasswordURL"];
                    response.PasswordResetUrl = passswordResetUrl + "?key=" + EncryptQueryStringParameter(user.Id + "|" + DateTime.Now);
                    model.EmailObject.Body = model.EmailObject.Body.Replace(model.PasswordResetUrl, response.PasswordResetUrl);
                    //5.Insert the record in the EmailQueue table
                    int rowId = _registerServices.EmailQueueInsert(model.EmailObject.From, model.EmailObject.To, model.EmailObject.Subject, model.EmailObject.Body, "");
                    if (rowId < 0)
                    {
                        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Email Sending Failed.");
                    }
                    response.ResponseMessage = "";
                }
                else
                {
                    foreach (string error in result.Errors)
                    {
                        lError = lError + error + "\r\n";
                    }
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, lError);
                }
                return Request.CreateResponse(HttpStatusCode.OK, response);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("ValidateUserEmail")]
        public HttpResponseMessage ValidateUserEmail([FromBody]ChangePasswordDetail model)
        {
            ApplicationUser user = UserManager.FindByName(model.Email);
            if (user == null || user.IsNYAttorneyPortalUser == false )
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Email not found.");

            if (user.Inactive)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Your account is Inactive, Please contact administrator at " + ConfigurationManager.AppSettings["AdministratorAddress"]);

            ChangePasswordDetail response = _forgotPasswordService.ValidateUserEmail(model.Email);
            response.EmailObject = model.EmailObject;

            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        [AllowAnonymous]
        [Route("ForgotPassword")]
        public HttpResponseMessage ForgotPassword([FromBody]ChangePasswordDetail model)
        {
            ApplicationUser luser = UserManager.FindByName(model.Email);

            if (luser == null || luser.IsNYAttorneyPortalUser == false )
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Email not found.");

            if (luser.Inactive)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Your account is Inactive, Please contact administrator at " + ConfigurationManager.AppSettings["AdministratorAddress"]);

            model.PasswordResetUrl =ConfigurationManager.AppSettings["ForgotPasswordURL"] + "?key=" + EncryptQueryStringParameter(model.ContactId + "|" + DateTime.Now);
            model.EmailObject.Body = model.EmailObject.Body.Replace("PasswordResetUrl", model.PasswordResetUrl);//(forgotPassURL, model.PasswordResetUrl);

            int rowId = _registerServices.EmailQueueInsert(model.EmailObject.From, model.EmailObject.To, model.EmailObject.Subject, model.EmailObject.Body, "");
            if (rowId < 0)
            {
                return Request.CreateErrorResponse(HttpStatusCode.ServiceUnavailable, "Email Sending Failed.");
            }
         
            return Request.CreateResponse(HttpStatusCode.OK, model);
        }
        
        [HttpGet]
        [ApiAuthorization]
        [Route("GetAccountDetails/{ContactID}")]
        public HttpResponseMessage GetAccountDetails(int contactId)
        {
            var result = _accountServices.GetAccountProfileData(contactId);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpGet]
        [ApiAuthorization]
        [Route("CPGetPermissionsAgainstRole/{ScreenName}")]
        public HttpResponseMessage CpGetPermissionsAgainstRole(string screenName)
        {
            try
            {
                int userRole = 0;
                int userid = Convert.ToInt32( User.Identity.GetUserId());

                ApplicationUser user = UserManager.FindById(userid);

                foreach (ApplicationUserRole role in user.Roles)
                {
                    userRole = role.RoleId;
                    break;
                }

                var result = _accountServices.CpGetPermissionsAgainstRole(userRole, screenName);
                
                if (result!=null)
                    return Request.CreateResponse(HttpStatusCode.OK, result);
                else
                    return Request.CreateResponse(HttpStatusCode.NoContent, "0");
            }
            catch(Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }

        [HttpGet]
        [ApiAuthorization]
        [Route("GetWebRoles/{Type}/{PartyType}")]
        public HttpResponseMessage GetWebRoles(string type, string partyType)
        {
            var result = _accountServices.GetAllWebRoles(type, partyType);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
                

        [AllowAnonymous]
        [HttpGet]
        [Route("PasswordReset/{key}/{validHours}")]
        public HttpResponseMessage PasswordReset(string key, int validHours)
        {
            string contactIdWithDateTime = DecryptQueryStringParameter(key);
            string[] items = contactIdWithDateTime.Split(new char[] { '|' });
            int contactId = int.Parse(items[0]);            
            DateTime keyTime = DateTime.Parse(items[1]);

            PasswordResetDetail response = _registerServices.PasswordReset(contactId, keyTime, validHours);

            //ApplicationUser user = UserManager.GetEmail(234324);// UserManager.FindById(Convert.ToInt64(response.ContactId));

            response.Originator = "PasswordReset";
            response.Email = UserManager.GetEmail(contactId);
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        public static string EncryptQueryStringParameter(string sInputString)
        {
            if (String.IsNullOrEmpty(sInputString)) return null;

            try
            {
                byte[] inputByteArray = Encoding.UTF8.GetBytes(sInputString);

                return HttpServerUtility.UrlTokenEncode(inputByteArray);
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public static string DecryptQueryStringParameter(string sInputString)
        {
            if (String.IsNullOrEmpty(sInputString)) return null;

            try
            {
                byte[] inputByteArray = HttpServerUtility.UrlTokenDecode(sInputString);
                return Encoding.UTF8.GetString(inputByteArray);
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && _userManager != null)
            {
                _userManager.Dispose();
                _userManager = null;
            }
            base.Dispose(disposing);
        }        
                
        #region Helpers

        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
        }


        private string GetErrorResultString(IdentityResult result)
        {
            string lResult = "";

            if (result == null)
            {
                return lResult;
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        lResult = lResult + error + ";";
                    }
                }
            }
            return lResult;
        }

        #endregion
    }
}
