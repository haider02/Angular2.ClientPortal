using System.Configuration;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MC.BusinessEntities.Models.DTO;
using MC.BusinessServices.ClientPortal;
using MC.ClientPortal.WebApi.ActionFilters;

namespace MC.ClientPortal.WebApi.Controllers.ClientPortal
{
    [ApiAuthorization]
    [RoutePrefix("api/GenerateDocument")]
    public class GenerateDocumentController : ApiController
    {
        private readonly IGenerateDocumentService _documentServices;


        #region Public Constructor

        public GenerateDocumentController(IGenerateDocumentService documentServices)
        {
            _documentServices = documentServices;
        }

        #endregion

        [HttpGet]
        [Route("GetDownloadDocuments")]
        public HttpResponseMessage GetDownloadDocuments()
        {
            var result = _documentServices.GetNyDocumentList();
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpPost]
        [Route("GetDocumentPath")]
        public HttpResponseMessage GetDocumentPath([FromBody] GenerateDocumentDTO document)
        {
            string localFilePath = "";
            string fileName = "";

            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");


            if (!string.IsNullOrEmpty(document.ImagingPath))
            {
                byte[] fileBytes = File.ReadAllBytes(document.ImagingPath);
                localFilePath = GeneratePath(document.ImagingPath, document.Name, fileBytes , out fileName);
            }
            //return localFilePath;
            GenerateDocumentDTO dto;
            dto = document;
            dto.ImagingPath = localFilePath;
            dto.DisplayName = fileName;
            return Request.CreateResponse(HttpStatusCode.OK, dto);
        }

        private string GeneratePath(string filePath, string fileName , byte[] fileBytes , out string retFileName)
        {
            string localFilePath;
            string filePathDirectory = ConfigurationManager.AppSettings["DocumentLocalPath"] + "NYDocuments\\" + fileName;

            if (!Directory.Exists(filePathDirectory))
            {
                Directory.CreateDirectory(filePathDirectory);
            }
            string[] filePathComponents = filePath.Split('\\');
            retFileName = filePathComponents[filePathComponents.Length - 1];
            localFilePath = filePathDirectory + "\\" + retFileName;
            File.WriteAllBytes(localFilePath, fileBytes);

            string tempPaths = "\\Documents\\NYDocuments\\" + fileName + "\\" + filePathComponents[filePathComponents.Length - 1];
            return tempPaths;
        }
    }
}