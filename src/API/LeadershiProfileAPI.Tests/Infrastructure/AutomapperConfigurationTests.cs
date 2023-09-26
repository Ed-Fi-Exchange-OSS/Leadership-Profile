// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using Xunit;

namespace LeadershipProfileAPI.Tests.Infrastructure
{
    public class AutomapperConfigurationTests
    {
        [Fact]
        public async Task ValidateAutomapperConfig()
        {
            await Testing.ScopeExec((services) =>
            {
                var mapper = services.GetRequiredService<IMapper>();
                mapper.ConfigurationProvider.AssertConfigurationIsValid();

                return Task.CompletedTask;
            });
        }
    }
}
