using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(MC.ClientPortal.WebApi.Startup))]

namespace MC.ClientPortal.WebApi
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            ConfigureOAuthTokenConsumption(app);
        }
    }
}
