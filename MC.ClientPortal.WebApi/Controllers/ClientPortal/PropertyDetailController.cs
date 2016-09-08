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
    [RoutePrefix("api/PropertyDetail")]
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    public class PropertyDetailController : ApiController
    {
        #region Private variable.
        private readonly IPropertyDetailService _propertyDetailServices;
        #endregion

        #region Public Constructor

        public PropertyDetailController(IPropertyDetailService propertyDetailServices)
        {
            _propertyDetailServices = propertyDetailServices;
        }

        #endregion
        
        [HttpPost]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("SavePropertyDetail")]
        public HttpResponseMessage SavePropertyDetail([FromBody]PropertyDetailRequest request)
        {
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");

            return Request.CreateResponse(HttpStatusCode.OK, _propertyDetailServices.SavePropertyDetail(request));

            
        }

        

        [HttpGet]
        [Route("GetPropertyDetail/{orderNo}")]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        public HttpResponseMessage GetPropertyDetail(int orderNo)
        {
            var result = _propertyDetailServices.CpGetPropertyDetail(orderNo);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
    }
}
