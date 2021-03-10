using System.Threading.Tasks;
using LeadershipProfileAPI.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LeadershipProfileAPI.Features.UserClaims
{
    [TypeFilter(typeof(ApiExceptionFilter))]
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "Admin")]
    public class UserClaimsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UserClaimsController(IMediator mediator) => _mediator = mediator;

        [HttpGet]
        public async Task<ActionResult> List([FromQuery] List.Query query)
        {
            var result = await _mediator.Send(query);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult> AddClaimAsync([FromBody] Create.Command request)
        {
            var result = await _mediator.Send(request);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteClaimAsync([FromBody] Delete.Command request)
        {
            var result = await _mediator.Send(request);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }
    }
}