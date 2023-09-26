// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace LeadershipProfileAPI.Features.Account
{
    public class ResetPassword
    {
        public class Command : IRequest<Response>
        {
            public string Username { get; set; }
            public string NewPassword { get; set; }
            public string Token { get; set; }
        }

        public class Response
        {
            public bool Result { get; set; }
            public string ResultMessage { get; set; }
            public bool HasErrors { get; set; }
        }

        public class CommandHandler : IRequestHandler<Command, Response>
        {
            private readonly SignInManager<IdentityUser> _signInManager;
            private readonly UserManager<IdentityUser> _userManager;
            private readonly ILogger<CommandHandler> _logger;

            /// <summary>
            /// Initializes a new instance of the class
            /// </summary>
            /// <param name="signInManager"></param>
            /// <param name="userManager"></param>
            public CommandHandler(
                SignInManager<IdentityUser> signInManager,
                UserManager<IdentityUser> userManager,
                ILogger<CommandHandler> logger)
            {
                _signInManager = signInManager;
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

                var user = await _signInManager.UserManager.FindByNameAsync(request.Username);

                if (user != null)
                {
                    var result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);

                    if (result.Succeeded)
                    {
                        response.Result = true;
                        response.ResultMessage = "Password changed.";
                    }
                    else
                    {
                        response.Result = false;
                        response.ResultMessage = "Reset password failed with errors.";
                        _logger.LogWarning(response.ResultMessage);

                        if (result.Errors != null && result.Errors.Any())
                        {
                            response.HasErrors = true;

                            foreach (var error in result.Errors)
                            {
                                _logger.LogError($"ErrorCode: {error.Code}, Description: {error.Description}");
                            }
                        }
                    }

                    return response;
                }

                response.Result = false;
                response.ResultMessage = "Reset password failed.";
                _logger.LogWarning(response.ResultMessage);

                return response;
            }
        }
    }
}
