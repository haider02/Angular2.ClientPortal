using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using MC.BusinessEntities.Models.DTO;
using MC.DataModel;
using MC.DataModel.UnitOfWork;

namespace MC.BusinessServices.ClientPortal
{
    public class GenerateDocumentService : IGenerateDocumentService
    {
        private readonly UnitOfWork _unitOfWork;

        public GenerateDocumentService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public List<GenerateDocumentDTO> GetNyDocumentList() {

            List<CPGetDownloadDocumentList_Result> result = _unitOfWork.CPGetDownloadDocumentList();
            if (result.Any())
            {                
                var config = new MapperConfiguration(cfg => cfg.CreateMap<CPGetDownloadDocumentList_Result, GenerateDocumentDTO>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<CPGetDownloadDocumentList_Result>, List<GenerateDocumentDTO>>(result);
                return data;
            }

            return new List<GenerateDocumentDTO>();
        }
    }
}
