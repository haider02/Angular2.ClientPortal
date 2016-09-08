using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using MC.BusinessEntities.Models;
using MC.BusinessServices;
using MC.ClientPortal.WebApi.ErrorHelper;
using System.IO;
using System.Web.Configuration;
using System.Threading.Tasks;
using System.Reflection;
using iTextSharp.text.pdf;
using iTextSharp.text;
using MC.BusinessEntities.Models.DTO;
using Microsoft.AspNet.Identity;
using MC.ClientPortal.WebApi.ActionFilters;

namespace MC.ClientPortal.WebApi.Controllers
{
    [ApiAuthorization]
    [RoutePrefix("api/Document")]
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    public class DocumentController : ApiController
    {
        private readonly IDocumentServices _documentServices;

        /// <summary>
        /// Public constructor to initilize DocumentService
        /// </summary>
        /// <param name="documentServices"></param>
        public DocumentController(IDocumentServices documentServices)
        {
            _documentServices = documentServices;
        }

        #region Auto Generated Methods
        // GET: api/Document
        public HttpResponseMessage Get()
        {
            var documents = _documentServices.GetAllDocuments();
            var documentEntities = documents as List<DocumentEntity> ?? documents.ToList();
            if (documentEntities.Any())
                return Request.CreateResponse(HttpStatusCode.OK, documentEntities);
            throw new ApiDataException(1000, "Documents not found", HttpStatusCode.NotFound);
        }

        // GET: api/Document/5
        public HttpResponseMessage Get(int id)
        {
            if (id > 0)
            {
                var document = _documentServices.GetDocumentByDocumentId(id);
                if (document != null)
                    return Request.CreateResponse(HttpStatusCode.OK, document);
                throw new ApiDataException(1001, "No Document found for this id.", HttpStatusCode.NotFound);
            }
            throw new ApiException() { ErrorCode = (int)HttpStatusCode.BadRequest, ErrorDescription = "Bad Request..." };
        }

        // POST: api/Document
        public HttpResponseMessage Post([FromBody]DocumentEntity modelEntity)
        {
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");

            return Request.CreateResponse(HttpStatusCode.OK , _documentServices.CreateDocuments(modelEntity, "", ""));
        }

        // PUT: api/Document/5
        public HttpResponseMessage Put(int id, [FromBody] DocumentEntity modelEntity)
        {
            if (id > 0)
            {
                if (!ModelState.IsValid)
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");

                return Request.CreateResponse(HttpStatusCode.OK, _documentServices.UpdateDocument(id, modelEntity));
            }
            return Request.CreateResponse(HttpStatusCode.OK, false);
        }

        // DELETE: api/Document/5 
        public HttpResponseMessage Delete(int id)
        {
            if (id > 0)
            {
                var isSuccess = _documentServices.DeleteDocument(id);
                if (isSuccess)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, true);
                }
                throw new ApiDataException(1002, "Document is already deleted or not exist in system.", HttpStatusCode.NoContent);
            }
            throw new ApiException() { ErrorCode = (int)HttpStatusCode.BadRequest, ErrorDescription = "Bad Request..." };
        }

        #endregion

        #region Business Requirement

        [Route("GetDocumentsById/{vendorID}")]
        [HttpGet]
        public HttpResponseMessage GetDocumentsById(int vendorId)
        {
            List<DocumentsSelectAll_ResultEntity> documents1 = new List<DocumentsSelectAll_ResultEntity>();
            IEnumerable<DocumentsSelectAll_ResultEntity> documents;
            documents = _documentServices.GetDocumentsById(vendorId);
            if (documents == null)
            {

            }
            else
            {
                documents1 = documents.ToList();
            }
            var documentEntities = (List<DocumentsSelectAll_ResultEntity>) documents1 ?? documents1.ToList();
            return Request.CreateResponse(HttpStatusCode.OK, documentEntities);
        }


        [Route("GetDocumentByDocumentId/{documentId}")]
        [HttpGet]
        public HttpResponseMessage GetDocumentByDocumentId(int documentId)
        {
            if (documentId > 0)
            {
                var document = _documentServices.GetDocumentByDocumentId(documentId);
                if (document != null)
                    return Request.CreateResponse(HttpStatusCode.OK, document);
                throw new ApiDataException(1001, "No Document found for this id.", HttpStatusCode.NotFound);
            }
            throw new ApiException() { ErrorCode = (int)HttpStatusCode.BadRequest, ErrorDescription = "Bad Request..." };
        }

        [Route("AddDocument")]
        [HttpPost]
        public HttpResponseMessage AddDocument([FromBody]DocumentEntity modelEntity)
        {
            HttpResponseMessage result;

            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");

            var status = _documentServices.CreateDocuments(modelEntity, "", "");
            
            result = Request.CreateResponse(HttpStatusCode.Created, status);
            return result;
        }

        [Route("UpdateDocument")]
        [HttpPost]
        public HttpResponseMessage UpdateDocument([FromBody]DocumentEntity modelEntity)
        {
            HttpResponseMessage result;

            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");

            var status = _documentServices.UpdateDocument(modelEntity.RowID, modelEntity);
            result = Request.CreateResponse(HttpStatusCode.OK, status);

            return result;
        }

        [Route("DeleteDocument")]
        [HttpPost]
        public HttpResponseMessage DeleteDocument([FromBody]DocumentEntity modelEntity)
        {
            HttpResponseMessage result;

            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");

            result = Request.CreateResponse(HttpStatusCode.OK);

            return result;
        }

        [Route("MergeDocument1")]
        [HttpPost]
        public HttpResponseMessage MergeDocument1([FromBody]List<DocumentEntity> modelEntity)
        {
            HttpResponseMessage result;

            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");

            result = Request.CreateResponse(HttpStatusCode.OK);

            return result;
        }

        [Route("DeleteDocuments")]
        [HttpPost]
        public HttpResponseMessage DeleteDocuments([FromBody]List<DocumentEntity> modelEntity)
        {
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");

            if (modelEntity.Count > 0)
            {
                var docIds = modelEntity.Select(s => s.RowID).ToList();
                var status = _documentServices.DeleteDocuments(docIds, modelEntity[0].LastModifiedBy);

                return Request.CreateResponse(HttpStatusCode.OK, status);
            }
            throw new ApiDataException(1000, "bad request", HttpStatusCode.NotFound);
        }

        [Route("LockDocuments")]
        [HttpPost]
        public HttpResponseMessage LockDocuments([FromBody]List<DocumentEntity> modelEntity)
        {
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");

            if (modelEntity.Count > 0)
            {
                var docIds = modelEntity.Select(s => s.RowID).ToList();
                var status = _documentServices.LockDocuments(docIds, true, modelEntity[0].LockedBy);

                return Request.CreateResponse(HttpStatusCode.OK, status);
            }
            throw new ApiDataException(1000, "bad request", HttpStatusCode.NotFound);
        }

        [Route("UnLockDocuments")]
        [HttpPost]
        public HttpResponseMessage UnLockDocuments([FromBody]List<DocumentEntity> modelEntity)
        {
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");

            if (modelEntity.Count > 0)
            {
                var docIds = modelEntity.Select(s => s.RowID).ToList();
                var status = _documentServices.LockDocuments(docIds, false, modelEntity[0].LockedBy);

                return Request.CreateResponse(HttpStatusCode.OK, status);
            }
            throw new ApiDataException(1000, "bad request", HttpStatusCode.NotFound);
        }


        [Route("GetDocPath/{RowId}")]
        [HttpGet]
        public HttpResponseMessage GetDocPath(int rowId)
        {            
            var document = _documentServices.GetDocumentByDocumentId(rowId);
            string path = document.DocPath;
            var lIndex = path.Trim().LastIndexOf('.');
            var ext = path.Substring(lIndex);
            string localFileLocation = "/Documents/" + rowId + ext;            
            path = path.Replace('~', '/');
            string directoryLocation = WebConfigurationManager.AppSettings["DocumentLocalPath"] + rowId + ext;

            if (!File.Exists(directoryLocation))
            {
                File.Copy(path, directoryLocation);
            }            
            return Request.CreateResponse(HttpStatusCode.OK, localFileLocation);         
        }

        [Route("SaveUploadDocument")]
        [HttpPost]
        public async Task<HttpResponseMessage> SaveUploadDocument()
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            string root = HttpContext.Current.Server.MapPath("~/App_Data");
            var provider = new MultipartFormDataStreamProvider(root);

            try
            {
                await Request.Content.ReadAsMultipartAsync(provider);
                DocumentEntity de = new DocumentEntity();
                // Show all the key-value pairs.
                foreach (var key in provider.FormData.AllKeys)
                {
                    foreach (var val in provider.FormData.GetValues(key))
                    {
                        try
                        {
                            PropertyInfo propertyInfo = de.GetType().GetProperty(key);
                            if (propertyInfo != null)
                            {
                                var targetType = IsNullableType(propertyInfo.PropertyType) ? Nullable.GetUnderlyingType(propertyInfo.PropertyType) : propertyInfo.PropertyType;

                                object propertyVal = Convert.ChangeType(val, targetType);

                                propertyInfo.SetValue(de, propertyVal, null);
                            }
                        }
                        catch (Exception ex)
                        {
                            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message);
                        }
                    }
                }

                de.EnteredDate = DateTime.Now;
                              
                string localfile = "";
                string fileName = "";
                foreach (MultipartFileData fileData in provider.FileData)
                {
                    if (string.IsNullOrEmpty(fileData.Headers.ContentDisposition.FileName))
                    {
                        return Request.CreateResponse(HttpStatusCode.NotAcceptable, "This request is not properly formatted");
                    }
                    fileName = fileData.Headers.ContentDisposition.FileName;
                    if (fileName.StartsWith("\"") && fileName.EndsWith("\""))
                    {
                        fileName = fileName.Trim('"');
                    }
                    if (fileName.Contains(@"/") || fileName.Contains(@"\"))
                    {
                        fileName = Path.GetFileName(fileName);
                    }                    
                    localfile = fileData.LocalFileName;
                    break;
                }
                var status = _documentServices.CreateDocuments(de, localfile, fileName);

                HttpResponseMessage result = Request.CreateResponse(HttpStatusCode.Created, status);
                return result;
            }
            catch (Exception ex)
            {
                //throw e;
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }
        
        private static bool IsNullableType(Type type)
        {
            return type.IsGenericType && type.GetGenericTypeDefinition().Equals(typeof(Nullable<>));
        }
        
        private int get_pageCount(string file)
        {
            PdfReader pdfReader = new PdfReader(file);
            int numberOfPages = pdfReader.NumberOfPages;

            return numberOfPages;
        }
        
        [Route("MergeDocument")]
        [HttpPost]
        public HttpResponseMessage MergeDocument([FromBody] MergeDocumentRequestDTO modelEntity)
        {
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Please provide all the required fields.");

            HttpResponseMessage result = new HttpResponseMessage();
            //First check if there are added documents.
            if (modelEntity.MergeDocuments.Count >= 2)
            {
                //FunctionReturn fr;

                PdfReader reader;
                Document sourceDocument;
                PdfCopy pdfCopyProvider;
                PdfImportedPage importedPage;

                sourceDocument = new Document();
                MemoryStream mStream = new MemoryStream();

                pdfCopyProvider = new PdfCopy(sourceDocument, mStream);
                sourceDocument.Open();
                
                foreach (var docItem in modelEntity.MergeDocuments)
                {
                    var docObj = _documentServices.GetDocumentByDocumentId(docItem.RowID);
                    int pages = get_pageCount(docObj.DocPath);
                    reader = new PdfReader(docObj.DocPath);
                    for (int i = 1; i <= pages; i++)
                    {
                        importedPage = pdfCopyProvider.GetImportedPage(reader, i);
                        pdfCopyProvider.AddPage(importedPage);
                    }

                    reader.Close();
                }
                pdfCopyProvider.CloseStream = false;
                sourceDocument.Close();
                
                string fileName = modelEntity.DocumentDetails.Description + ".pdf";
                string directoryLocation = WebConfigurationManager.AppSettings["DocumentLocalPath"] +
                    modelEntity.DocumentDetails.ID1 + "-" + DateTime.Now.Ticks + ".pdf";
                FileStream file = new FileStream(directoryLocation, FileMode.Create, FileAccess.Write);
                mStream.WriteTo(file);
                file.Close();
                mStream.Close();

                var status = _documentServices.CreateDocuments(modelEntity.DocumentDetails, directoryLocation, fileName);
                result = Request.CreateResponse(HttpStatusCode.OK, status);
            }

            return result;  
        }

        [Route("MergeTitleDocument")]
        [HttpPost]
        public HttpResponseMessage MergeTitleDocument(List<int> rowIds)
        {
            HttpResponseMessage result = new HttpResponseMessage();
            //First check if there are added documents.
            if (rowIds.Count >= 2)
            {
                //FunctionReturn fr;

                PdfReader reader;
                Document sourceDocument;
                PdfCopy pdfCopyProvider;
                PdfImportedPage importedPage;

                sourceDocument = new Document();
                MemoryStream mStream = new MemoryStream();

                pdfCopyProvider = new PdfCopy(sourceDocument, mStream);
                sourceDocument.Open();
                
                foreach (int rowId in rowIds)
                {
                    if (rowId != 0)
                    {
                        var docObj = _documentServices.GetDocumentByDocumentId(rowId);
                        int pages = get_pageCount(docObj.DocPath);
                        reader = new PdfReader(docObj.DocPath);
                        for (int i = 1; i <= pages; i++)
                        {
                            importedPage = pdfCopyProvider.GetImportedPage(reader, i);
                            pdfCopyProvider.AddPage(importedPage);
                        }

                        reader.Close();
                    }
                }
                pdfCopyProvider.CloseStream = false;
                sourceDocument.Close();
                

                string fileName = DateTime.Now.Ticks + ".pdf";
                string directoryLocation = WebConfigurationManager.AppSettings["DocumentLocalPath"] +  fileName;
                FileStream file = new FileStream(directoryLocation, FileMode.Create, FileAccess.Write);
                mStream.WriteTo(file);
                file.Close();
                mStream.Close();
                 
                result = Request.CreateResponse(HttpStatusCode.OK, "/Documents/"+fileName);
            }

            return result;
        }
        
        
        [Route("GetOrderDetailByOrderNo/{orderNo}")]
        [HttpGet]
        public HttpResponseMessage GetOrderDetailByOrderNo(int orderNo)
        {
            var orderDetails = _documentServices.GetOrderDetailByOrderNo(orderNo);
            if (orderDetails != null)
            {
                var data = orderDetails as List<OrderDetailDTO> ?? orderDetails.ToList();
                if (data.Any())
                {
                    return Request.CreateResponse(HttpStatusCode.OK, data);
                }
            }
            throw new ApiDataException(1000, "Document not found", HttpStatusCode.NotFound);
        }

        #endregion 
    }
}
