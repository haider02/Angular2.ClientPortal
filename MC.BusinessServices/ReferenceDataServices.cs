using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using MC.BusinessEntities.Models;
using MC.DataModel;
using MC.DataModel.UnitOfWork;

namespace MC.BusinessServices
{
    public class ReferenceDataServices : IReferenceDataServices
    {
        private readonly UnitOfWork _unitOfWork;

        /// <summary>
        /// Public constructor.
        /// </summary>
        public ReferenceDataServices(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IEnumerable<ComboEntryEntity> GetComboEntityByCboId(string cboId)
        {
            var entries = _unitOfWork.ComboEntryRepository.GetMany(x => x.cboId == cboId).ToList();
            if (entries.Any())
            {   
                var config = new MapperConfiguration(cfg => cfg.CreateMap<ComboEntries, ComboEntryEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<ComboEntries>, List<ComboEntryEntity>>(entries);
                return data;
            }
            return null;
        }

        public IEnumerable<ComboEntryEntity> GetComboEntityByRowId(string rowId)
        {
           int rowNumber= Int32.Parse(rowId);
           var entries = _unitOfWork.ComboEntryRepository.GetMany(x => x.RowId == rowNumber).ToList();
            if (entries.Any())
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<ComboEntries, ComboEntryEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<ComboEntries>, List<ComboEntryEntity>>(entries);
                return data;
            }
            return null;
        }


        public IEnumerable<OrderDetailsItemsSelect_ResultEntity> OrderDetailsItemsSelect()
        {
            var result = _unitOfWork.OrderDetailsItemsSelect(null, false, false);
            if (result != null)
            {                
                var config = new MapperConfiguration(cfg => cfg.CreateMap<OrderDetailsItemsSelect_Result, OrderDetailsItemsSelect_ResultEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<OrderDetailsItemsSelect_Result>, List<OrderDetailsItemsSelect_ResultEntity>>(result);
                return data;
            }
            return null;
        }

        public IEnumerable<DocumentTypesSelectAllByProdCat_ResultEntity> DocumentTypesSelectAllByProdCat(string docTypeCat)
        {
            var result = _unitOfWork.DocumentTypesSelectAllByProdCat(docTypeCat, false);
            if (result != null)
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<DocumentTypesSelectAllByProdCat_Result, DocumentTypesSelectAllByProdCat_ResultEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<DocumentTypesSelectAllByProdCat_Result>, List<DocumentTypesSelectAllByProdCat_ResultEntity>>(result);
                return data;
            }
            return null;
        }
        


    }
}
