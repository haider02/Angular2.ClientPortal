﻿using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using MC.ClientPortal.WebApi.Models;
using System.Web.Configuration;
using System.Configuration;

namespace MC.ClientPortal.WebApi.Providers
{
    public class ApplicationOAuthProvider : OAuthAuthorizationServerProvider
    {
        private readonly string _publicClientId;

        public ApplicationOAuthProvider(string publicClientId)
        {
            if (publicClientId == null)
            {
                throw new ArgumentNullException("publicClientId");
            }

            _publicClientId = publicClientId;
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            var userManager = context.OwinContext.GetUserManager<ApplicationUserManager>();
            ApplicationUser user;
            // find user by username first
            var userName = await userManager.FindByNameAsync(context.UserName);

            if (userName != null)
            {
                user = await userManager.FindAsync(context.UserName, context.Password);

                // When a user is lockedout, this check is done to ensure that even if the credentials are valid
                // the user can not login until the lockout duration has passed
                if (await userManager.IsLockedOutAsync(userName.Id))
                {
                    context.SetError("lockout", string.Format("Your account has been locked out for {0} minutes due to multiple failed login attempts.", ConfigurationManager.AppSettings["DefaultAccountLockoutTimeSpan"]));
                    return;
                }
                // if user is subject to lockouts and the credentials are invalid
                // record the failure and check if user is lockedout and display message, otherwise,
                // display the number of attempts remaining before lockout
                else if (await userManager.GetLockoutEnabledAsync(userName.Id) && user == null)
                {
                    // Record the failure which also may cause the user to be locked out
                    await userManager.AccessFailedAsync(userName.Id);

                    string message;

                    if (await userManager.IsLockedOutAsync(userName.Id))
                    {
                        message = string.Format("Your account has been locked out for {0} minutes due to multiple failed login attempts.", ConfigurationManager.AppSettings["DefaultAccountLockoutTimeSpan"]);
                    }
                    else
                    {
                        int accessFailedCount = await userManager.GetAccessFailedCountAsync(userName.Id);

                        int attemptsLeft =
                            Convert.ToInt32(
                                ConfigurationManager.AppSettings["MaxFailedAccessAttemptsBeforeLockout"]) -
                            accessFailedCount;

                        message = string.Format(
                            "Invalid credentials. You have {0} more attempt(s) before your account gets locked out.", attemptsLeft);

                    }

                    context.SetError("lockout", message);
                    return;
                }
                else if (user == null)
                {
                    context.SetError("invalid_grant", "The user name or password is incorrect.");
                    return;
                }
                else if (  user.Inactive )
                {
                    context.SetError("invalid_grant", "The user name is Inactive. Please contact Administrator.");
                    return;
                }
                else if (user.IsNYAttorneyPortalUser == false)
                {
                    context.SetError("invalid_grant", "The user name is Invalid. Please contact Administrator.");
                    return;
                }
                else
                {
                    // When token is verified correctly, clear the access failed count used for lockout
                    await userManager.ResetAccessFailedCountAsync(userName.Id);
                    userName.LastLoginDate = DateTime.Now;
                    userName.LoginCount = userName.LoginCount + 1;
                    userManager.Update(userName);
                }
            }
            else
            {
                context.SetError("invalid_grant", "User name is incorrect.");
                return;
            }
            ClaimsIdentity oAuthIdentity = await user.GenerateUserIdentityAsync(userManager, "JWT");
            ClaimsIdentity cookiesIdentity = await user.GenerateUserIdentityAsync(userManager, CookieAuthenticationDefaults.AuthenticationType);
            AuthenticationProperties properties = CreateProperties(user);
            AuthenticationTicket ticket = new AuthenticationTicket(oAuthIdentity, properties);
            context.Validated(ticket);
            context.Request.Context.Authentication.SignIn(cookiesIdentity);
        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }

            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            // Resource owner password credentials does not provide a client ID.
            if (context.ClientId == null)
            {
                context.Validated();
            }

            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientRedirectUri(OAuthValidateClientRedirectUriContext context)
        {
            if (context.ClientId == _publicClientId)
            {
                Uri expectedRootUri = new Uri(context.Request.Uri, "/");

                if (expectedRootUri.AbsoluteUri == context.RedirectUri)
                {
                    context.Validated();
                }
            }

            return Task.FromResult<object>(null);
        }
                
        public static AuthenticationProperties CreateProperties(ApplicationUser user)
        {
            string userName;

            if (user.FullName == null)
                userName = user.FirstName;
            else
                userName = user.FullName;


            IDictionary<string, string> data = new Dictionary<string, string>
            {
                { "userContactId",   user.Id.ToString()  },
                { "userClientId",   user.XRefId.ToString()  },
                { "userFullName",   userName  },
                { "SessionTimeOutinMinutes",   WebConfigurationManager.AppSettings["SessionTimeOutinMinutes"] },
                { "SessionTimeOutWarninginMinutes",   WebConfigurationManager.AppSettings["SessionTimeOutWarninginMinutes"] }
            };

            return new AuthenticationProperties(data);
        }


        public override Task GrantRefreshToken(OAuthGrantRefreshTokenContext context)
        {
            // chance to change authentication ticket for refresh token requests
            var newId = new ClaimsIdentity(context.Ticket.Identity);
            newId.AddClaim(new Claim("newClaim", "refreshToken"));

            var newTicket = new AuthenticationTicket(newId, context.Ticket.Properties);
            context.Validated(newTicket);
            return base.GrantRefreshToken(context);
        }
        
    }
}