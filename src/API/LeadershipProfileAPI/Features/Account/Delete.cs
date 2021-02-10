using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace LeadershipProfileAPI.Features.Account
{
    public class Delete
    {
        public class Command : IRequest<Response>
        {
            public string Username { get; set; }
            public string Password { get; set; }
            public HttpContext ControllerContext { get; set; }
        }

        public class Response
        {
            public bool Result { get; set; }
            public string ResultMessage { get; set; }
        }

        public class CommandHandler : IRequestHandler<Command, Response>
        {
            private readonly EdFiDbContext _dbContext;
            private readonly UserManager<IdentityUser> _userManager;
            private readonly ILogger<CommandHandler> _logger;

            /// <summary>
            /// Initializes a new instance of the class
            /// </summary>
            /// <param name="userManager"></param>
            /// <param name="logger"></param>
            public CommandHandler(
                UserManager<IdentityUser> userManager,
                ILogger<CommandHandler> logger,
                EdFiDbContext dbContext)
            {
                _userManager = userManager;
                _logger = logger;
                _dbContext = dbContext;
            }

            public async Task<Response> Handle(Command request, CancellationToken cancellationToken)
            {
                if (request == null)
                {
                    throw new ArgumentNullException(nameof(request));
                }

                _logger.LogInformation($"Request received to remove the User: {request.Username}");

                // find user by username
                var user = await _userManager.FindByNameAsync(request.Username);

                if (user != null)
                {
                    var result = await _userManager.DeleteAsync(user);

                    if (result.Succeeded)
                    {
                        _logger.LogInformation("User removed successfully");

                        // Make sure we remove the TpdmUsername since it is tied to the User account
                        var staff = _dbContext.Staff.SingleOrDefault(s => s.TpdmUsername == request.Username);

                        if (staff != null)
                        {
                            staff.TpdmUsername = null;

                            if (await _dbContext.SaveChangesAsync() > 0)
                            {
                                _logger.LogInformation($"Removed TpdmUsername from StaffUniqueId: {staff.StaffUniqueId}");
                            }
                        }

                        return new Response { Result = true };
                    }
                }

                return new Response { Result = false };
            }
        }
    }
}
