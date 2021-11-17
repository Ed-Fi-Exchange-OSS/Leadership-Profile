using System;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data;
using LeadershipProfileAPI.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace LeadershipProfileAPI.Features.Account
{
    public class Register
    {
        public class Command : IRequest<Response>
        {
            public string Username { get; set; }
            public string Password { get; set; }
            public string Email { get; set; }
            public string StaffUniqueId { get; set; }
        }

        public class Response
        {
            public bool Result { get; set; }
            public string ResultMessage { get; set; }
            public bool HasErrors { get; set; }
        }

        public class CommandHandler : IRequestHandler<Command, Response>
        {
            private readonly EdFiDbContext _dbContext;
            private readonly UserManager<IdentityUser> _userManager;
            private readonly ILogger<CommandHandler> _logger;

            /// <summary>
            /// Initializes a new instance of the class
            /// </summary>
            /// <param name="context"></param>
            /// <param name="userManager"></param>
            public CommandHandler(
                EdFiDbContext context,
                UserManager<IdentityUser> userManager,
                ILogger<CommandHandler> logger)
            {
                _dbContext = context;
                _userManager = userManager;
                _logger = logger;
            }

            public async Task<Response> Handle(Command request, CancellationToken cancellationToken)
            {
                if (request == null)
                {
                    throw new ArgumentNullException(nameof(request));
                }

                var response = new Response();
                var staff = _dbContext.Staff.SingleOrDefault(s => s.StaffUniqueId == request.StaffUniqueId);

                if (staff != null)
                {
                    if (!string.IsNullOrEmpty(staff.TpdmUsername))
                    {
                        response.Result = false;
                        response.ResultMessage = "This Staff ID has already been registered.  Please use the Login screen instead.";
                        return response;
                    }

                    var user = new IdentityUser(request.Username) { Email = request.Email };

                    if (request.Password.Length < 8) {
                        response.Result = false;
                        response.ResultMessage = "Password should contain at least 8 characters";
                        return response;
                    }

                    if (!request.Password.Any(char.IsUpper)) {
                        response.Result = false;
                        response.ResultMessage = "Password should contain at least 1 upper case letter";
                        return response;
                    }
                    if (!request.Password.Any(char.IsLower)) {
                        response.Result = false;
                        response.ResultMessage = "Password should contain at least 1 lower case letter";
                        return response;
                    }

                    var result = await _userManager.CreateAsync(user, request.Password).ConfigureAwait(false);

                    if (!result.Succeeded)
                    {
                        response.Result = false;
                        response.ResultMessage = "Couldn't create a user";
                        _logger.LogWarning(response.ResultMessage);

                        if (result.Errors != null && result.Errors.Any())
                        {
                            response.HasErrors = true;

                            if (result.Errors.Any(x => x.Code.Contains("Password")))
                            {
                                response.ResultMessage = "PasswordError";
                            }

                            foreach (var error in result.Errors)
                            {
                                _logger.LogError($"ErrorCode: {error.Code}, Description: {error.Description}");
                            }
                        }

                        return response;
                    }

                    result = await _userManager.AddClaimsAsync(user,
                        new Claim[]
                        {
                        new ("role","Admin") // check db before adding this when we implement roles
                        });

                    if (!result.Succeeded)
                    {
                        response.Result = false;
                        response.ResultMessage = "Couldn't create claims";
                        _logger.LogWarning(response.ResultMessage);

                        if (result.Errors != null && result.Errors.Any())
                        {
                            response.HasErrors = true;

                            foreach (var error in result.Errors)
                            {
                                _logger.LogError($"ErrorCode: {error.Code}, Description: {error.Description}");
                            }
                        }

                        return response;
                    }

                    //create relationship with staff
                    staff.TpdmUsername = user.UserName;

                    await _dbContext.SaveChangesAsync(cancellationToken);

                    response.Result = true;
                    return response;
                }

                response.Result = false;
                response.ResultMessage = "Incorrect Staff ID.";
                return response;
            }
        }
    }
}
