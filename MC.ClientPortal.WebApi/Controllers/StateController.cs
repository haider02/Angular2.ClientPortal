using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MC.BusinessServices;
using MC.BusinessEntities.Models;
using MC.ClientPortal.WebApi.ErrorHelper;
using Microsoft.AspNet.Identity;
using MC.ClientPortal.WebApi.ActionFilters;

namespace MC.ClientPortal.WebApi.Controllers
{
    [ApiAuthorization]
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    [RoutePrefix("api/State")]
    public class StateController : ApiController
    {
        #region Private variable.

        private readonly IStateServices _stateServices;

        #endregion


        #region Public Constructor

        /// <summary>
        /// Public constructor to initialize product service instance
        /// </summary>
        public StateController(IStateServices stateServices)
        {
            _stateServices = stateServices;
        }

        #endregion
                
        [Route("Get")]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        public HttpResponseMessage Get()
        {
            var state = _stateServices.GetAllStates();
            if (state != null)
            {
                var stateEntities = state as List<StatesEntity> ?? state.ToList();
                if (stateEntities.Any())
                    return Request.CreateResponse(HttpStatusCode.OK, stateEntities);
            }
            throw new ApiDataException(1000, "State not found", HttpStatusCode.NotFound);
        }        
    }
}
