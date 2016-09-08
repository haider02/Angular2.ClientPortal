using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using MC.BusinessEntities.Models;
using MC.DataModel.UnitOfWork;
using MC.DataModel;

namespace MC.BusinessServices
{
    public class StateServices : IStateServices
    {

        private readonly UnitOfWork _unitOfWork;

        /// <summary>
        /// Public constructor.
        /// </summary>
        public StateServices(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IEnumerable<StatesEntity> GetAllStates()
        {
            var states = _unitOfWork.StatesRepository.GetAll().ToList();
            if (states.Any())
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<States, StatesEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<States>, List<StatesEntity>>(states);
                return data;
            }
            return null;
        }

    }
}
