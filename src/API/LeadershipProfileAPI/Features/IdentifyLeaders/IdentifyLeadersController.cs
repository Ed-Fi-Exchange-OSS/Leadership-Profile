﻿using System.Threading;
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
    [Route("leaders-search")]
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
                    Roles = body.Roles
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
