using System;
using System.Collections.Generic;
using System.Globalization;
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
    [RoutePrefix("api/Address")]
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    public class AddressController : ApiController
    {
        private readonly IAddressServices _addressServices;
       

        #region Public Constructor
        /// <summary>
        /// Public constructor to initialize Address service instance
        /// </summary>
        public AddressController(IAddressServices addressServices)
        {
            _addressServices = addressServices;
        }

        #endregion

       
        public HttpResponseMessage Get()
        {
            var addresses = _addressServices.GetAllAddresses();
            var addressEntities = addresses as List<AddressEntity> ?? addresses.ToList();

            if (addressEntities.Any())
            {
                addressEntities = addressEntities.Where(o => o.XRefId == 36576).ToList();
                return Request.CreateResponse(HttpStatusCode.OK, addressEntities);
            }

            throw new ApiDataException(1000, "Address not found", HttpStatusCode.NotFound);
        }

        public HttpResponseMessage Get(int id)
        {
            if (id > 0)
            {
                var address = _addressServices.GetAddressById(id);
                if (address != null)
                    return Request.CreateResponse(HttpStatusCode.OK, address);

                throw new ApiDataException(1001, "No product found for this id.", HttpStatusCode.NotFound);
            }
            throw new ApiException() { ErrorCode = (int)HttpStatusCode.BadRequest, ErrorDescription = "Bad Request..." };
        }

     
        [HttpPost]
        public HttpResponseMessage Post([FromBody] AddressEntity addressEntity)
        {
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");

            addressEntity.LastModDate = DateTime.Now;
            addressEntity.SysTimeStamp = System.Text.Encoding.UTF8.GetBytes(DateTime.Now.ToString(CultureInfo.InvariantCulture));
            return Request.CreateResponse(HttpStatusCode.OK, _addressServices.CreateAddress(addressEntity));
        }

     
        [HttpPost]
        [Route("UpdateAddress/{id}")]
        public HttpResponseMessage UpdateAddress(int id, [FromBody] AddressEntity addressEntity)
        {
            if (id > 0)
            {
                if (!ModelState.IsValid)
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");

                return Request.CreateResponse(HttpStatusCode.OK, _addressServices.UpdateAddress(id, addressEntity));
            }
            return Request.CreateResponse(HttpStatusCode.OK, false);
        }

           
        [Route("DeleteAddress/{id}")]
        [HttpGet]
        public HttpResponseMessage DeleteAddress(int id)
        {
            if (id > 0)
            {
                var isSuccess = _addressServices.DeleteAddress(id);
                if (isSuccess==1)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, true);
                }
                throw new ApiDataException(1002, "Address is already deleted or not exist in system.", HttpStatusCode.NoContent);
            }
            throw new ApiException() { ErrorCode = (int)HttpStatusCode.BadRequest, ErrorDescription = "Bad Request..." };
        }

       
    }
}
