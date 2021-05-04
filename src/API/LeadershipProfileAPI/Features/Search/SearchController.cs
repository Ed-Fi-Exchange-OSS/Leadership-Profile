using System.Threading;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data.Models.ProfileSearchRequest;
using LeadershipProfileAPI.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace LeadershipProfileAPI.Features.Search
{
    [TypeFilter(typeof(ApiExceptionFilter))]
    [ApiController]
    [Route("search")]
    [Authorize(Roles = "Admin")]
    public class SearchController : ControllerBase
    {
        private readonly ILogger<SearchController> _logger;
        private readonly IMediator _mediator;

        public SearchController(ILogger<SearchController> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<ActionResult> GetProfile([FromQuery] ProfileSearchRequestQuery query, [FromBody] ProfileSearchRequestBody body, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(
                new List.Query
                {
                    Page = query.Page,
                    SortBy = query.SortBy,
                    SortField = query.SortField,
                    SearchRequestBody = body
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
