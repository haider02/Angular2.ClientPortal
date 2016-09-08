using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MC.BusinessEntities.Models;
using MC.BusinessEntities.Models.DTO;
using MC.BusinessServices.ClientPortal;
using MC.ClientPortal.WebApi.ActionFilters;
using MC.ClientPortal.WebApi.ErrorHelper;
using Microsoft.AspNet.Identity;

namespace MC.ClientPortal.WebApi.Controllers.ClientPortal
{
    [ApiAuthorization]    
    [RoutePrefix("api/Administration")]
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    public class AdministrationController : ApiController
    {
        #region Private variable.
        private readonly ISecurityControlService _securityControlService;
        private readonly ISecurityFormService _securityFormService;
        private readonly ISecurityFormControlService _securityFormControlService;
        private readonly ISecurityFormControlControlConfigService _securityFormControlConfigService;
        #endregion

        #region Public Constructor

        public AdministrationController(ISecurityControlService securityControlService, ISecurityFormService securityFormService, 
                    ISecurityFormControlService securityFormControlService, ISecurityFormControlControlConfigService securityFormControlConfigService)
        {
            _securityControlService = securityControlService;
            _securityFormService = securityFormService;
            _securityFormControlService = securityFormControlService;
            _securityFormControlConfigService = securityFormControlConfigService;
        }

        #endregion

        #region Security Control Methods

        [HttpGet]
        [Route("GetAllSecurityControls")]
        public HttpResponseMessage GetAllSecurityControls()
        {
            var securityControls = _securityControlService.GetAllSecurityControls();
            var securityControlEntities = securityControls as List<SecurityControlEntity> ?? securityControls.ToList();

            if (securityControlEntities.Any())
            {
                return Request.CreateResponse(HttpStatusCode.OK, securityControlEntities);
            }

            throw new ApiDataException(1000, "Address not found", HttpStatusCode.NotFound);
        }

        [HttpPost]
        [Route("InsertUpdateSecurityControl")]
        public HttpResponseMessage InsertUpdateSecurityControl([FromBody] SecurityControlEntity securityControlEntity)
        {
            if (!ModelState.IsValid)            
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");
            

            if (_securityControlService.CreateUpdateSecurityControl(securityControlEntity))
                return Request.CreateResponse(HttpStatusCode.OK, "true");

            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "false");
        }

        [HttpPost]
        [Route("DeleteSecurityControl/{SecurityControlId}")]
        public HttpResponseMessage DeleteSecurityControl(int securityControlId)
        {
            return Request.CreateResponse(HttpStatusCode.OK, _securityControlService.DeleteSecurityControl(securityControlId));
        }

        #endregion

        #region Security Form Methods

        [HttpGet]
        [Route("GetAllSecurityForms")]
        public HttpResponseMessage GetAllSecurityForms()
        {
            var securityForms = _securityFormService.GetAllSecurityForms();
            var securityFormsEntities = securityForms as List<SecurityFormEntity> ?? securityForms.ToList();

            if (securityFormsEntities.Any())
            {
                return Request.CreateResponse(HttpStatusCode.OK, securityFormsEntities);
            }

            throw new ApiDataException(1000, "Address not found", HttpStatusCode.NotFound);
        }

