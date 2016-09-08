using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using MC.BusinessEntities.Models;
using MC.BusinessEntities.Models.DTO;
using MC.DataModel;
using MC.DataModel.UnitOfWork;

namespace MC.BusinessServices.ClientPortal
{
    public class DashBoardService : IDashBoardService
    {

        private readonly UnitOfWork _unitOfWork;

        /// <summary>
        /// Public constructor.
        /// </summary>
        public DashBoardService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        
        public List<GetClientList_ResultEntity> GetClientList(int parentId)
        {
            List<CPGetClientList_Result> result = _unitOfWork.CPGetClientList(parentId);
            if (result.Any())
            {

                var config = new MapperConfiguration(cfg => cfg.CreateMap<CPGetClientList_Result, GetClientList_ResultEntity>());
                var mapper = config.CreateMapper();
                var resultList = mapper.Map<List<CPGetClientList_Result>, List<GetClientList_ResultEntity>>(result);
                return resultList;                
            }
            return new List<GetClientList_ResultEntity>();
        }

        public IEnumerable<OrderSearchResultEntity> GetDashBoardOrderSearch(DashBoardRequest request)
        {
            var resultList = _unitOfWork.CPOrderSearch(request.BorrowerName, request.LoanNo, request.OrderNo, request.LoanOfficer, request.TransactionType,
                                    request.Status, request.ClientFilterVal, request.ClientId, request.ShowSubClients, request.DefaultPastDays);

            if (resultList.Any())
            {                
                var config = new MapperConfiguration(cfg => cfg.CreateMap<CPOrderSearch_Result, OrderSearchResultEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<CPOrderSearch_Result>, List<OrderSearchResultEntity>>(resultList);
                return data;
            }

            return new List<OrderSearchResultEntity>();
        }

        public List<GetOrderSummary_ResultEntity> GetOrderSummary(int orderNo)
        {
            List<CPOrderSummary_Result> result = _unitOfWork.CPOrderSummary(orderNo);
            if (result.Any())
            {                
                var config = new MapperConfiguration(cfg => cfg.CreateMap<CPOrderSummary_Result, GetOrderSummary_ResultEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<CPOrderSummary_Result>, List<GetOrderSummary_ResultEntity>>(result);
                return data;
            }
            return new List<GetOrderSummary_ResultEntity>();
        }

        public IEnumerable<object> OrderDetailsItemsSelect(int orderNo, bool titleOnly, bool closingOnly)
        {
            return _unitOfWork.OrderDetailsItemsSelect(orderNo, titleOnly, closingOnly);
        }
    }
}
