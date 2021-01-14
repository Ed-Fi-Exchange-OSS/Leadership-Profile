using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityModel;
using IdentityServer4;
using IdentityServer4.Events;
using IdentityServer4.Extensions;
using IdentityServer4.Services;
using IdentityServer4.Stores;
using LeadershipProfileAPI.Data;
using LeadershipProfileAPI.Infrastructure;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace LeadershipProfileAPI.Controllers
{   
    [TypeFilter(typeof(ApiExceptionFilter))]
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
        private readonly EdFiDbContext _dbContext;

        public AccountController(
            IIdentityServerInteractionService interaction,
            IClientStore clientStore,
            IAuthenticationSchemeProvider schemeProvider,
            IEventService events,
            SignInManager<IdentityUser> signInManager,
            UserManager<IdentityUser> userManager,
            EdFiDbContext dbContext)
        {
            _interaction = interaction;
            _clientStore = clientStore;
            _schemeProvider = schemeProvider;
            _events = events;
            _signInManager = signInManager;
            _userManager = userManager;
            _dbContext = dbContext;
        }
        
        [HttpPost("login")]
        public async Task<LoginResultModel> Login(LoginInputModel model)
        {
            // check if we are in the context of an authorization request
            var context = await _interaction.GetAuthorizationContextAsync(model.ReturnUrl);

            if (!ModelState.IsValid)
            {
                return new LoginResultModel();
            }

            // find user by username
            var user = await _signInManager.UserManager.FindByNameAsync(model.Username);

            // validate username/password using ASP.NET Identity
            if (user != null && (await _signInManager.CheckPasswordSignInAsync(user, model.Password, true)) == SignInResult.Success)
            {
                await _events.RaiseAsync(new UserLoginSuccessEvent(user.UserName, user.Id, user.UserName, clientId: context?.Client.ClientId));

                // issue authentication cookie with subject ID and username
                var identityServerUser = new IdentityServerUser(user.Id) { DisplayName = user.UserName };
                
                var claims = await _signInManager.UserManager.GetClaimsAsync(user);
                
                foreach (var claim in claims)
                {
                    identityServerUser.AdditionalClaims.Add(claim);
                }

                await HttpContext.SignInAsync(identityServerUser, null);

                var vm = new LoginInputModel {Username = model.Username, RememberLogin = model.RememberLogin};

                return new LoginResultModel {ReturnUrl = vm.ReturnUrl, Result = true};
            }

            await _events.RaiseAsync(new UserLoginFailureEvent(model.Username, "invalid credentials", clientId: context?.Client.ClientId));

            ModelState.AddModelError(string.Empty, AccountOptions.InvalidCredentialsErrorMessage);

            return new LoginResultModel();
        }
        [HttpPost("register")]
        public async Task<LoginResultModel> Register(RegisterModel model)
        {
            var staff = _dbContext.Staff.SingleOrDefault(s => s.StaffUniqueId == model.StaffUniqueId);
            
            if(staff == null)
                throw new ApiExceptionFilter.ApiException("Staff record not found.");

            if (!ModelState.IsValid)
            {
                //var errors = ModelState.SelectMany(v => v.Value.Errors);
                //var errors2 = ModelState.Select(v => v.Value.Errors)
                //                                .Where(e => e.Count > 0).ToList();

                throw new ApiExceptionFilter.ApiException("Missing important properties");
            }

            var user = new IdentityUser(model.Username) {Email = model.Email};

            var result = await _userManager.CreateAsync(user, model.Password).ConfigureAwait(false);
            
            if (!result.Succeeded)
            {
                throw new ApiExceptionFilter.ApiException("Couldn't create a user");
            }

            result = await _userManager.AddClaimsAsync(user, new Claim[]
            {
                new ("role","Admin") // check db before adding this when we implement roles

            });

            if (!result.Succeeded)
            {
                throw new ApiExceptionFilter.ApiException("Couldn't create claims");
            }

            //create relationship with staff
            staff.TpdmUsername = user.UserName;
            await _dbContext.SaveChangesAsync();
            
           // await _signInManager.SignInAsync(user, false).ConfigureAwait(false);
            await Login(new LoginInputModel {Username = user.UserName, Password = model.Password});
            
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
        public string ReturnUrl { get; set; }
    }

    public class LoginResultModel   
    {
        public bool Result { get; set; }
        public string ReturnUrl { get; set; }
    }

    public class AccountOptions
    {
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
}
