using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using AutoMapper;
using MC.BusinessEntities.Models;
using MC.DataModel;
using MC.DataModel.UnitOfWork;
using System;

namespace MC.BusinessServices.ClientPortal
{
    public class SecurityControlService : ISecurityControlService
    {
        private readonly UnitOfWork _unitOfWork;

        public SecurityControlService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IEnumerable<SecurityControlEntity> GetAllSecurityControls()
        {
            var securityControl = _unitOfWork.SecurityControlRepository.GetMany(x => x.Inactive == false).ToList();
            if (securityControl.Any())
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<SecurityControl, SecurityControlEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<SecurityControl>, List<SecurityControlEntity>>(securityControl);
                return data;
            }
            return null;
        }

        public bool CreateUpdateSecurityControl(SecurityControlEntity securityControlEntity)
        {
            using (var scope = new TransactionScope())
            {
                SecurityControl sc = new SecurityControl()
                {
                    ControlType = securityControlEntity.ControlType,
                    CreatedBy = securityControlEntity.CreatedBy,
                    CreatedDate = securityControlEntity.CreatedDate,
                    Description = securityControlEntity.Description,
                    Inactive = securityControlEntity.Inactive,
                    LastModBy = securityControlEntity.LastModBy,
                    LastModDate = securityControlEntity.LastModDate,
                    SecurityControlId = securityControlEntity.SecurityControlId
                };

                if (securityControlEntity.SecurityControlId > 0)
                {
                    sc.LastModDate = DateTime.Now;
                    _unitOfWork.SecurityControlRepository.Update(sc);
                    _unitOfWork.Save();
                    scope.Complete();
                }
                else
                {
                    sc.LastModDate = DateTime.Now;
                    sc.CreatedDate = DateTime.Now;
                    _unitOfWork.SecurityControlRepository.Insert(sc);
                    _unitOfWork.Save();
                    scope.Complete();
                }
                return true;
            }
        }

        public int DeleteSecurityControl(int securityControlId)
        {
            int success = 0;
            if (securityControlId > 0)
            {                
                success = _unitOfWork.CPDeleteSecurityControl(securityControlId);                
            }
            return success;
        }
    }
}
