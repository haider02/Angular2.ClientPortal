using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MC.BusinessEntities.Models;
using MC.BusinessServices;
using MC.ClientPortal.WebApi.ErrorHelper;
using Microsoft.AspNet.Identity;
using MC.ClientPortal.WebApi.ActionFilters;

namespace MC.ClientPortal.WebApi.Controllers
{
    [ApiAuthorization]
    [RoutePrefix("api/OrderNotes")]
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    public class OrderNotesController : ApiController
    {
        private readonly IOrderNotesService _orderNotesServices;

        #region Public Constructor
        /// <summary>
        /// Public constructor to initialize Order Notes service instance
        /// </summary>
        public OrderNotesController(IOrderNotesService orderNotesService)
        {
            _orderNotesServices = orderNotesService;
        }
        #endregion

        [Route("GetOrderNotesByOrderNo/{orderNo}")]
        public HttpResponseMessage GetOrderNotesByOrderNo(int orderNo)
        {
            var orderNotes = _orderNotesServices.GetOrderNotesByOrderNo(orderNo);
            if (orderNotes != null)
            {
                var orderNotesEntities = orderNotes as List<OrderNotesEntity> ?? orderNotes.ToList();
                if (orderNotesEntities.Any())
                {
                    return Request.CreateResponse(HttpStatusCode.OK, orderNotesEntities);
                }
            }
            throw new ApiDataException(1000, "Order Notes not found", HttpStatusCode.NotFound);
        }

        [HttpPost]
        public HttpResponseMessage Post([FromBody] OrderNotesEntity notesEntity)
        {
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");

            notesEntity.LastModDate = DateTime.Now;
            notesEntity.Inactive = false;
            _orderNotesServices.CpAddOrderNoteInEmailQueue(notesEntity.OrderNo, notesEntity.Note, notesEntity.NoteType);
            return Request.CreateResponse(HttpStatusCode.OK, _orderNotesServices.SaveOrderNotes(notesEntity));
            
        }
    }    
}
