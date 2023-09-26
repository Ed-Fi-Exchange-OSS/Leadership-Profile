// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using System;
using System.Linq;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace LeadershipProfileAPI.Controllers
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class ClaimCheckAttribute : TypeFilterAttribute
    {
        public ClaimCheckAttribute(string claimType, string claimValue) : base(typeof(ClaimCheckFilter))
        {
            Arguments = new object[] { claimType, claimValue };
        }
    }

    public class ClaimCheckFilter : IAuthorizationFilter
    {
        public string ClaimType { get; }
        public string ClaimValue { get; }

        public ClaimCheckFilter(string claimType, string claimValue)
        {
            ClaimType = claimType;
            ClaimValue = claimValue;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            if (!context.HttpContext.User.IsAuthenticated())
                context.Result = new UnauthorizedResult();

            var has = context.HttpContext.User.Claims.Any(c => c.Type == ClaimType && c.Value == ClaimValue);
            if (!has)
                context.Result = new UnauthorizedResult();
        }
    }
}
