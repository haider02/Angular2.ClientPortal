using MC.BusinessServices.ClientPortal;
using MC.DIResolver;
using System.ComponentModel.Composition;



namespace MC.BusinessServices
{
    [Export(typeof(IComponent))]
    public class DependencyResolver : IComponent
    {
        public void SetUp(IRegisterComponent registerComponent)
        {

            #region Client Portal
            
            registerComponent.RegisterType<IStateServices, StateServices>();
            registerComponent.RegisterType<ICityServices, CityServices>();
            registerComponent.RegisterType<ICountyServices, CountyServices>();
            registerComponent.RegisterType<IAddressServices, AddressesServices>();
            registerComponent.RegisterType<IDocumentServices, DocumentServices>();
            registerComponent.RegisterType<IMenuServices, MenuServices>();            
            registerComponent.RegisterType<IReferenceDataServices, ReferenceDataServices>();
            registerComponent.RegisterType<IOrderEntryService, OrderEntryService>();
            registerComponent.RegisterType<IRegisterService, RegisterService>();
            registerComponent.RegisterType<IDashBoardService, DashBoardService>();
            registerComponent.RegisterType<IPropertyDetailService, PropertyDetailService>();
            registerComponent.RegisterType<IOrderNotesService, OrderNotesService>();
            registerComponent.RegisterType<IOrderDetailService, OrderDetailService>();
            registerComponent.RegisterType<IOrderSummaryService, OrderSummaryService>();
            registerComponent.RegisterType<IPostCloseService, PostCloseService>();
            registerComponent.RegisterType<IPreCloseService, PreCloseService>();
            registerComponent.RegisterType<IAccountServices, AccountServices>();
            registerComponent.RegisterType<ITitleClearanceService, TitleClearanceService>();
            registerComponent.RegisterType<IOrderTitleService, OrderTitleService>();
            registerComponent.RegisterType<ISecurityControlService, SecurityControlService>();
            registerComponent.RegisterType<ISecurityFormService, SecurityFormService>();
            registerComponent.RegisterType<ISecurityFormControlService, SecurityFormControlService>();
            registerComponent.RegisterType<ISecurityFormControlControlConfigService, SecurityFormControlControlConfigService>();
            registerComponent.RegisterType<IGenerateDocumentService, GenerateDocumentService>();
            registerComponent.RegisterType<IForgotPasswordService, ForgotPasswordService>();
            #endregion

        }
    }
}
