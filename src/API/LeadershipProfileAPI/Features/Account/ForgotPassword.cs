﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data;
using LeadershipProfileAPI.Infrastructure;
using LeadershipProfileAPI.Infrastructure.Email;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LeadershipProfileAPI.Features.Account
{
    public static class ForgotPassword
    {
        public class Command : IRequest<Response>
        {
            public string Username { get; set; }
            public string StaffUniqueId { get; set; }
        }

        public class Response
        {
            public bool Result { get; set; }
            public string ResultMessage { get; set; }
        }

        public class CommandHandler : IRequestHandler<Command, Response>
        {
            private readonly EdFiDbContext _dbContext;
            private readonly SignInManager<IdentityUser> _signInManager;
            private readonly UserManager<IdentityUser> _userManager;
            private readonly IEmailSender _emailSender;
            private readonly ApplicationConfiguration _configSettings;
            private readonly ILogger<CommandHandler> _logger;

            /// <summary>
            /// Initializes a new instance of the class
            /// </summary>
            /// <param name="context"></param>
            /// <param name="signInManager"></param>
            /// <param name="userManager"></param>
            /// <param name="emailSender"></param>
            /// <param name="configSettings"></param>
            public CommandHandler(
                EdFiDbContext context,
                SignInManager<IdentityUser> signInManager,
                UserManager<IdentityUser> userManager,
                IEmailSender emailSender,
                IOptions<ApplicationConfiguration> configSettings,
                ILogger<CommandHandler> logger)
            {
                _dbContext = context;
                _signInManager = signInManager;
                _userManager = userManager;
                _emailSender = emailSender;
                _configSettings = configSettings.Value;
                _logger = logger;
            }

            public async Task<Response> Handle(Command request, CancellationToken cancellationToken)
            {
                if (request == null)
                {
                    throw new ArgumentNullException(nameof(request));
                }

                var response = new Response
                {
                    Result = true,
                    ResultMessage = "An email will be sent to the email address on file in the system."
                };

                // Gets user by username from Staff table
                var staff = _dbContext.Staff.SingleOrDefault(s => s.TpdmUsername == request.Username && s.StaffUniqueId == request.StaffUniqueId);

                if (staff != null)
                {
                    // Get user by username from ASP.Net table
                    var user = await _signInManager.UserManager.FindByNameAsync(request.Username);

                    // Don't reveal that the user does not exist or is not confirmed
                    if (user != null)
                    {
                        // Generate token and reset link
                        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                        var callbackUrl = $"<a href='{_configSettings.WebApplicationUrl}/Account/ResetPassword?username={request.Username}&token={token}' target='_blank'>Reset Password</a>";
                        var message = $"<h2>Click the link below to reset your password.</h2><br/><br/><p>{callbackUrl}</p>";

                        await _emailSender.SendEmailAsync(user.Email, "Reset Password", message);
                    }
                    else
                    {
                        _logger.LogWarning($"User record not found - username:{request.Username}");
                    }
                }
                else
                {
                    _logger.LogWarning($"Staff record not found - username:{request.Username}, staffuniqueid:{request.StaffUniqueId}");
                }

                return response;
            }
        }
    }
}
