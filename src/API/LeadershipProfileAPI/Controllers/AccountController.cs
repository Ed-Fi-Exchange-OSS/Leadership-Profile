using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityModel;
using IdentityServer4;
using IdentityServer4.Endpoints.Results;
using IdentityServer4.Events;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using IdentityServer4.Stores;
using LeadershipProfileAPI.Infrastructure;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace LeadershipProfileAPI.Controllers
{
    //[TypeFilter(typeof(ApiExceptionFilter))]
    //[ApiController]
    //[Route("[controller]")]
    //public class AccountController : ControllerBase
    //{
    //    private readonly UserManager<IdentityUser> _userManager;
    //    private readonly SignInManager<IdentityUser> _signInManager;
    //    private readonly IIdentityServerInteractionService _interaction;
    //    private readonly IEventService _events;

    //    public AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, 
    //        IIdentityServerInteractionService interaction, IEventService events)
    //    {
    //        _userManager = userManager;
    //        _signInManager = signInManager;
    //        _interaction = interaction;
    //        _events = events;
    //    }

    //    //[HttpPost]
    //    //public async Task<string> Login(LoginModel model)
    //    //{
    //    //    // check for validity
    //    //    var result =  await _signInManager.PasswordSignInAsync(model.UserName, model.Password,false,false);
    //    //    //ITokenService t;
    //    //    //t.CreateIdentityTokenAsync(new TokenCreationRequest().)

    //    //    //ITokenCreationService s;
            
    //    //    //ITok

            
    //    //    return "token";
    //    //}

    //}
  //  [SecurityHeaders]
    [TypeFilter(typeof(ApiExceptionFilter))]
    [SecurityHeaders]
    [ApiController]
    [Route("[controller]")]
    [AllowAnonymous]
    public class AccountController : ControllerBase
    {
        private readonly IIdentityServerInteractionService _interaction;
        private readonly IClientStore _clientStore;
        private readonly IAuthenticationSchemeProvider _schemeProvider;
        private readonly IEventService _events;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;

        public AccountController(
            IIdentityServerInteractionService interaction,
            IClientStore clientStore,
            IAuthenticationSchemeProvider schemeProvider,
            IEventService events,
            SignInManager<IdentityUser> signInManager,
            UserManager<IdentityUser> userManager)
        {
            _interaction = interaction;
            _clientStore = clientStore;
            _schemeProvider = schemeProvider;
            _events = events;
            _signInManager = signInManager;
            _userManager = userManager;
        }

     

        /// <summary>
        /// Handle postback from username/password login
        /// </summary>
        [HttpPost("login")]
        //[ValidateAntiForgeryToken]
        public async Task<LoginResultModel> Login(LoginInputModel model, string button)
        {
            // check if we are in the context of an authorization request
            var context = await _interaction.GetAuthorizationContextAsync(model.ReturnUrl);

            if (ModelState.IsValid)
            {
                // find user by username
                var user = await _signInManager.UserManager.FindByNameAsync(model.Username);

                // validate username/password using ASP.NET Identity
                if (user != null && (await _signInManager.CheckPasswordSignInAsync(user, model.Password, true)) == SignInResult.Success)
                {
                    await _events.RaiseAsync(new UserLoginSuccessEvent(user.UserName, user.Id, user.UserName, clientId: context?.Client.ClientId));

                    // only set explicit expiration here if user chooses "remember me". 
                    // otherwise we rely upon expiration configured in cookie middleware.
                    AuthenticationProperties props = null;
                    if (AccountOptions.AllowRememberLogin && model.RememberLogin)
                    {
                        props = new AuthenticationProperties
                        {
                            IsPersistent = true,
                            ExpiresUtc = DateTimeOffset.UtcNow.Add(AccountOptions.RememberMeLoginDuration)
                        };
                    };

                    // issue authentication cookie with subject ID and username
                    var isuser = new IdentityServerUser(user.Id)
                    {
                        DisplayName = user.UserName
                    };

                    await HttpContext.SignInAsync(isuser, props);

                    var vm1 = await BuildLoginViewModelAsync(model);

                    return new LoginResultModel {ReturnUrl = vm1.ReturnUrl, Result = true};

                }

                //await _events.RaiseAsync(new UserLoginFailureEvent(model.Username, "invalid credentials", clientId: context?.Client.ClientId));
                //ModelState.AddModelError(string.Empty, AccountOptions.InvalidCredentialsErrorMessage);
            }

            // something went wrong, show form with error
            var vm2 = await BuildLoginViewModelAsync(model);
            //return View(vm);
            return new LoginResultModel { ReturnUrl = vm2.ReturnUrl}; ;
        }

        [HttpPost("register")]
        public async Task<LoginResultModel> Register(RegisterModel model)
        {
            //if(model.StaffUniqueId)
            //    //check if staff exists

            if (!ModelState.IsValid)
            {
                var errors = ModelState.SelectMany(v => v.Value.Errors);
                //.Where(e => e.Count > 0).ToList();

                var errors2 = ModelState.Select(v => v.Value.Errors)
                                                .Where(e => e.Count > 0).ToList();

                throw new ApiExceptionFilter.ApiException("Missing important properties");
            }

            var user = new IdentityUser(model.Username)
            {
                Email = model.Email
            };
            var result = await _userManager.CreateAsync(user, model.Password).ConfigureAwait(false);
            if (!result.Succeeded)
            {
                throw new ApiExceptionFilter.ApiException("Couldn't create a user");
            }

            result = await _userManager.AddClaimsAsync(user, new Claim[]
            {
                new (JwtClaimTypes.Name, $"{model.FirstName} {model.LastName}"),
                new (JwtClaimTypes.GivenName, model.FirstName),
                new (JwtClaimTypes.FamilyName, model.LastName)
            });

            if (!result.Succeeded)
            {
                throw new ApiExceptionFilter.ApiException("Couldn't create claims");
            }

            //create relationship with staff

            await _signInManager.SignInAsync(user, false).ConfigureAwait(false);

            return new LoginResultModel {Result = true, ReturnUrl = model.ReturnUrl};
        
        }

        ///// <summary>
        ///// Handle logout page postback
        ///// </summary>
        [HttpPost("logout")]
        public async Task<LoggedOutViewModel> Logout(LogoutInputModel model)
        {
            // build a model so the logged out page knows what to display
            var vm = await BuildLoggedOutViewModelAsync(model.LogoutId);

            if (User?.Identity.IsAuthenticated == true)
            {
                // delete local authentication cookie
                await HttpContext.SignOutAsync();

                // raise the logout event
                await _events.RaiseAsync(new UserLogoutSuccessEvent(User.GetSubjectId(), User.GetDisplayName()));
            }

            //// check if we need to trigger sign-out at an upstream identity provider
            //if (vm.TriggerExternalSignout)
            //{
            //    // build a return URL so the upstream provider will redirect back
            //    // to us after the user has logged out. this allows us to then
            //    // complete our single sign-out processing.
            //    string url = Url.Action("Logout", new { logoutId = vm.LogoutId });

            //    // this triggers a redirect to the external provider for sign-out
            //    var result = SignOut(new AuthenticationProperties { RedirectUri = url }, vm.ExternalAuthenticationScheme);

            //}

            return vm;
        }

        [HttpGet]
        public UnauthorizedResult AccessDenied()
        {
            return Unauthorized();
        }
        
        /*****************************************/
        /* helper APIs for the AccountController */
        /*****************************************/
        private async Task<LoginViewModel> BuildLoginViewModelAsync(string returnUrl)
        {
            var context = await _interaction.GetAuthorizationContextAsync(returnUrl);
            if (context?.IdP != null && await _schemeProvider.GetSchemeAsync(context.IdP) != null)
            {
                var local = context.IdP == IdentityServer4.IdentityServerConstants.LocalIdentityProvider;

                // this is meant to short circuit the UI and only trigger the one external IdP
                var vm = new LoginViewModel
                {
                    EnableLocalLogin = local,
                    ReturnUrl = returnUrl,
                    Username = context?.LoginHint,
                };

               
                return vm;
            }

           
            var allowLocal = true;
            if (context?.Client.ClientId != null)
            {
                var client = await _clientStore.FindEnabledClientByIdAsync(context.Client.ClientId);
                if (client != null)
                {
                    allowLocal = client.EnableLocalLogin;
                }
            }

            return new LoginViewModel
            {
                AllowRememberLogin = AccountOptions.AllowRememberLogin,
                EnableLocalLogin = allowLocal && AccountOptions.AllowLocalLogin,
                ReturnUrl = returnUrl,
                Username = context?.LoginHint
            };
        }

        private async Task<LoginViewModel> BuildLoginViewModelAsync(LoginInputModel model)
        {
            var vm = await BuildLoginViewModelAsync(model.ReturnUrl);
            vm.Username = model.Username;
            vm.RememberLogin = model.RememberLogin;
            return vm;
        }

        private async Task<LogoutViewModel> BuildLogoutViewModelAsync(string logoutId)
        {
            var vm = new LogoutViewModel { LogoutId = logoutId, ShowLogoutPrompt = AccountOptions.ShowLogoutPrompt };

            if (User?.Identity.IsAuthenticated != true)
            {
                // if the user is not authenticated, then just show logged out page
                vm.ShowLogoutPrompt = false;
                return vm;
            }

            var context = await _interaction.GetLogoutContextAsync(logoutId);
            if (context?.ShowSignoutPrompt == false)
            {
                // it's safe to automatically sign-out
                vm.ShowLogoutPrompt = false;
                return vm;
            }

            // show the logout prompt. this prevents attacks where the user
            // is automatically signed out by another malicious web page.
            return vm;
        }

        private async Task<LoggedOutViewModel> BuildLoggedOutViewModelAsync(string logoutId)
        {
            // get context information (client name, post logout redirect URI and iframe for federated signout)
            var logout = await _interaction.GetLogoutContextAsync(logoutId);

            var vm = new LoggedOutViewModel
            {
                AutomaticRedirectAfterSignOut = AccountOptions.AutomaticRedirectAfterSignOut,
                PostLogoutRedirectUri = logout?.PostLogoutRedirectUri,
                ClientName = string.IsNullOrEmpty(logout?.ClientName) ? logout?.ClientId : logout?.ClientName,
                SignOutIframeUrl = logout?.SignOutIFrameUrl,
                LogoutId = logoutId
            };

            if (User?.Identity.IsAuthenticated == true)
            {
                var idp = User.FindFirst(JwtClaimTypes.IdentityProvider)?.Value;
                if (idp != null && idp != IdentityServer4.IdentityServerConstants.LocalIdentityProvider)
                {
                    var providerSupportsSignout = await HttpContext.GetSchemeSupportsSignOutAsync(idp);
                    if (providerSupportsSignout)
                    {
                        if (vm.LogoutId == null)
                        {
                            // if there's no current logout context, we need to create one
                            // this captures necessary info from the current logged in user
                            // before we signout and redirect away to the external IdP for signout
                            vm.LogoutId = await _interaction.CreateLogoutContextAsync();
                        }

                        vm.ExternalAuthenticationScheme = idp;
                    }
                }
            }

            return vm;
        }
    }

    public class RegisterModel  
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        public string Email { get; set; }
        [Required]
        public string StaffUniqueId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ReturnUrl { get; set; }
    }

    public class LoginResultModel   
    {
        public bool Result { get; set; }
        public string ReturnUrl { get; set; }
    }

    public class SecurityHeadersAttribute : ActionFilterAttribute
    {
        public override void OnResultExecuting(ResultExecutingContext context)
        {
            var result = context.Result;
            if (result is ViewResult)
            {
                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
                if (!context.HttpContext.Response.Headers.ContainsKey("X-Content-Type-Options"))
                {
                    context.HttpContext.Response.Headers.Add("X-Content-Type-Options", "nosniff");
                }

                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
                if (!context.HttpContext.Response.Headers.ContainsKey("X-Frame-Options"))
                {
                    context.HttpContext.Response.Headers.Add("X-Frame-Options", "SAMEORIGIN");
                }

                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
                var csp = "default-src 'self'; object-src 'none'; frame-ancestors 'none'; sandbox allow-forms allow-same-origin allow-scripts; base-uri 'self';";
                // also consider adding upgrade-insecure-requests once you have HTTPS in place for production
                //csp += "upgrade-insecure-requests;";
                // also an example if you need client images to be displayed from twitter
                // csp += "img-src 'self' https://pbs.twimg.com;";

                // once for standards compliant browsers
                if (!context.HttpContext.Response.Headers.ContainsKey("Content-Security-Policy"))
                {
                    context.HttpContext.Response.Headers.Add("Content-Security-Policy", csp);
                }
                // and once again for IE
                if (!context.HttpContext.Response.Headers.ContainsKey("X-Content-Security-Policy"))
                {
                    context.HttpContext.Response.Headers.Add("X-Content-Security-Policy", csp);
                }

                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
                var referrer_policy = "no-referrer";
                if (!context.HttpContext.Response.Headers.ContainsKey("Referrer-Policy"))
                {
                    context.HttpContext.Response.Headers.Add("Referrer-Policy", referrer_policy);
                }
            }
        }
    }
    public class LogoutViewModel : LogoutInputModel
    {
        public bool ShowLogoutPrompt { get; set; } = true;
    }
    public class AccountOptions
    {
        public static bool AllowLocalLogin = true;
        public static bool AllowRememberLogin = true;
        public static TimeSpan RememberMeLoginDuration = TimeSpan.FromDays(30);

        public static bool ShowLogoutPrompt = true;
        public static bool AutomaticRedirectAfterSignOut = false;

        public static string InvalidCredentialsErrorMessage = "Invalid username or password";
    }
    public class LogoutInputModel
    {
        public string LogoutId { get; set; }
    }

    public class LoggedOutViewModel
    {

        public string PostLogoutRedirectUri { get; set; }
        public string ClientName { get; set; }
        public string SignOutIframeUrl { get; set; }

        public bool AutomaticRedirectAfterSignOut { get; set; }

        public string LogoutId { get; set; }
        public bool TriggerExternalSignout => ExternalAuthenticationScheme != null;
        public string ExternalAuthenticationScheme { get; set; }
    }

    public class LoginInputModel
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        public bool RememberLogin { get; set; }
        public string ReturnUrl { get; set; }
    }

    public class LoginViewModel : LoginInputModel
    {
        public bool AllowRememberLogin { get; set; } = true;
        public bool EnableLocalLogin { get; set; } = true;

        //public IEnumerable<ExternalProvider> ExternalProviders { get; set; } = Enumerable.Empty<ExternalProvider>();
        //public IEnumerable<ExternalProvider> VisibleExternalProviders => ExternalProviders.Where(x => !String.IsNullOrWhiteSpace(x.DisplayName));

        //public bool IsExternalLoginOnly => EnableLocalLogin == false && ExternalProviders?.Count() == 1;
        //public string ExternalLoginScheme => IsExternalLoginOnly ? ExternalProviders?.SingleOrDefault()?.AuthenticationScheme : null;
    }

    public class LoginModel 
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
