using System.Net;
using System.Net.Http;
using System.Web.Http;
using MC.BusinessEntities.Models.DTO;
using MC.BusinessServices.ClientPortal;
using MC.ClientPortal.WebApi.ActionFilters;
using Microsoft.AspNet.Identity;

namespace MC.ClientPortal.WebApi.Controllers.ClientPortal
{
    [ApiAuthorization]    
    [RoutePrefix("api/PreClose")]
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    public class PreCloseController : ApiController
    {
        #region Private variable.
        private readonly IPreCloseService _preCloseServices;
        #endregion

        #region Public Constructor

        public PreCloseController(IPreCloseService preCloseServices)
        {
            _preCloseServices = preCloseServices;
        }

        #endregion
        
        [HttpGet]
        [Route("GetSignatureRequirement/{orderNo}")]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        public HttpResponseMessage GetSignatureRequirement(int orderNo)
        {
            var result = _preCloseServices.GetSignatureRequirement(orderNo);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpGet]
        [Route("GetPreCloseDetails/{orderNo}")]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        public HttpResponseMessage GetPreCloseDetails(int orderNo)
        {
            var result = _preCloseServices.GetPreCloseDetails(orderNo);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpGet]
        [Route("GetPreCloseDocuments/{orderNo}")]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        public HttpResponseMessage GetPreCloseDocuments(int orderNo)
        {
            var result = _preCloseServices.GetPreCloseDocuments(orderNo);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpPost]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("SavePreCloseDetail")]
        public HttpResponseMessage SavePreCloseDetail([FromBody]PreCloseDetailRequest request)
        {
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");

            return Request.CreateResponse(HttpStatusCode.OK, _preCloseServices.SavePreCloseDetail(request));

            
        }
    }
}