        [HttpPost]
        [Route("InsertUpdateSecurityForm")]
        public HttpResponseMessage InsertUpdateSecurityForm([FromBody] SecurityFormEntity securityFormEntity)
        {
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");


            if( _securityFormService.CreateUpdateSecurityForm(securityFormEntity))
                return Request.CreateResponse(HttpStatusCode.OK, "true");

            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "false");
        }

        [HttpPost]
        [Route("DeleteSecurityForm/{SecurityFormId}")]
        public HttpResponseMessage DeleteSecurityForm(int securityFormId)
        {
            return Request.CreateResponse(HttpStatusCode.OK, _securityFormService.DeleteSecurityControl(securityFormId));
        }

        #endregion

        #region Security Form Control Methods

        [HttpGet]
        [Route("CPGetSecurityControlFormGridList/{ApplicationId}")]
        public HttpResponseMessage CpGetSecurityControlFormGridList(int applicationId)
        {
            var data = _securityFormControlService.CpGetSecurityFormControls(applicationId);
            if (data != null)
            {
                var details = data as List<SecurityFromControlGridDTO> ?? data.ToList();
                if (details.Any())
                    return Request.CreateResponse(HttpStatusCode.OK, details);
            }
            //throw new ApiDataException(1000, "County not found", HttpStatusCode.NotFound);
            var message = String.Format("Not Data Found For Application {0}", applicationId);
            var httpError = new HttpError(message);
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, httpError);
        }

        [HttpPost]
        [Route("InsertUpdateSecurityFormControl")]
        public HttpResponseMessage InsertUpdateSecurityFormControl([FromBody] SecurityFormControlEntity securityFormControlEntity)
        {
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");

            if( _securityFormControlService.CreateUpdateSecurityFormControl(securityFormControlEntity))
                return Request.CreateResponse(HttpStatusCode.OK, "true");

            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "false");
        }

        [HttpPost]
        [Route("DeleteSecurityFormControl/{SecurityFormControlId}")]
        public HttpResponseMessage DeleteSecurityFormControl(int securityFormControlId)
        {
            return Request.CreateResponse(HttpStatusCode.OK, _securityFormControlService.DeleteSecurityFormControl(securityFormControlId));
        }

        #endregion

        #region Security Form Control Config Methods

        [HttpGet]
        [Route("CPGetSecurityControlConfigFormGridList/{ApplicationId}")]
        public HttpResponseMessage CpGetSecurityControlConfigFormGridList(int applicationId)
        {
            var data = _securityFormControlConfigService.CpGetSecurityFormControlsConfig(applicationId);
            if (data != null)
            {
                var details = data as List<SecurityFormControlConfigGridDTO> ?? data.ToList();
                if (details.Any())
                    return Request.CreateResponse(HttpStatusCode.OK, details);
            }
            //throw new ApiDataException(1000, "County not found", HttpStatusCode.NotFound);
            var message = String.Format("Not Data Found For Application {0}", applicationId);
            var httpError = new HttpError(message);
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, httpError);
        }

        [HttpPost]
        [Route("InsertUpdateSecurityFormControlConfig")]
        public HttpResponseMessage InsertUpdateSecurityFormControlConfig([FromBody] SecurityControlFormConfigEntity securityControlFormConfigEntity)
        {
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");

            if ( _securityFormControlConfigService.CreateUpdateSecurityFormControlConfig(securityControlFormConfigEntity))
                return Request.CreateResponse(HttpStatusCode.OK, "true");

            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "false");
        }

        [HttpPost]
        [Route("DeleteSecurityFormControlConfig/{SecurityFormControlId}")]
        public HttpResponseMessage DeleteSecurityFormControlConfig(int securityFormControlId)
        {
            return Request.CreateResponse(HttpStatusCode.OK, _securityFormControlConfigService.DeleteSecurityControlConfig(securityFormControlId));
        }


        public List<SecurityFormControlConfigGridDTO> GetSecurityActionConfig(int applicationId)
        {
            var data = _securityFormControlConfigService.CpGetSecurityFormControlsConfig(applicationId);
            if (data != null)
            {
                var details = data as List<SecurityFormControlConfigGridDTO> ?? data.ToList();
                return details;
            }

            return null;
        }

        #endregion


        [HttpGet]
        [Route("EncryptItem/{key}")]
        public HttpResponseMessage EncryptItem(string key)
        {
            return Request.CreateResponse(HttpStatusCode.OK, MC.Common.Encryption.EncryptDecrypt.EncryptString((key)) );
        }


        [HttpGet]
        [Route("DecryptItem/{key}")]
        public HttpResponseMessage DecryptItem(string key)
        {
            return Request.CreateResponse(HttpStatusCode.OK, MC.Common.Encryption.EncryptDecrypt.DecryptString((key)));
        }


    }
}
