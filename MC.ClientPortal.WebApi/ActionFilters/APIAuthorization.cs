using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Runtime.Caching;
using System.Net.Http;
using System.Net;
using MC.BusinessEntities.Models.DTO;
using MC.BusinessServices.ClientPortal;
using MC.DataModel.UnitOfWork;
using System.Configuration;
using MC.ClientPortal.WebApi.Controllers.ClientPortal;

namespace MC.ClientPortal.WebApi.ActionFilters
{
    public class ApiAuthorization : AuthorizeAttribute
    {
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            bool isAuthorized = false;
            MemoryCache memCache = MemoryCache.Default;
            string lControllerAction = actionContext.ActionDescriptor.ControllerDescriptor.ControllerName + "." + actionContext.ActionDescriptor.ActionName;
            List<SecurityFormControlConfigGridDTO> data;

            data = (List<SecurityFormControlConfigGridDTO>)memCache.Get("RolePermissions");

            if (data == null)            
            {
                AdministrationController adminController = new AdministrationController(new SecurityControlService(new UnitOfWork()), new SecurityFormService(new UnitOfWork()), new SecurityFormControlService(new UnitOfWork()), new SecurityFormControlControlConfigService(new UnitOfWork()));
                data = adminController.GetSecurityActionConfig(Convert.ToInt32(ConfigurationManager.AppSettings["SecurityApplicationId"]));
                memCache.Add("RolePermissions", data, DateTimeOffset.UtcNow.AddDays(Convert.ToDouble(System.Web.Configuration.WebConfigurationManager.AppSettings["CacheRolePermissionDays"])));
            }
            
            if (data != null)
            {
                List<SecurityFormControlConfigGridDTO> filteredList = data.FindAll(permissionObj => permissionObj.SecurityFormControlName.ToUpper() == lControllerAction.ToUpper() && permissionObj.SecurityControlDesc ==  "ControllerAction");

                foreach (SecurityFormControlConfigGridDTO obj in filteredList)
                {
                    if (actionContext.RequestContext.Principal.IsInRole(obj.RoleDescription) )
                    {
                        isAuthorized = obj.IsVisible;                        
                        break;
                    }
                }
            }
            return isAuthorized;
        }

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (SkipAuthorization(actionContext))
            {
                return;
            }

            if (!IsAuthorized(actionContext))
            {
                HandleUnauthorizedRequest(actionContext);
            }
        }

        protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
        {
            actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "User has been UnAuthorized-APIAuthorization");

        }

        private static bool SkipAuthorization(HttpActionContext actionContext)
        {
                return actionContext.ActionDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any()
                   || actionContext.ControllerContext.ControllerDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any();
        }
    }
}