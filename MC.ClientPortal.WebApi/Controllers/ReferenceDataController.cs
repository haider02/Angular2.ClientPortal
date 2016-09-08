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
    [RoutePrefix("api/ReferenceData")]
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    public class ReferenceDataController : ApiController
    {

        #region Private variable.

        private readonly IReferenceDataServices _referenceDataServices;

        #endregion


        #region Public Constructor

        /// <summary>
        /// Public constructor to initialize product service instance
        /// </summary>
        public ReferenceDataController(IReferenceDataServices stateServices)
        {
            _referenceDataServices = stateServices;
        }

        #endregion


        [Route("GetComboEntitybyCode/{cboId}")]
        public HttpResponseMessage GetComboEntitybyCode(string cboId)
        {
            return Request.CreateResponse(HttpStatusCode.OK, GetComboEntries(cboId));
        }

        [Route("GetComboEntitybyCode/{cboId}/{cboBehavior}")]
        public HttpResponseMessage GetComboEntitybyCode(string cboId, string cboBehavior)
        {
            var cboList = GetComboEntries(cboId);
            cboList = cboList.Where(w => w.cboBehavior!=null && w.cboBehavior.ToLower().Contains(cboBehavior.ToLower())).ToList();
            return Request.CreateResponse(HttpStatusCode.OK, cboList);
        }

        private List<ComboEntryEntity> GetComboEntries(string cboId)
        {
            List<ComboEntryEntity> cblist = new List<ComboEntryEntity>();
            var referenceData = _referenceDataServices.GetComboEntityByCboId(cboId);
            if (referenceData != null)
                cblist = referenceData.ToList();
            var referenceEntities = cblist; 
            ComboEntryEntity defualt = new ComboEntryEntity
            {
                cboEntry = "Please Select",
                RowId = -1,

            };
            if (cboId != "VendorLanguage")
                referenceEntities.Insert(0, defualt);

            return cblist;
        }

        [Route("GetComboEntitybyRowId/{rowId}")]
        [HttpGet]
        public HttpResponseMessage GetComboEntitybyRowId(string rowId)
        {
            List<ComboEntryEntity> cblist = new List<ComboEntryEntity>();
            var referenceData = _referenceDataServices.GetComboEntityByRowId(rowId);
            if (referenceData != null)
                cblist = referenceData.ToList();
            var referenceEntities = cblist;
            return Request.CreateResponse(HttpStatusCode.OK, referenceEntities);
        }


        [Route("OrderDetailsItemsSelect")]
        [HttpGet]
        public HttpResponseMessage OrderDetailsItemsSelect()
        {
            List<OrderDetailsItemsSelect_ResultEntity> resultList = new List<OrderDetailsItemsSelect_ResultEntity>();
            var result = _referenceDataServices.OrderDetailsItemsSelect();
            if (result != null)
                resultList = result.ToList();
            var referenceEntities = resultList;

            return Request.CreateResponse(HttpStatusCode.OK, referenceEntities);
        }

        [Route("DocumentTypesSelectAllByProdCat/{docTypeCat}")]
        [HttpGet]
        public HttpResponseMessage OrderDetailsItemsSelect(string docTypeCat)
        {
            List<DocumentTypesSelectAllByProdCat_ResultEntity> resultList = new List<DocumentTypesSelectAllByProdCat_ResultEntity>();
            var result = _referenceDataServices.DocumentTypesSelectAllByProdCat(docTypeCat);
            if (result != null)
                resultList = result.ToList();
            var referenceEntities = resultList;

            return Request.CreateResponse(HttpStatusCode.OK, referenceEntities);
        }

    
    }
}
