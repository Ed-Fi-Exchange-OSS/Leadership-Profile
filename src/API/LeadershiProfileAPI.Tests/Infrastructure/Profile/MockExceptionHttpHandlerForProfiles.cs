// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Tests.Infrastructure.Profile
{
    public class MockExceptionHttpHandlerForProfiles : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var json = @"ErrorJson";

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = new HttpResponseMessage(HttpStatusCode.InternalServerError) { Content = content };

            return Task.FromResult(response);
        }
    }
}
