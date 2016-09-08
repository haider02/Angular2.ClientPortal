using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using MC.BusinessEntities.Models;
using MC.DataModel.UnitOfWork;
using MC.DataModel;
using System.Transactions;

namespace MC.BusinessServices
{
    public class OrderNotesService : IOrderNotesService
    {
        private readonly UnitOfWork _unitOfWork;

        /// <summary>
        /// Public constructor.
        /// </summary>
        public OrderNotesService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        /// <summary>
        /// Fetches OrderNotes by OrderNo
        /// </summary>
        /// <returns></returns>
        public IEnumerable<OrderNotesEntity> GetOrderNotesByOrderNo(int orderNo)
        {
            
            var orderNotesList = _unitOfWork.OrderNotesByOrderNo(orderNo).ToList();
            {                
                var config = new MapperConfiguration(cfg => cfg.CreateMap<CPSearchOrderNotesByOrderNo_Result, OrderNotesEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<CPSearchOrderNotesByOrderNo_Result>, List<OrderNotesEntity>>(orderNotesList);
                return data;
            }
        }

        public bool SaveOrderNotes(OrderNotesEntity noteData)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<OrderNotesEntity, OrderNotes>());
            var mapper = config.CreateMapper();
            OrderNotes savedNote = mapper.Map<OrderNotesEntity, OrderNotes>(noteData);

            using (var scope = new TransactionScope())
            {
                if (noteData.NoteId <= 0)
                {
                    savedNote.Suffix = "OT";
                    savedNote.Priority = false;
                    savedNote.ClientViewable = true;
                    savedNote.NoteSource = "I";
                    savedNote.ItemNo = 1;
                    _unitOfWork.OrderNotesRepository.Insert(savedNote);
                }
                else
                    _unitOfWork.OrderNotesRepository.Update(savedNote);

                _unitOfWork.Save();
                scope.Complete();
                return true;                
            }
        }

        public int CpAddOrderNoteInEmailQueue(int orderNo, string note, string noteType)
        {
            return _unitOfWork.CPAddOrderNoteInEmailQueue(orderNo, note,noteType);
        }
    }
}
