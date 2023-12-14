// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using System;
using System.Net.Http;

namespace LeadershipProfileAPI.Tests.Infrastructure.Profile
{
    public class MocExceptionkHttpClientFactory : IHttpClientFactory
    {
        public HttpClient CreateClient(string name)
        {
            return new HttpClient(new MockExceptionHttpHandlerForProfiles())
            {
                BaseAddress = new Uri(@"https://api.ed-fi.org/")
            };
        }
    }
}
