using System.Threading;
using System.Threading.Tasks;
using LeadershipProfileAPI.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace LeadershipProfileAPI.Controllers.WebControls.DropDownList.MeasurementCategories
{
    [TypeFilter(typeof(ApiExceptionFilter))]
    [Route("api/webcontrols/dropdownlist/measurementcategories")]
    [ApiController]
    [Authorize]
    public class MeasurementCategoryController : ControllerBase
    {
        private readonly ILogger<MeasurementCategoryController> _logger;
        private readonly IMediator _mediator;

        public MeasurementCategoryController(ILogger<MeasurementCategoryController> logger, IMediator mediator)
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
