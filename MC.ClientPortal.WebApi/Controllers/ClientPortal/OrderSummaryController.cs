using System.Net;
using System.Net.Http;
using System.Web.Http;
using MC.BusinessServices.ClientPortal;
using MC.ClientPortal.WebApi.ActionFilters;
using Microsoft.AspNet.Identity;

namespace MC.ClientPortal.WebApi.Controllers.ClientPortal
{
    [ApiAuthorization]    
    [RoutePrefix("api/OrderSummary")]
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    public class OrderSummaryController : ApiController
    {
        #region Private variable.
        private readonly IOrderSummaryService _orderSummaryServices;
        #endregion

        #region Public Constructor

        public OrderSummaryController(IOrderSummaryService orderSummaryServices)
        {
            _orderSummaryServices = orderSummaryServices;
        }

        #endregion
        
        [HttpGet]
        [Route("GetProductCodeByOrder/{orderNo}")]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        public HttpResponseMessage GetProductCodeByOrder(int orderNo)
        {
            var result = _orderSummaryServices.GetProductCodeByOrder(orderNo);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpGet]
        [Route("GetMileStoneTracker/{orderNo}/{productCode}")]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        public HttpResponseMessage GetMileStoneTracker(int orderNo, string productCode)
        {
            var result = _orderSummaryServices.GetMileStoneTracker(orderNo, productCode);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpGet]
        [Route("GetCheckList/{orderNo}/{productCode}")]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        public HttpResponseMessage GetCheckList(int orderNo, string productCode)
        {
            var result = _orderSummaryServices.GetCheckList(orderNo, productCode);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpGet]
        [Route("SaveOrderStatus/{orderNo}")]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        public HttpResponseMessage SaveOrderStatus(int orderNo)
        {
            return Request.CreateResponse(HttpStatusCode.OK, _orderSummaryServices.SaveOrderStatus(orderNo));
        }


        [HttpGet]
        [Route("GetOrderHeader/{orderNo}")]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        public HttpResponseMessage GetOrderHeader(int orderNo)
        {
            var result = _orderSummaryServices.CpOrderHeader(orderNo);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
    }
}
