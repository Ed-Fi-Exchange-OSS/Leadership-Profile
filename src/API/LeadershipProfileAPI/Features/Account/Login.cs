// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using System;
using System.Threading;
using System.Threading.Tasks;
using IdentityServer4;
using IdentityServer4.Events;
using IdentityServer4.Services;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace LeadershipProfileAPI.Features.Account
{
    public class Login
    {
        public class Command : IRequest<Response>
        {
            public string Username { get; set; }
            public string Password { get; set; }
            public HttpContext HttpContext { get; set; }
        }

        public class Response
        {
            public bool Result { get; set; }
            public string ResultMessage { get; set; }
        }

        public class CommandHandler : IRequestHandler<Command, Response>
        {
            private readonly SignInManager<IdentityUser> _signInManager;
            private readonly IEventService _events;

            /// <summary>
            /// Initializes a new instance of the class
            /// </summary>
            /// <param name="signInManager"></param>
            /// <param name="events"></param>
            public CommandHandler(
                SignInManager<IdentityUser> signInManager,
                IEventService events)
            {
                _signInManager = signInManager;
                _events = events;
            }

            public async Task<Response> Handle(Command request, CancellationToken cancellationToken)
            {
                if (request == null)
                {
                    throw new ArgumentNullException(nameof(request));
                }

                // find user by username
                var user = await _signInManager.UserManager.FindByNameAsync(request.Username);

                // validate username/password using ASP.NET Identity
                if (user != null && (await _signInManager.CheckPasswordSignInAsync(user, request.Password, true)) == SignInResult.Success)
                {
                    await _events.RaiseAsync(new UserLoginSuccessEvent(user.UserName, user.Id, user.UserName, clientId: "interactive"));

                    // issue authentication cookie with subject ID and username
                    var identityServerUser = new IdentityServerUser(user.Id) { DisplayName = user.UserName };

                    var claims = await _signInManager.UserManager.GetClaimsAsync(user);

                    foreach (var claim in claims)
                    {
                        identityServerUser.AdditionalClaims.Add(claim);
                    }

                    await request.HttpContext.SignInAsync(identityServerUser, null);

                    return new Response { Result = true };
                }

                await _events.RaiseAsync(new UserLoginFailureEvent(request.Username, "Invalid credentials", clientId: "interactive"));

                return new Response { Result = false, ResultMessage = "Invalid credentials" };
            }
        }
    }
}
