// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using System;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using IdentityServer4.Events;
using IdentityServer4.Extensions;
using IdentityServer4.Services;
using LeadershipProfileAPI.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace LeadershipProfileAPI.Features.Account
{
    public class Logout
    {
        public class Command : IRequest<Response>
        {
            public string LogoutId { get; set; }
            public HttpContext ControllerContext { get; set; }
            public ClaimsPrincipal User { get; set; }
            public HttpResponse HttpResponse { get; set; }
        }

        public class Response
        {
            public bool Result { get; set; }
            public string ResultMessage { get; set; }
        }

        public class CommandHandler : IRequestHandler<Command, Response>
        {
            private readonly IEventService _events;
            private readonly ILogger<CommandHandler> _logger;

            /// <summary>
            /// Initializes a new instance of the class
            /// </summary>
            /// <param name="events"></param>
            public CommandHandler(IEventService events, ILogger<CommandHandler> logger)
            {
                _events = events;
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
                    Result = true
                };

                if (request.User?.Identity.IsAuthenticated != true)
                {
                    response.Result = false;
                    response.ResultMessage = "User is not authenticated";
                    _logger.LogWarning(response.ResultMessage);
                    return response;
                }

                if (!request.User.Identity.Name.ToLower().Equals(request.LogoutId.ToLower()))
                {
                    response.Result = false;
                    response.ResultMessage = "Invalid session logout request";
                    _logger.LogError(response.ResultMessage);
                    return response;
                }

                // delete local authentication cookie
                await request.ControllerContext.SignOutAsync();

                ExplicitlyDeleteAuthCookies(request);

                // raise the logout event
                await _events.RaiseAsync(new UserLogoutSuccessEvent(request.User.GetSubjectId(), request.User.GetDisplayName()));

                return response;
            }

            private static void ExplicitlyDeleteAuthCookies(Command request)
            {
                if (request.ControllerContext.Request.Cookies.Count > 0)
                {
                    var siteCookies = request.ControllerContext.Request.Cookies
                        .Where(c =>
                            c.Key.Contains(".AspNetCore.") ||
                            c.Key.Contains("Microsoft.Authentication") ||
                            c.Key.Contains("idsrv")
                        );

                    foreach (var cookie in siteCookies)
                    {
                        request.HttpResponse.Cookies.Delete(cookie.Key);
                    }
                }
            }
        }
    }
}
