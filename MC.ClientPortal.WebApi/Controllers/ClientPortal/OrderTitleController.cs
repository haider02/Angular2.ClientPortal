using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MC.BusinessEntities.Models;
using MC.ClientPortal.WebApi.ErrorHelper;
using System.IO;
using MC.BusinessEntities.Models.DTO;
using Microsoft.AspNet.Identity;
using MC.BusinessServices.ClientPortal;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.Web.Configuration;
using MC.ClientPortal.WebApi.ActionFilters;

namespace MC.ClientPortal.WebApi.Controllers.ClientPortal
{
    [ApiAuthorization]
    [RoutePrefix("api/OrderTitle")]
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    public class OrderTitleController : ApiController
    {
        private readonly IOrderTitleService _orderTitle;        

        #region Public Constructor
        /// <summary>
        /// Public constructor to initialize Order Title service instance
        /// </summary>
        public OrderTitleController(IOrderTitleService orderTitleServices)
        {
            _orderTitle = orderTitleServices;  
        }
        #endregion

        [HttpGet]
        [Route("GetOrderTitleDetail/{OrderNo}")]
        public HttpResponseMessage GetOrderTitleDetail(int orderNo)
        {
            var data = _orderTitle.CpGetOrderTitleDetail(orderNo);
            if (data != null)
            {
                var details = data as List<OrderTitleDTO> ?? data.ToList();
                if (details.Any())
                    return Request.CreateResponse(HttpStatusCode.OK, details);
            }            
            var message = String.Format("Not Data Found For OrderNo {0}", orderNo);
            var httpError = new HttpError(message);
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, httpError);
        }

        [HttpPost]
        [Route("CPAddTitleRequestEvent/{OrderNo}")]
        public HttpResponseMessage CPAddTitleRequestEvent(int orderNo)
        {
            try
            {
                int data = _orderTitle.CpAddTitleBillReqEvent(orderNo);
                return Request.CreateResponse(HttpStatusCode.OK, true);
            }
            catch(Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message);
            }           
        }

        [HttpPost]
        [Route("CPAddTitleProduct/{OrderNo}")]
        public HttpResponseMessage CPAddTitleProduct(int orderNo)
        {
            try
            {
                int data = _orderTitle.CpAddTitleProduct(orderNo);
                return Request.CreateResponse(HttpStatusCode.OK, true);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message);
            }

        }

        [HttpGet]
        [Route("CPGetTitleDocumentsSelectAll/{OrderNo}")]
        public HttpResponseMessage CPGetTitleDocumentsSelectAll(int orderNo)
        {            
            if (orderNo != 0)
            {
                var document = _orderTitle.CpGetTitleDocumentsSelectAll(orderNo);
                if(document==null)
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "No Document found for this id.");

                var leinsDocument = document.Where(x => x.DocumentFolder.ToLower().Contains("lien")).ToList();

                if(leinsDocument.Count>0)
                {
                    var leinsDetails = _orderTitle.CpGetLeinsDetail(orderNo);
                    if (leinsDetails != null)
                    {
                        string fileName = "Cover" + DateTime.Now.Ticks + ".pdf";
                        string directoryLocation = WebConfigurationManager.AppSettings["DocumentLocalPath"] + fileName;
                        FileStream fs = new FileStream(directoryLocation, FileMode.Create, FileAccess.Write);
                        Rectangle rec2 = new Rectangle(PageSize.A4);
                        Document doc = new Document(rec2);
                        
                        doc.Open();                        

                        PdfPTable table1 = new PdfPTable(2);
                        table1.DefaultCell.Border = 0;
                        table1.WidthPercentage = 60;

                        //Row 1
                        PdfPCell cell11 = new PdfPCell();
                        cell11.Colspan = 2;
                        BaseFont bfTimes = BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, false);
                        Font headerFont = new Font(bfTimes, 20, Font.BOLD, BaseColor.BLACK);
                        cell11.AddElement(new Paragraph("Judgement/Lien Cover Letter", headerFont));
                        cell11.Border = 0;
                        table1.AddCell(cell11);

                        int i = 1;
                        foreach (LeinsDetailDTO lein in leinsDetails)
                        {
                            PdfPCell cell21 = new PdfPCell();
                            cell21.Colspan = 2;
                            cell21.Border = 0;
                            Font subHeaderFont = new Font(bfTimes, 12, Font.BOLD, BaseColor.BLACK);
                            cell21.AddElement(new Paragraph("Lien "+ i, headerFont));
                            

                            Font contentFont = new Font(bfTimes, 8, Font.NORMAL, BaseColor.BLACK);

                            PdfPCell cell31 = new PdfPCell();
                            cell31.Colspan = 1;
                            cell31.Border = 0;
                            cell31.AddElement(new Paragraph("Plaintiff :", contentFont)); 
                            PdfPCell cell32 = new PdfPCell();
                            cell32.Colspan = 1;
                            cell32.Border = 0;
                            cell32.AddElement(new Paragraph(lein.Plaintiff, contentFont));

                            PdfPCell cell41 = new PdfPCell();
                            cell41.Colspan = 1;
                            cell41.Border = 0;
                            cell41.AddElement(new Paragraph("Defendent :", contentFont));
                            PdfPCell cell42 = new PdfPCell();
                            cell42.Colspan = 1;
                            cell42.Border = 0;
                            cell42.AddElement(new Paragraph(lein.Defendant, contentFont));

                            PdfPCell cell51 = new PdfPCell();
                            cell51.Colspan = 1;
                            cell51.Border = 0;
                            cell51.AddElement(new Paragraph("Recording Date :", contentFont));
                            PdfPCell cell52 = new PdfPCell();
                            cell52.Colspan = 1;
                            cell52.Border = 0;
                            cell52.AddElement(new Paragraph(lein.RecordedDate.ToString(), contentFont));

                            PdfPCell cell61 = new PdfPCell();
                            cell61.Colspan = 1;
                            cell61.Border = 0;

                            cell61.AddElement(new Paragraph("Lient Amount :", contentFont));
                            PdfPCell cell62 = new PdfPCell();
                            cell62.Colspan = 1;
                            cell62.Border = 0;
                            cell62.AddElement(new Paragraph(lein.LienAmount.ToString(), contentFont));

                            table1.AddCell(cell21);
                            table1.AddCell(cell31);
                            table1.AddCell(cell32);
                            table1.AddCell(cell41);
                            table1.AddCell(cell42);
                            table1.AddCell(cell51);
                            table1.AddCell(cell52);
                            table1.AddCell(cell61);
                            table1.AddCell(cell62);
                            i=i+1;
                        }

                        doc.Add(table1);
                        doc.Close();
                        DocumentsSelectAll_ResultEntity coverLetter = new DocumentsSelectAll_ResultEntity()
                        {
                            ID1 = orderNo,
                            ID2 = 1,
                            DocumentFolder = "Copies of Open Liens",
                            DocPath = "/Documents/" + fileName,
                            DocType = "0",
                            Description = "Lein Cover Letter",
                            FullDescription = "Lein Cover Letter",
                            DocDescription = "JUDGMENT/LIEN REPORT",
                            ClientViewable = true,
                            ProductCategory= "Main"
                        };
                        List<DocumentsSelectAll_ResultEntity> documentList;
                        documentList = document.ToList();
                        documentList.Insert(0,coverLetter);
                        document = documentList;

                    }
                }
                if (document != null)
                    return Request.CreateResponse(HttpStatusCode.OK, document);
            }
            throw new ApiException() { ErrorCode = (int)HttpStatusCode.BadRequest, ErrorDescription = "Bad Request..." };
        }
    }
}
