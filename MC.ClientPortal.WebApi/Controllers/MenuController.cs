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
    [RoutePrefix("api/Menu")]
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    public class MenuController : ApiController
    {
        private readonly IMenuServices _menuServices;

        /// <summary>
        /// Public constructor to initialize Menu service instance
        /// </summary>
        public MenuController(IMenuServices menuServices)
        {
            _menuServices = menuServices;
        }

        // GET api/menu
        [HttpGet]
        [Route("GetAllMenus")]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        public HttpResponseMessage GetAllMenus()
        {
            var entityList = _menuServices.GetAllMenu();
            var productEntities = entityList as List<MenuEntity> ?? entityList.ToList();
            if (productEntities.Any())
                return Request.CreateResponse(HttpStatusCode.OK, productEntities);
            throw new ApiDataException(1000, "Menu not found", HttpStatusCode.NotFound);
        }
        
    }
}
