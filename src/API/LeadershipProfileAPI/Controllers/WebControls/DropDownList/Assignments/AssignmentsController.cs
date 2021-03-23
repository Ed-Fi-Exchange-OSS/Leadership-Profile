using LeadershipProfileAPI.Data.Models;
using LeadershipProfileAPI.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Controllers.WebControls.DropDownList.Assignments
{
    [TypeFilter(typeof(ApiExceptionFilter))]
    [Route("api/webcontrols/dropdownlist/assignments")]
    [ApiController]
    //[Authorize]
    public class AssignmentsController : ControllerBase
    {
        private readonly ILogger<AssignmentsController> _logger;
        private readonly IMediator _mediator;

        public AssignmentsController(ILogger<AssignmentsController> logger, IMediator mediator)
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
