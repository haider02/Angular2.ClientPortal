using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using MC.BusinessEntities.Models;
using MC.DataModel;
using MC.DataModel.UnitOfWork;

namespace MC.BusinessServices.ClientPortal
{
    public class OrderSummaryService : IOrderSummaryService
    {
        private readonly UnitOfWork _unitOfWork;

        /// <summary>
        /// Public constructor.
        /// </summary>
        public OrderSummaryService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public List<GetOrderHeader_ResultEntity> CpOrderHeader(int orderNo)
        {
            List<CPGetOrderHeader_Result> result = _unitOfWork.CPOrderHeader(orderNo);
            if (result.Any())
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<CPGetOrderHeader_Result, GetOrderHeader_ResultEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<CPGetOrderHeader_Result>, List<GetOrderHeader_ResultEntity>>(result);
                return data;
            }
            return new List<GetOrderHeader_ResultEntity>();
        }

        public string GetProductCodeByOrder(int orderNo)
        {
            return _unitOfWork.GetProductCodeByOrder(orderNo);
        }

        public IEnumerable<object> GetMileStoneTracker(int orderNo, string productCode)
        {
            if (productCode == "Refinance")
                return _unitOfWork.GetTitleMileStone(orderNo);
            else if (productCode == "Purchase")
                return _unitOfWork.GetPurchaseMileStone(orderNo);
            else if (productCode == "COOP")
                return _unitOfWork.GetCOOPMileStone(orderNo);

            return null;
        }

        public IEnumerable<object> GetCheckList(int orderNo, string productCode)
        {
            if (productCode == "Refinance")
                return _unitOfWork.GetTitleCheckList(orderNo);
            else if (productCode == "Purchase")
                return _unitOfWork.GetPurchaseCheckList(orderNo);
            else if (productCode == "COOP")
                return _unitOfWork.GetCOOPCheckList(orderNo);

            return null;
        }

        public int SaveOrderStatus(int orderNo)
        {
            return _unitOfWork.SaveOrderStatus(orderNo);
        }
    }
}
