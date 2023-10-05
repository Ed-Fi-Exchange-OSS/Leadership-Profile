﻿// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using System.Threading;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data.Models;
using LeadershipProfileAPI.Data.Models.ProfileSearchRequest;
using LeadershipProfileAPI.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace LeadershipProfileAPI.Features.IdentifyLeaders
{
    [TypeFilter(typeof(ApiExceptionFilter))]
    [ApiController]
    [Route("api/leaders-search")]
    // [Authorize(Roles = "Admin")]
    // [AllowAnonymous]

    public class IdentifyLeadersController : ControllerBase
    {
        private readonly ILogger<IdentifyLeadersController> _logger;
        private readonly IMediator _mediator;

        public IdentifyLeadersController(ILogger<IdentifyLeadersController> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<ActionResult> GetSearchResult([FromBody] LeaderSearchRequestBody body, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(
                new List.Query
                {
                    Roles = body.Roles,
                    SchoolLevels = body.SchoolLevels,
                    HighestDegrees = body.HighestDegrees,
                    HasCertification = body.HasCertification,
                    YearsOfExperience = body.YearsOfExperience,
                    OverallScore = body.OverallScore,
                    DomainOneScore = body.DomainOneScore,
                    DomainTwoScore = body.DomainTwoScore,
                    DomainThreeScore = body.DomainThreeScore,
                    DomainFourScore = body.DomainFourScore,
                    DomainFiveScore = body.DomainFiveScore
                },
                cancellationToken);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }
    }
}
