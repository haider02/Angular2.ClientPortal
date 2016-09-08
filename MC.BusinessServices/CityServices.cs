using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using MC.BusinessEntities.Models;
using MC.DataModel.UnitOfWork;
using MC.DataModel;

namespace MC.BusinessServices
{
    public class CityServices : ICityServices
    {

        private readonly UnitOfWork _unitOfWork;

        /// <summary>
        /// Public constructor.
        /// </summary>
        public CityServices(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        
        public IEnumerable<CityEntity> GetAllCityByStates(string stateAbbr)
        {            
            var cities = _unitOfWork.CityRepository.GetMany(x => x.StateAbbr == stateAbbr).Distinct().ToList();
            if (cities.Any())
            {                
                var config = new MapperConfiguration(cfg => cfg.CreateMap<Cities, CityEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<Cities>, List<CityEntity>>(cities);
                return data;

            }

            return null;
        }
        
        public IEnumerable<CityEntity> GetAll()
        {
            var cities = _unitOfWork.CityRepository.GetAll().Distinct().ToList();

            if (cities.Any())
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<Cities, CityEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<Cities>, List<CityEntity>>(cities);
                return data;
            }
            return null;
        }
    }
}
