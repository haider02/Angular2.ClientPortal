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
using Microsoft.AspNet.Identity;

namespace MC.ClientPortal.WebApi.Controllers.ClientPortal
{
    [ApiAuthorization]
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    [RoutePrefix("api/OrderDetail")]
    public class OrderDetailController : ApiController
    {
        #region Private variable.
        private readonly IOrderDetailService _orderDetailService;
        #endregion


        public OrderDetailController(IOrderDetailService orderDetailService)
        {
            _orderDetailService = orderDetailService;
        }

        [HttpGet]
        [Route("GetMaritalStatus")]
        public HttpResponseMessage GetMaritalStatus()
        {
            var result = _orderDetailService.GetMaritalStatus();
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpPost]
        [Route("SaveOrderDetails")]
        public HttpResponseMessage SaveOrderDetails([FromBody]OrderDetailRequestDTO request)
        {
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");


            try
            {
                _orderDetailService.SaveOrderDetail(request);
                return Request.CreateResponse(HttpStatusCode.OK, "true");
            }
            catch(Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message);
            }
        }

        [HttpGet]
        [Route("GetOrderDetails/{OrderNo}")]
        public HttpResponseMessage GetOrderDetails(string orderNo)
        {
            var orderDetail = _orderDetailService.GetOrderDetails(orderNo);
            var orderPartyDetail = _orderDetailService.GetOrderPartyDetails(orderNo);

            try
            {
                var dto = new OrderDetailRequestDTO();

                if (orderDetail != null)
                {
                    dto.OrderMaster = orderDetail;
                }

                if (orderPartyDetail != null)
                {
                    dto.PartyList = orderPartyDetail as List<GetOrderPartyDetailsEntity> ?? orderPartyDetail.ToList();
                }

                return Request.CreateResponse(HttpStatusCode.OK, dto);
            }
            catch (Exception ex)
            {
                var message = String.Format("Not Data Found For Order {0}", orderNo + "with exception : " + ex.StackTrace);
                var httpError = new HttpError(message);
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, httpError);
            }
        }

    }
}