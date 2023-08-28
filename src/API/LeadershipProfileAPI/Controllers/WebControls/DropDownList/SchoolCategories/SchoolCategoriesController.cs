using System.Threading;
using System.Threading.Tasks;
using LeadershipProfileAPI.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace LeadershipProfileAPI.Controllers.WebControls.DropDownList.SchoolCategories
{
    [TypeFilter(typeof(ApiExceptionFilter))]
    [Route("api/webcontrols/dropdownlist/schoolCategories")]
    [ApiController]
    [Authorize]
    public class SchoolCategoriesController : ControllerBase
    {
        private readonly ILogger<SchoolCategoriesController> _logger;
        private readonly IMediator _mediator;

        public SchoolCategoriesController(ILogger<SchoolCategoriesController> logger, IMediator mediator)
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
