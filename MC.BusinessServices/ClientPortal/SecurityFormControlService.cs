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
    public class SecurityFormControlService : ISecurityFormControlService
    {
        private readonly UnitOfWork _unitOfWork;

        public SecurityFormControlService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IEnumerable<SecurityFromControlGridDTO> CpGetSecurityFormControls(int applicationId)
        {

            var details = _unitOfWork.CPGetSecurityFormControls(applicationId).ToList();
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<CPGetSecurityFormControls_Result, SecurityFromControlGridDTO>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<CPGetSecurityFormControls_Result>, List<SecurityFromControlGridDTO>>(details);
                return data;
            }
        }

        public bool CreateUpdateSecurityFormControl(SecurityFormControlEntity securityFormControl)
        {
            using (var scope = new TransactionScope())
            {               
                SecurityFormControl sc = new SecurityFormControl()
                {
                    Name = securityFormControl.Name,
                    ParentId=securityFormControl.ParentId,
                    SecurityFormControlId=securityFormControl.SecurityFormControlId,
                    SecurityFormId = securityFormControl.SecurityFormId,
                    CreatedBy = securityFormControl.CreatedBy,
                    CreatedDate = securityFormControl.CreatedDate,                        
                    Inactive = securityFormControl.Inactive,
                    LastModBy = securityFormControl.LastModBy,
                    LastModDate = securityFormControl.LastModDate,
                    SecurityControlId = securityFormControl.SecurityControlId
                };

                if (securityFormControl.SecurityFormControlId > 0)
                {
                    sc.LastModDate = DateTime.Now;
                    _unitOfWork.SecurityFormControlRepository.Update(sc);
                    _unitOfWork.Save();
                    scope.Complete();
                }
                else
                {
                    sc.LastModDate = DateTime.Now;
                    sc.CreatedDate = DateTime.Now;
                    _unitOfWork.SecurityFormControlRepository.Insert(sc);
                    _unitOfWork.Save();
                    scope.Complete();
                }
                return true;               
            }
        }

        public int DeleteSecurityFormControl(int securityFormControlId)
        {
            int success = 0;
            if (securityFormControlId > 0)
            {                
                success = _unitOfWork.CPDeleteSecurityFormControl(securityFormControlId);
            }
            return success;
        }

    }
}
