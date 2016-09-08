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
    [RoutePrefix("api/OrderEntry")]
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    public class OrderEntryController : ApiController
    {
        #region Private variable.
        private readonly IOrderEntryService _orderEntryServices;
        #endregion

        #region Public Constructor

        public OrderEntryController(IOrderEntryService orderEntryServices)
        {
            _orderEntryServices = orderEntryServices;
        }

        #endregion

        [HttpGet]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("GetClientTransactionTypes/{clientId}")]
        public HttpResponseMessage GetClientTransactionTypes(int clientId)
        {
            var result = _orderEntryServices.GetClientTransactionTypes(clientId);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpGet]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("GetClientContactNames/{clientId}/{suffix}/{isShowMultiLevels}")]
        public HttpResponseMessage GetClientContactNames(int clientId, string suffix, bool isShowMultiLevels)
        {
            var result = _orderEntryServices.GetClientContactNames(clientId, suffix, isShowMultiLevels);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpGet]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("GetMaritalStatus")]
        public HttpResponseMessage GetMaritalStatus()
        {
            var result = _orderEntryServices.GetMaritalStatus();
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpPost]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("SaveOrderEntry")]
        public HttpResponseMessage SaveOrderEntry([FromBody]OrderEntryDetailRequest request)
        {
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");


            return Request.CreateResponse(HttpStatusCode.OK, _orderEntryServices.SaveOrderEntry(request));
        }
        
    }
}
