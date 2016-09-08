using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using MC.BusinessEntities.Models.DTO;
using MC.DataModel;
using MC.DataModel.UnitOfWork;

namespace MC.BusinessServices
{
    public class AccountServices : IAccountServices
    {
        private readonly UnitOfWork _unitOfWork;



        /// <summary>
        /// Public constructor.
        /// </summary>
        public AccountServices(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        public IEnumerable<object> GetAccountProfileData(int contactId)
        {
            return _unitOfWork.GetAccountProfile(contactId);            
        }

        public IEnumerable<RolePerimssionDTO> CpGetPermissionsAgainstRole(int roleId, string screenName)
        {

            var details = _unitOfWork.CPGetPermissionsAgainstRole(roleId,screenName).ToList();
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<CPGetPermissionsAgainstRole_Result, RolePerimssionDTO>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<CPGetPermissionsAgainstRole_Result>, List<RolePerimssionDTO>>(details);
                return data;
            }
        }

        public IEnumerable<object> GetAllWebRoles(string type, string partyType)
        {
            return _unitOfWork.WebRolesRepository.GetMany(x => x.Type == type && x.PartyType == partyType).ToList();
        }
    }
}
