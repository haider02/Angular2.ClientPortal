using System.Net;
using System.Net.Http;
using System.Web.Http;
using MC.BusinessServices.ClientPortal;
using MC.ClientPortal.WebApi.ActionFilters;
using Microsoft.AspNet.Identity;

namespace MC.ClientPortal.WebApi.Controllers.ClientPortal
{
    [ApiAuthorization]    
    [RoutePrefix("api/PostClose")]
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    public class PostCloseController : ApiController
    {
        #region Private variable.
        private readonly IPostCloseService _postCloseServices;
        #endregion

        #region Public Constructor

        public PostCloseController(IPostCloseService postCloseServices)
        {
            _postCloseServices = postCloseServices;
        }

        #endregion
        
        [HttpGet]
        [Route("GetRecordingDetails/{orderNo}")]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        public HttpResponseMessage GetRecordingDetails(int orderNo)
        {
            var result = _postCloseServices.GetRecordingDetails(orderNo);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpGet]
        [Route("GetLoanPolicyDetails/{orderNo}")]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        public HttpResponseMessage GetLoanPolicyDetails(int orderNo)
        {
            var result = _postCloseServices.GetLoanPolicyDetails(orderNo);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpGet]
        [Route("GetPostCloseDocuments/{orderNo}")]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        public HttpResponseMessage GetPostCloseDocuments(int orderNo)
        {
            var result = _postCloseServices.GetPostCloseDocuments(orderNo);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
    }
}
