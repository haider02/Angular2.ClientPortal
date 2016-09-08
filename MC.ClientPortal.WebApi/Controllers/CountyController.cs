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
    [RoutePrefix("api/County")]
    [ApiAuthorization]
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    public class CountyController : ApiController
    {
        #region Private variable.

        private readonly ICountyServices _countyServices;
        


        #endregion
        
        #region Public Constructor

        /// <summary>
        /// Public constructor to initialize product service instance
        /// </summary>
        public CountyController(ICountyServices countyServices)
        {
            _countyServices = countyServices;            
        }

        #endregion
        

        [Route("GetAll")]
        public HttpResponseMessage GetAll()
        {
            var county = _countyServices.GetAllCounty();
            if (county != null)
            {
                var countyEntities = county as List<CountyEntity> ?? county.ToList();
                if (countyEntities.Any())
                    return Request.CreateResponse(HttpStatusCode.OK, countyEntities);
            }
            throw new ApiDataException(1000, "County not found", HttpStatusCode.NotFound);
        }

        [HttpPost]
        [Route("GetCountiesByState")]
        public HttpResponseMessage GetCountiesByStates([FromBody] List<string> states)
        {
            var county = _countyServices.GetAllCountyByStates(states);
            if (county != null)
            {
                var countyEntities = county as List<CountyEntity> ?? county.ToList();
                if (countyEntities.Any())
                {
                    //countyEntities = county.Where(x => States.Contains(x.StateAbbr)).ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, countyEntities);
                }
                    
            }
            throw new ApiDataException(1000, "County not found", HttpStatusCode.NotFound);
        }

        [Route("GetStateCountyFromZip/{zip}")]
        public HttpResponseMessage GetStateCountyFromZip(string zip)
        {
            try
            {
                var addressData = _countyServices.GetStateCountyFromZip(zip);
                if (addressData != null && addressData.Count() > 0)
                {
                    var addressEtities = addressData as List<StateCountyFromZipResultEntity> ?? addressData.ToList();
                    if (addressEtities.Any())
                        return Request.CreateResponse(HttpStatusCode.OK, addressEtities);
                }                
                return Request.CreateResponse(HttpStatusCode.NotFound, "No data found against zip code");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message);
            }
        }


        [Route("GetbyStateAbbr/{stateAbbr}")]
        public HttpResponseMessage GetbyStateAbbr(string stateAbbr)
        {
            var county = _countyServices.GetAllCountyByStateAbbr(stateAbbr);
            if (county != null)
            {
                var countyEntities = county as List<CountyEntity> ?? county.ToList();
                if (countyEntities.Any())
                    return Request.CreateResponse(HttpStatusCode.OK, countyEntities);
            }
            throw new ApiDataException(1000, "County not found", HttpStatusCode.NotFound);
        }
    }

  
}
