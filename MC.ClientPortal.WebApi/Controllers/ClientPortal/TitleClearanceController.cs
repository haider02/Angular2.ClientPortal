using System.Configuration;
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
    [RoutePrefix("api/TitleClearance")]
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    public class TitleClearanceController : ApiController
    {
        #region Private variable.
        private readonly ITitleClearanceService _titleClearanceServices;
        #endregion

        #region Public Constructor

        public TitleClearanceController(ITitleClearanceService titleClearanceServices)
        {
            _titleClearanceServices = titleClearanceServices;
        }

        #endregion
        
        [HttpGet]
        [Route("GetClearanceItems/{orderNo}")]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        public HttpResponseMessage GetClearanceItems(int orderNo)
        {
            var result = _titleClearanceServices.GetClearanceItems(orderNo);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        
        [HttpPost]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("SaveNewYorkAttorneyItem")]
        public HttpResponseMessage SaveNewYorkAttorneyItem([FromBody]TitleClearanceDetailRequest request)
        {
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");

            return Request.CreateResponse(HttpStatusCode.OK, _titleClearanceServices.SaveNewYorkAttorneyItem(request));            
        }

        [HttpPost]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("SaveFileClearanceRequested")]
        public HttpResponseMessage SaveFileClearanceRequested([FromBody]TitleClearanceDetailRequest request)
        {
            request.To = ConfigurationManager.AppSettings["DefaultEmailTo"];

            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");

            return Request.CreateResponse(HttpStatusCode.OK, _titleClearanceServices.SaveFileClearanceRequested(request));
                        
            
        }

        [HttpGet]
        [Route("GetTCCleartoCloseDetail/{orderNo}")]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        public HttpResponseMessage GetTCCleartoCloseDetail(int orderNo)
        {
            var result = _titleClearanceServices.GetTcCleartoCloseDetail(orderNo);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpGet]
        [Route("TCRequestQuestionsAnswered/{orderNo}/{requestType}")]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        public HttpResponseMessage TCRequestQuestionsAnswered(int orderNo, string requestType)
        {
            var result = _titleClearanceServices.TcRequestQuestionsAnswered(orderNo, requestType);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
    }
}
