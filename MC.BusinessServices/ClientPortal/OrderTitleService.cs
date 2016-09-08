using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using MC.BusinessEntities.Models;
using MC.DataModel.UnitOfWork;
using MC.DataModel;
using MC.BusinessEntities.Models.DTO;
using System.Data;

namespace MC.BusinessServices.ClientPortal
{
    public class OrderTitleService : IOrderTitleService
    {
        private readonly UnitOfWork _unitOfWork;        

        /// <summary>
        /// Public constructor.
        /// </summary>
        public OrderTitleService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;            
        }

        /// <summary>
        /// Fetches Title Order Details by OrderNo
        /// </summary>
        /// <returns></returns>
        public IEnumerable<OrderTitleDTO> CpGetOrderTitleDetail(int orderNo)
        {

            var details = _unitOfWork.CPGetOrderTitleDetail(orderNo).ToList();
            {   
                var config = new MapperConfiguration(cfg => cfg.CreateMap<CPGetTitleOrderDetails_Result, OrderTitleDTO>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<CPGetTitleOrderDetails_Result>, List<OrderTitleDTO>>(details);
                return data;
            }
        }


        public int CpAddTitleBillReqEvent(int orderNo)
        {
            return _unitOfWork.CPAddTitleBillReqEvent(orderNo);
        }

        public int CpAddTitleProduct(int orderNo)
        {
            return _unitOfWork.CPAddTitleProduct(orderNo);
        }
        
        public IEnumerable<DocumentsSelectAll_ResultEntity> CpGetTitleDocumentsSelectAll(int orderNo)
        {
            var dl = _unitOfWork.CPGetTitleDocumentsSelectAll(orderNo);            
            if (dl.Any())
            {   
                var config = new MapperConfiguration(cfg => cfg.CreateMap<CPGetTitleDocumentsSelectAll_Result, DocumentsSelectAll_ResultEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<CPGetTitleDocumentsSelectAll_Result>, List<DocumentsSelectAll_ResultEntity>>(dl);
                return data;
            }
            return new List<DocumentsSelectAll_ResultEntity>();
        }
        public IEnumerable<LeinsDetailDTO> CpGetLeinsDetail(int orderNo)
        {
            List<CPGetLeinsDetail_Result> leins = new List<CPGetLeinsDetail_Result>();
            var dl = _unitOfWork.CPGetLeinsDetail(orderNo);
            if (dl != null)
            {
                leins = dl.ToList();
            }
            if (leins.Any())
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<CPGetLeinsDetail_Result, LeinsDetailDTO>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<CPGetLeinsDetail_Result>, List<LeinsDetailDTO>>(leins);
                return data;
            }
            return null;
        }

    }
}
