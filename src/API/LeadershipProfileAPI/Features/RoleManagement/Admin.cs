using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LeadershipProfileAPI.Features.RoleManagement
{
    public class Admin
    {
        public class AddRequest : IRequest<Response>
        {
            public string[] StaffUniqueIds { get; set; }
        }

        public class RemoveRequest : IRequest<Response>
        {
            public string[] StaffUniqueIds { get; set; }
        }

        public class Response
        {
            public bool Result { get; set; }
        }

        public class QueryHandler : IRequestHandler<AddRequest, Response>, IRequestHandler<RemoveRequest, Response>
        {
            private readonly EdFiDbContext _ctx;
            private readonly UserManager<IdentityUser> _userManager;

            public QueryHandler(EdFiDbContext ctx, UserManager<IdentityUser> userManager)
            {
                _ctx = ctx;
                _userManager = userManager;
            }

            public async Task<Response> Handle(AddRequest request, CancellationToken cancellationToken)
            {
                foreach (var id in request.StaffUniqueIds)
                {
                    var user = await GetUser(id);
                    await _userManager.AddClaimsAsync(user, new Claim[]
                    {
                        new ("role", "Admin")
                    });
                }

                return new Response
                {
                    Result = true
                };
            }

            public async Task<Response> Handle(RemoveRequest request, CancellationToken cancellationToken)
            {
                foreach (var id in request.StaffUniqueIds)
                {
                    var user = await GetUser(id);
                    await _userManager.RemoveClaimAsync(user, new Claim("role", "Admin"));
                }

                return new Response
                {
                    Result = true
                };
            }

            protected async Task<IdentityUser> GetUser(string staffUniqueId)
            {
                var staff = await _ctx.Staff.SingleOrDefaultAsync(x => x.StaffUniqueId == staffUniqueId);
                var user = await _userManager.Users.SingleOrDefaultAsync(x => x.UserName == staff.TpdmUsername);
                return user;
            }
        }
    }
}
