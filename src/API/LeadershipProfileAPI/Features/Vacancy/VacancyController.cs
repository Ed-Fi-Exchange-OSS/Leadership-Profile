﻿// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using System;
using System.Threading;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data.Models;
using LeadershipProfileAPI.Data.Models.ProfileSearchRequest;
using LeadershipProfileAPI.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace LeadershipProfileAPI.Features.Vacancy
{
    [TypeFilter(typeof(ApiExceptionFilter))]
    [ApiController]
    [Route("api/vacancy")]
    // [Authorize(Roles = "Admin")]
    // [AllowAnonymous]

    public class VacancyController : ControllerBase
    {
        private readonly ILogger<VacancyController> _logger;
        private readonly IMediator _mediator;

        public VacancyController(ILogger<VacancyController> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        [HttpPost("vacancy-projection")]
        public async Task<ActionResult> GetSearchResult([FromBody] VacancyProjectionModel body, CancellationToken cancellationToken)
        {
            try {

            var result = await _mediator.Send(
                new VacancyProjection.Query
                {
                    Role = body.Role
                },
                cancellationToken);

            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
            }
            catch(Exception e) {
                return Ok(e.Message);
            }

        }

    }
}
