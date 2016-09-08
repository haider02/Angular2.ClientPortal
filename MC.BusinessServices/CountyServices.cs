using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using MC.BusinessEntities.Models;
using MC.DataModel;
using MC.DataModel.UnitOfWork;

namespace MC.BusinessServices
{
    public class CountyServices : ICountyServices
    {
        private readonly UnitOfWork _unitOfWork;

        /// <summary>
        /// Public constructor.
        /// </summary>
        public CountyServices(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IEnumerable<CountyEntity> GetAllCounty()
        {
            var counties = _unitOfWork.CountyRepository.GetAll().ToList();
            if (counties.Any())
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<Counties, CountyEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<Counties>, List<CountyEntity>>(counties);
                return data;
            }
            return null;
        }

        public IEnumerable<CountyEntity> GetAllCountyByStates(List<string> states)
        {
            var counties = _unitOfWork.CountyRepository.GetMany(x => states.Contains(x.StateAbbr)).ToList();
            if (counties.Any())
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<Counties, CountyEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<Counties>, List<CountyEntity>>(counties);
                return data;
            }
            return null;
        }

        public IEnumerable<CountyEntity> GetAllCountyByStateAbbr(string stateAbbr)
        {
            var counties = _unitOfWork.CountyRepository.GetMany(x => x.StateAbbr == stateAbbr).ToList();
            if (counties.Any())
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<Counties, CountyEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<Counties>, List<CountyEntity>>(counties);
                return data;
            }
            return null;
        }


        public IEnumerable<StateCountyFromZipResultEntity> GetStateCountyFromZip(string zip)
        {
            var dbResult = _unitOfWork.GetStateCountyFromZip(zip);
            List<StateCountyFromZipResultEntity> result = new List<StateCountyFromZipResultEntity>();

            for (int index = 0; index < dbResult.Count; index++)
            {
                result.Add(new StateCountyFromZipResultEntity()
                {
                    CityName = dbResult[index].CityName,
                    CountyCode = dbResult[index].CountyCode,
                    CountyName = dbResult[index].CountyName,
                    RateJurisdictionId = dbResult[index].RateJurisdictionId.HasValue ? dbResult[index].RateJurisdictionId.Value : -1,
                    RefinanceOrigAmtsNeeded = dbResult[index].RefinanceOrigAmtsNeeded,
                    RefinancePrevAmtsNeeded = dbResult[index].RefinancePrevAmtsNeeded,
                    StateAbbr = dbResult[index].StateAbbr
                });
            }

            return result;
        }


    }
}
