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
    [RoutePrefix("api/City")]
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    public class CityController : ApiController
    {
        #region Private variable.

        private readonly ICityServices _cityServices;

        #endregion

        #region Public Constructor

        /// <summary>
        /// Public constructor to initialize product service instance
        /// </summary>
        public CityController(ICityServices cityServices)
        {
            _cityServices = cityServices;
        }

        #endregion

        [Route("GetByStateAbbr/{stateAbbr}")]
        [HttpGet]
        public HttpResponseMessage GetByStateAbbr(string stateAbbr)
        {          
            var city = _cityServices.GetAllCityByStates(stateAbbr);
            if (city != null)
            {
                var cityEntities = city as List<CityEntity> ?? city.ToList();
                if (cityEntities.Any())
                    return Request.CreateResponse(HttpStatusCode.OK, cityEntities);
            }
            throw new ApiDataException(1000, "city not found", HttpStatusCode.NotFound);
        }

        [Route("GetAll")]
        [HttpGet]
        public HttpResponseMessage GetAll()
        {
            var city = _cityServices.GetAll();
            if (city != null)
            {
                var cityEntities = city as List<CityEntity> ?? city.ToList();
                if (cityEntities.Any())
                    return Request.CreateResponse(HttpStatusCode.OK, cityEntities);
            }
            throw new ApiDataException(1000, "city not found", HttpStatusCode.NotFound);
        }
    }
}
