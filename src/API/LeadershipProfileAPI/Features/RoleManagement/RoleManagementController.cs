using System;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using LeadershipProfileAPI.Features.Profile;
using LeadershipProfileAPI.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace LeadershipProfileAPI.Features.RoleManagement
{
    [TypeFilter(typeof(ApiExceptionFilter))]
    [ApiController]
    [Route("[controller]")]
    public class RoleManagementController : ControllerBase
    {
        private readonly ILogger<ProfileController> _logger;
        private readonly IHttpClientFactory _clientFactory;
        private readonly IMediator _mediator;

        public RoleManagementController(ILogger<ProfileController> logger, IHttpClientFactory clientFactory, IMediator mediator)
        {
            _logger = logger;
            _clientFactory = clientFactory;
            _mediator = mediator;
        }

        [HttpGet("list")]
        [Authorize(Roles = "Admin")] //make constant
        public async Task<ActionResult> List([FromQuery] List.Query query)
        {
            var result = await _mediator.Send(query);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        } 

        [HttpPost("add-admin")]
        [Authorize(Roles = "Admin")] //make constant
        public async Task<ActionResult> AddAdminRole(Admin.AddRequest request)
        {
            var result = await _mediator.Send(request);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete("remove-admin")]
        [Authorize(Roles = "Admin")] //make constant
        public async Task<ActionResult> RemoveAdminRole(Admin.RemoveRequest request)
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