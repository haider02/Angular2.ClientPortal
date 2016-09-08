using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using AutoMapper;
using MC.BusinessEntities.Models;
using MC.DataModel;
using MC.DataModel.UnitOfWork;
using System;
using MC.BusinessEntities.Models.DTO;

namespace MC.BusinessServices.ClientPortal
{
    public class SecurityFormControlControlConfigService : ISecurityFormControlControlConfigService
    {
        private readonly UnitOfWork _unitOfWork;

        public SecurityFormControlControlConfigService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IEnumerable<SecurityFormControlConfigGridDTO> CpGetSecurityFormControlsConfig(int applicationId)
        {

            var details = _unitOfWork.CPGetSecurityFormControlsConfig(applicationId).ToList();
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<CPGetSecurityFormControlsConfig_Result, SecurityFormControlConfigGridDTO>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<CPGetSecurityFormControlsConfig_Result>, List<SecurityFormControlConfigGridDTO>>(details);
                return data;
            }
        }

        public bool CreateUpdateSecurityFormControlConfig(SecurityControlFormConfigEntity securityControlFormConfigEntity)
        {
            using (var scope = new TransactionScope())
            {                
                SecurityFormControlConfig sc = new SecurityFormControlConfig()
                {
                    IsAuditEnabled=securityControlFormConfigEntity.IsAuditEnabled,
                    IsVisible=securityControlFormConfigEntity.IsVisible,
                    IsEnabled=securityControlFormConfigEntity.IsEnabled,
                    RoleId=securityControlFormConfigEntity.RoleId,
                    SecurityFormControlConfigId=securityControlFormConfigEntity.SecurityFormControlConfigId,
                    SecurityFormControlId=securityControlFormConfigEntity.SecurityFormControlId,
                    CreatedBy = securityControlFormConfigEntity.CreatedBy,
                    CreatedDate = securityControlFormConfigEntity.CreatedDate,
                    Inactive = securityControlFormConfigEntity.Inactive,
                    LastModBy = securityControlFormConfigEntity.LastModBy,
                    LastModDate = securityControlFormConfigEntity.LastModDate,
                        
                };

                if (securityControlFormConfigEntity.SecurityFormControlConfigId > 0)
                {
                    sc.LastModDate = DateTime.Now;
                    _unitOfWork.SecurityFormControlConfigRepository.Update(sc);
                    _unitOfWork.Save();
                    scope.Complete();
                }
                else
                {
                    sc.LastModDate = DateTime.Now;
                    sc.CreatedDate = DateTime.Now;
                    _unitOfWork.SecurityFormControlConfigRepository.Insert(sc);
                    _unitOfWork.Save();
                    scope.Complete();
                }
                return true;
            }
        }

        public int DeleteSecurityControlConfig(int securityControlConfigId)
        {
            int success = 0;
            if (securityControlConfigId > 0)
            {
                using (var scope = new TransactionScope())
                {
                    var securityControl = _unitOfWork.SecurityFormControlConfigRepository.GetByID(securityControlConfigId);
                    if (securityControl != null)
                    {   
                        _unitOfWork.SecurityFormControlConfigRepository.Delete(securityControl);
                        _unitOfWork.Save();
                        scope.Complete();
                        success = 1;
                    }
                }
            }
            return success;
        }
    }
}
