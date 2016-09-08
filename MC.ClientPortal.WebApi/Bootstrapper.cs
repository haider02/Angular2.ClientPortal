using Microsoft.Practices.Unity;
using Unity.Mvc3;
using System.Web.Http;
using MC.DIResolver;

namespace MC.ClientPortal.WebApi
{
    public static class Bootstrapper
    {
        //public static IUnityContainer Initialise()
        //{
        //    var container = BuildUnityContainer();

        //    DependencyResolver.SetResolver(new UnityDependencyResolver(container));

        //    return container;
        //}

        public static void Initialise()
        {
            var container = BuildUnityContainer();

            System.Web.Mvc.DependencyResolver.SetResolver(new UnityDependencyResolver(container));

            // register dependency resolver for WebAPI RC
            GlobalConfiguration.Configuration.DependencyResolver = new Unity.WebApi.UnityDependencyResolver(container);
        }

        private static IUnityContainer BuildUnityContainer()
        {
            var container = new UnityContainer();

            // register all your components with the container here
            // it is NOT necessary to register your controllers

            // e.g. container.RegisterType<ITestService, TestService>();    
            RegisterTypes(container);

            return container;
        }

        public static void RegisterTypes(IUnityContainer container)
        {
            //Component initialization via MEF
            ComponentLoader.LoadContainer(container, ".\\bin", "MC.ClientPortal.WebApi.dll");
            ComponentLoader.LoadContainer(container, ".\\bin", "MC.BusinessServices.dll");

            
          //  container.RegisterType<AccountController>(new InjectionConstructor());
        }
    }
}