using System;
using System.Configuration;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using MC.BusinessEntities.Models.DTO;
using MC.BusinessServices.ClientPortal;
using MC.ClientPortal.WebApi.ActionFilters;
using MC.ClientPortal.WebApi.ErrorHelper;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json.Linq;

namespace MC.ClientPortal.WebApi.Controllers.ClientPortal
{
    [ApiAuthorization]
    [RoutePrefix("api/DashBoard")]
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    public class DashBoardController : ApiController
    {
        #region Private variable.
        private readonly IDashBoardService _dashBoardServices;
        #endregion

        #region Public Constructor

        public DashBoardController(IDashBoardService dashBoardServices)
        {
            _dashBoardServices = dashBoardServices;
        }

        #endregion
        
        [HttpGet]        
        [Route("GetClientList/{parentId}")]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [ApiAuthorization]        
        public HttpResponseMessage GetClientList(int parentId)
        {
            var result = _dashBoardServices.GetClientList(parentId);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpPost]
        [Route("OrderSearch")]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        public HttpResponseMessage OrderSearch([FromBody]DashBoardRequest request)
        {
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");

            request.DefaultPastDays = int.Parse(ConfigurationManager.AppSettings["DefaultPastDays"]);
            var result = _dashBoardServices.GetDashBoardOrderSearch(request);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpGet]        
        [Route("GetOrderSummary/{orderNo}")]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        public HttpResponseMessage GetOrderSummary(int orderNo)
        {
            var result = _dashBoardServices.GetOrderSummary(orderNo);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }


        [HttpPost]
        [Route("GetLoadStarUrl")]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        public HttpResponseMessage GetLoadStarUrl()
        {
            try
            {
                
                string postData = string.Format("username={0}&password={1}", ConfigurationManager.AppSettings["LSUserName"] , ConfigurationManager.AppSettings["LSPassword"]);
                
               
                byte[] dataStream = Encoding.UTF8.GetBytes(postData);

                WebRequest webRequest = WebRequest.Create(ConfigurationManager.AppSettings["LSLoginUrl"]);
                webRequest.Method = "POST";
                webRequest.ContentType = "application/x-www-form-urlencoded";
                webRequest.ContentLength = dataStream.Length;
                Stream newStream = webRequest.GetRequestStream();
                // Send the data.
                newStream.Write(dataStream, 0, dataStream.Length);
                newStream.Close();
                
                WebResponse webResponse = webRequest.GetResponse();

                using (Stream stream = webResponse.GetResponseStream())
                {
                    if (stream != null)
                    {
                        StreamReader reader = new StreamReader(stream, Encoding.UTF8);
                        var result = reader.ReadLine();

                        JObject jsonresults = JObject.Parse(result);


                        if (result != null && result.Contains("success"))
                        {
                            result = string.Format(ConfigurationManager.AppSettings["LSMainUrl"] + "?session_id={0}", jsonresults["session_id"]);

                            return Request.CreateResponse(HttpStatusCode.OK, result);
                        }
                        else
                        {
                            throw new ApiDataException(1001, "Load Start API Faied: " , HttpStatusCode.NotFound);

                        }
                    }
                }                
            }
            catch (Exception ex)
            {
                throw new ApiDataException(1001, "Load Start API Faied: "  + ex.Message, HttpStatusCode.NotFound);
            }
            return null;
        }
    }
}
