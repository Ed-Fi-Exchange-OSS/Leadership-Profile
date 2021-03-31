using System.Threading;
using System.Threading.Tasks;
using LeadershipProfileAPI.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace LeadershipProfileAPI.Controllers.WebControls.DropDownList.Certifications
{
    [TypeFilter(typeof(ApiExceptionFilter))]
    [Route("webcontrols/dropdownlist/certifications")]
    [ApiController]
    [Authorize]
    public class CertificationsController : ControllerBase
    {
        private readonly ILogger<CertificationsController> _logger;
        private readonly IMediator _mediator;

        public CertificationsController(ILogger<CertificationsController> logger, IMediator mediator)
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
