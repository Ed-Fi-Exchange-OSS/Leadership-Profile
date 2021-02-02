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

        [HttpPost("add-admin")]
        [Authorize]
        public async Task<ActionResult> AddAdminRole(string[] staffUniqueIds)
        {
            foreach (var id in staffUniqueIds)
            {
                var staff = await _dbContext.Staff.SingleOrDefaultAsync(x => x.StaffUniqueId == id);
                var user = await _userManager.Users.SingleOrDefaultAsync(x => x.UserName == staff.TpdmUsername);
                await _userManager.AddClaimsAsync(user, new Claim[]
                {
                    new ("role", "Admin")
                });
            }

            return Ok();
        }
    }
}