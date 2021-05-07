using System.Threading;
using System.Threading.Tasks;
using LeadershipProfileAPI.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace LeadershipProfileAPI.Controllers.WebControls.DropDownList.MeasurementSubCategories
{
    [TypeFilter(typeof(ApiExceptionFilter))]
    [Route("webcontrols/dropdownlist/measurementsubcategories")]
    [ApiController]
    [Authorize]
    public class MeasurementSubCategoryController : ControllerBase
    {
        private readonly ILogger<MeasurementSubCategoryController> _logger;
        private readonly IMediator _mediator;

        public MeasurementSubCategoryController(ILogger<MeasurementSubCategoryController> logger, IMediator mediator)
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
        
        [HttpGet("{id:int}")]
        public async Task<ActionResult> GetAsync([FromRoute] int id, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new Get.Query { Id = id }, cancellationToken);
            return Ok(result);
        }
    }
}
