using System.Threading;
using System.Threading.Tasks;
using LeadershipProfileAPI.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace LeadershipProfileAPI.Controllers.WebControls.DropDownList.Degrees
{
    [TypeFilter(typeof(ApiExceptionFilter))]
    [Route("api/webcontrols/dropdownlist/degrees")]
    [ApiController]
    [Authorize]
    public class DegreesController : ControllerBase
    {
        private readonly ILogger<DegreesController> _logger;
        private readonly IMediator _mediator;

        public DegreesController(ILogger<DegreesController> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllAsync([FromQuery] List.Query query, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(query, cancellationToken);
            return Ok(result);
        }
    }
}
